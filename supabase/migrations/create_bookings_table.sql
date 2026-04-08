-- Create an enum type for booking statuses
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed');

-- Create the bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  service TEXT NOT NULL,
  notes TEXT,
  status booking_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert new bookings (submit the form)
CREATE POLICY "Allow public to submit bookings"
ON bookings FOR INSERT
TO anon
WITH CHECK (true);

-- Allow authenticated users to view all bookings (for the admin dashboard)
-- Note: Since we are using a simple dummy login right now without Supabase Auth,
-- we'll allow anon to SELECT and UPDATE for demonstration purposes.
-- In a real production app, you should use Supabase Auth and restrict these to 'authenticated' users.
CREATE POLICY "Allow public to view bookings"
ON bookings FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow public to update bookings"
ON bookings FOR UPDATE
TO anon
USING (true);
