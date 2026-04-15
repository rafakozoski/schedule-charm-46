
-- Function to enforce free-plan booking limit (10/month)
CREATE OR REPLACE FUNCTION public.enforce_free_plan_booking_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_featured boolean;
  monthly_count integer;
  month_start date;
  month_end date;
BEGIN
  -- Only check if business_id is provided
  IF NEW.business_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Check if business is on free plan (not featured)
  SELECT featured INTO is_featured
  FROM public.businesses
  WHERE id = NEW.business_id;

  -- If featured (paid plan), allow
  IF is_featured IS TRUE THEN
    RETURN NEW;
  END IF;

  -- Count bookings this month
  month_start := date_trunc('month', CURRENT_DATE)::date;
  month_end := (date_trunc('month', CURRENT_DATE) + interval '1 month' - interval '1 day')::date;

  SELECT COUNT(*)::integer INTO monthly_count
  FROM public.bookings
  WHERE business_id = NEW.business_id
    AND booking_date >= month_start
    AND booking_date <= month_end
    AND status <> 'cancelled';

  IF monthly_count >= 10 THEN
    RAISE EXCEPTION 'Limite de agendamentos do plano gratuito atingido (10/mês)';
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger to enforce the limit before inserting a booking
CREATE TRIGGER enforce_free_plan_limit
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_free_plan_booking_limit();
