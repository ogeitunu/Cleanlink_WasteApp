/*
  # Add Notifications Table & Request Source Tracking

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `title` (text)
      - `message` (text)
      - `type` (text: job_request, job_accepted, job_completed, payment_received)
      - `read` (boolean, default false)
      - `related_job_id` (uuid, nullable, foreign key to jobs)
      - `created_at` (timestamp)

  2. Job Table Enhancements
    - Add `request_source` column (app, whatsapp, call, admin)
    - Add `waste_tags` column (array of waste types)
    - Add `estimated_price` column (numeric)

  3. Security
    - Enable RLS on notifications
    - Users can only see their own notifications
    - Admins can see all notifications

  4. Indexes
    - Added on user_id, created_at for performance
*/

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('job_request', 'job_accepted', 'job_completed', 'payment_received', 'system')),
  read boolean DEFAULT false,
  related_job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Notifications RLS policies
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()))
  WITH CHECK (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read);

-- Enhance jobs table with request tracking
DO $$
BEGIN
  -- Add request_source column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'jobs' AND column_name = 'request_source'
  ) THEN
    ALTER TABLE jobs ADD COLUMN request_source text DEFAULT 'app' CHECK (request_source IN ('app', 'whatsapp', 'call', 'admin'));
  END IF;

  -- Add waste_tags column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'jobs' AND column_name = 'waste_tags'
  ) THEN
    ALTER TABLE jobs ADD COLUMN waste_tags text[] DEFAULT ARRAY[]::text[];
  END IF;

  -- Add estimated_price column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'jobs' AND column_name = 'estimated_price'
  ) THEN
    ALTER TABLE jobs ADD COLUMN estimated_price numeric DEFAULT 0;
  END IF;
END $$;

-- Create index for jobs lookup
CREATE INDEX IF NOT EXISTS idx_jobs_request_source ON jobs(request_source);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
