
-- Add user_id to professionals to link them to auth users
ALTER TABLE public.professionals ADD COLUMN user_id uuid DEFAULT NULL;

-- Add unique constraint so one user can only be linked to one professional
ALTER TABLE public.professionals ADD CONSTRAINT professionals_user_id_unique UNIQUE (user_id);

-- Allow professionals to view their own business bookings
CREATE POLICY "Professionals can view own bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (
    professional_id IN (
      SELECT id FROM professionals WHERE user_id = auth.uid()
    )
  );

-- Allow professionals to update their own bookings (e.g. confirm/cancel)
CREATE POLICY "Professionals can update own bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (
    professional_id IN (
      SELECT id FROM professionals WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    professional_id IN (
      SELECT id FROM professionals WHERE user_id = auth.uid()
    )
  );

-- Allow professionals to view their own professional record
CREATE POLICY "Professionals can view own record"
  ON public.professionals FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
