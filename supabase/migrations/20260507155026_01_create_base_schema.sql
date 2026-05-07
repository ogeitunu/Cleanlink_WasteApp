/*
  # Create CleanLinka Core Tables

  1. New Tables
    - `users`: User profiles (collectors, residents, admins)
      - `id` (uuid, primary key)
      - `auth_id` (uuid, foreign key to auth.users)
      - `role` (text: collector, resident, admin)
      - `full_name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `nin` (text: national ID number)
      - `verified` (boolean, default false)
      - `avatar_url` (text)
      - `created_at` (timestamp)

    - `jobs`: Waste pickup jobs
      - `id` (uuid, primary key)
      - `requester_id` (uuid, foreign key to users)
      - `collector_id` (uuid, foreign key to users, nullable)
      - `status` (text: pending, accepted, in_progress, completed, cancelled)
      - `waste_type` (text)
      - `latitude` (float)
      - `longitude` (float)
      - `address` (text)
      - `notes` (text)
      - `created_at` (timestamp)
      - `completed_at` (timestamp, nullable)

    - `collector_locations`: Real-time collector GPS tracking
      - `id` (uuid, primary key)
      - `collector_id` (uuid, foreign key to users)
      - `latitude` (float)
      - `longitude` (float)
      - `updated_at` (timestamp)

    - `payments`: Payment tracking for completed jobs
      - `id` (uuid, primary key)
      - `job_id` (uuid, foreign key to jobs)
      - `collector_id` (uuid, foreign key to users)
      - `amount` (numeric)
      - `status` (text: pending, paid, failed)
      - `created_at` (timestamp)
      - `paid_at` (timestamp, nullable)

    - `rewards`: Reward points system
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `points` (integer)
      - `type` (text: earned, redeemed, bonus)
      - `job_id` (uuid, nullable, foreign key to jobs)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Collectors can view/update own data
    - Residents can view own jobs
    - Admins have broader access
    - Payment and rewards data are private

  3. Indexes
    - Added on frequently queried columns for performance
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('collector', 'resident', 'admin')),
  full_name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  nin text,
  verified boolean DEFAULT false,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_id)
  WITH CHECK (auth.uid() = auth_id);

CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid() AND role = 'admin'
    )
  );

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  collector_id uuid REFERENCES users(id) ON DELETE SET NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
  waste_type text NOT NULL,
  latitude float NOT NULL,
  longitude float NOT NULL,
  address text,
  notes text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Residents can view own jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (
    requester_id = (SELECT id FROM users WHERE auth_id = auth.uid())
    OR
    collector_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Collectors can view all pending jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (
    status = 'pending'
    OR
    collector_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Residents can create jobs"
  ON jobs FOR INSERT
  TO authenticated
  WITH CHECK (
    requester_id = (SELECT id FROM users WHERE auth_id = auth.uid() AND role = 'resident')
  );

CREATE POLICY "Collectors can update assigned jobs"
  ON jobs FOR UPDATE
  TO authenticated
  USING (
    collector_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  )
  WITH CHECK (
    collector_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- Create collector locations table
CREATE TABLE IF NOT EXISTS collector_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collector_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  latitude float NOT NULL,
  longitude float NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE collector_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Collectors can update own location"
  ON collector_locations FOR UPDATE
  TO authenticated
  USING (
    collector_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  )
  WITH CHECK (
    collector_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Users can view collector locations"
  ON collector_locations FOR SELECT
  TO authenticated
  USING (true);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  collector_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount numeric NOT NULL DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  created_at timestamptz DEFAULT now(),
  paid_at timestamptz
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Collectors can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    collector_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid() AND role = 'admin'
    )
  );

-- Create rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points integer NOT NULL DEFAULT 0,
  type text NOT NULL CHECK (type IN ('earned', 'redeemed', 'bonus')),
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own rewards"
  ON rewards FOR SELECT
  TO authenticated
  USING (
    user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Users can earn rewards on own jobs"
  ON rewards FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(auth_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_jobs_requester_id ON jobs(requester_id);
CREATE INDEX IF NOT EXISTS idx_jobs_collector_id ON jobs(collector_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_collector_locations_collector_id ON collector_locations(collector_id);
CREATE INDEX IF NOT EXISTS idx_payments_collector_id ON payments(collector_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_rewards_user_id ON rewards(user_id);
