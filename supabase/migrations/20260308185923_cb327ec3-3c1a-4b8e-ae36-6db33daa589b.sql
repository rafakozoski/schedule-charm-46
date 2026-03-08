-- Allow admins to insert businesses (for any owner)
CREATE POLICY "Admins can insert businesses"
ON public.businesses FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to manage availability
CREATE POLICY "Admins can manage availability"
ON public.availability FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to manage services
CREATE POLICY "Admins can manage services"
ON public.services FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to manage professionals
CREATE POLICY "Admins can manage professionals"
ON public.professionals FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to manage professional_services
CREATE POLICY "Admins can manage professional_services"
ON public.professional_services FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));