import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          auth_id: string;
          role: 'collector' | 'resident' | 'admin';
          full_name: string;
          email: string;
          phone: string | null;
          nin: string | null;
          verified: boolean;
          avatar_url: string | null;
          created_at: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          requester_id: string;
          collector_id: string | null;
          status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
          waste_type: string;
          latitude: number;
          longitude: number;
          address: string | null;
          notes: string | null;
          created_at: string;
          completed_at: string | null;
        };
      };
      payments: {
        Row: {
          id: string;
          job_id: string;
          collector_id: string;
          amount: number;
          status: 'pending' | 'paid' | 'failed';
          created_at: string;
          paid_at: string | null;
        };
      };
      rewards: {
        Row: {
          id: string;
          user_id: string;
          points: number;
          type: 'earned' | 'redeemed' | 'bonus';
          job_id: string | null;
          created_at: string;
        };
      };
    };
  };
};
