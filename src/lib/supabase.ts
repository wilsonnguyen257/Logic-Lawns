import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Check your .env file.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Types based on the expected schema
export type BookingStatus = 'pending' | 'confirmed' | 'completed';

export interface Booking {
  id: string;
  name: string;
  phone: string;
  address: string;
  service: string;
  notes?: string;
  status: BookingStatus;
  created_at: string;
}