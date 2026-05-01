-- Saneamento de papéis e multi-unit:
--
-- 1) Admin com acesso total: services, professionals, availability,
--    professional_services e bookings. (Antes admin só tinha acesso a
--    businesses/categories/locations/banners.)
--
-- 2) Owner pode ver as próprias reservas (read da própria empresa).
--
-- 3) Multi-unit: função get_max_businesses(user) e trigger validador no
--    INSERT de businesses. Plano Pro libera até 5 unidades, Basic e Free
--    seguem em 1 unidade. Admin não tem limite.

-- ============================================================
-- 1. Admin pode gerenciar tudo dos negócios
-- ============================================================

DROP POLICY IF EXISTS "Admins manage services" ON public.services;
CREATE POLICY "Admins manage services" ON public.services
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins manage professionals" ON public.professionals;
CREATE POLICY "Admins manage professionals" ON public.professionals
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins manage availability" ON public.availability;
CREATE POLICY "Admins manage availability" ON public.availability
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins manage professional_services" ON public.professional_services;
CREATE POLICY "Admins manage professional_services" ON public.professional_services
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins view all bookings" ON public.bookings;
CREATE POLICY "Admins view all bookings" ON public.bookings
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins update all bookings" ON public.bookings;
CREATE POLICY "Admins update all bookings" ON public.bookings
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins delete bookings" ON public.bookings;
CREATE POLICY "Admins delete bookings" ON public.bookings
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- ============================================================
-- 2. Owners veem as próprias reservas (PII apenas para o dono)
-- ============================================================

DROP POLICY IF EXISTS "Owners view own business bookings" ON public.bookings;
CREATE POLICY "Owners view own business bookings" ON public.bookings
  FOR SELECT TO authenticated
  USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Owners delete own business bookings" ON public.bookings;
CREATE POLICY "Owners delete own business bookings" ON public.bookings
  FOR DELETE TO authenticated
  USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE owner_id = auth.uid()
    )
  );

-- ============================================================
-- 3. Admin pode atualizar QUALQUER business (transferir propriedade)
-- ============================================================

DROP POLICY IF EXISTS "Admins update any business" ON public.businesses;
CREATE POLICY "Admins update any business" ON public.businesses
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins delete any business" ON public.businesses;
CREATE POLICY "Admins delete any business" ON public.businesses
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins insert any business" ON public.businesses;
CREATE POLICY "Admins insert any business" ON public.businesses
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- ============================================================
-- 4. Multi-unit: get_max_businesses + trigger no insert
-- ============================================================

-- Plano Pro = 5 unidades. Basic/Free = 1.
-- Verifica se o usuário tem ALGUMA empresa com subscription ativa em plano Pro.
-- Se tiver, libera adicionar mais unidades (multi-unit / franquia).
CREATE OR REPLACE FUNCTION public.get_max_businesses(_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  has_pro boolean;
  is_admin_user boolean;
BEGIN
  SELECT public.has_role(_user_id, 'admin'::public.app_role) INTO is_admin_user;
  IF is_admin_user THEN
    RETURN 999; -- admin sem limite
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions s
    JOIN public.businesses b ON b.id = s.business_id
    WHERE b.owner_id = _user_id
      AND s.status = 'active'
      AND s.plan ILIKE 'pro%'
  ) INTO has_pro;

  IF has_pro THEN
    RETURN 5;
  END IF;
  RETURN 1;
END;
$$;

CREATE OR REPLACE FUNCTION public.enforce_business_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_count integer;
  max_allowed integer;
BEGIN
  IF NEW.owner_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Admin pode criar empresa para qualquer dono sem limite (a checagem
  -- abaixo só roda quando o INSERT vem do próprio dono).
  IF public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RETURN NEW;
  END IF;

  SELECT COUNT(*) INTO current_count
  FROM public.businesses
  WHERE owner_id = NEW.owner_id;

  SELECT public.get_max_businesses(NEW.owner_id) INTO max_allowed;

  IF current_count >= max_allowed THEN
    RAISE EXCEPTION 'Limite de % unidade(s) atingido para o seu plano. Faça upgrade para o plano Pro para múltiplas unidades.', max_allowed
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_business_limit ON public.businesses;
CREATE TRIGGER trg_enforce_business_limit
  BEFORE INSERT ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_business_limit();
