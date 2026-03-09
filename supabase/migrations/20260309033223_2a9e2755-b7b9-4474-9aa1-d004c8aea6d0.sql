
CREATE TABLE public.locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state_code text NOT NULL,
  state_name text NOT NULL,
  city text NOT NULL,
  neighborhood text NOT NULL
);

CREATE INDEX idx_locations_state ON public.locations(state_code);
CREATE INDEX idx_locations_city ON public.locations(city);
CREATE INDEX idx_locations_state_city ON public.locations(state_code, city);

ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view locations" ON public.locations FOR SELECT USING (true);
CREATE POLICY "Admins can manage locations" ON public.locations FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
