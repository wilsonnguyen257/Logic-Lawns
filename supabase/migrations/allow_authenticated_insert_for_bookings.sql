-- Allow authenticated admins to create bookings from the dashboard
-- while keeping public form submission available through the anon policy.
CREATE POLICY "Allow authenticated to insert bookings"
ON bookings FOR INSERT
TO authenticated
WITH CHECK (true);
