-- Tighten booking data integrity and move admin actions behind authenticated sessions.

ALTER TABLE bookings
ADD CONSTRAINT bookings_service_check
CHECK (service IN ('quickTrim', 'fullResidential', 'cleanUp', 'other'));

DROP POLICY IF EXISTS "Allow public to view bookings" ON bookings;
DROP POLICY IF EXISTS "Allow public to update bookings" ON bookings;
DROP POLICY IF EXISTS "Allow public to delete bookings" ON bookings;

CREATE POLICY "Allow authenticated to view bookings"
ON bookings FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated to update bookings"
ON bookings FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated to delete bookings"
ON bookings FOR DELETE
TO authenticated
USING (true);
