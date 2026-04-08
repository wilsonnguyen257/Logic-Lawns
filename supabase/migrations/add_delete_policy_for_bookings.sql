-- Allow public users to delete bookings.
-- Note: this matches the current demo setup where the admin dashboard uses the anon key.
-- In production, replace this with authenticated-only policies.
CREATE POLICY "Allow public to delete bookings"
ON bookings FOR DELETE
TO anon
USING (true);
