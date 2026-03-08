
-- Allow admins to delete businesses
CREATE POLICY "Admins can delete businesses"
ON public.businesses FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete bookings
CREATE POLICY "Admins can delete bookings"
ON public.bookings FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow owners to delete their own bookings
CREATE POLICY "Owners can delete bookings"
ON public.bookings FOR DELETE
TO authenticated
USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));
