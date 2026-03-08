INSERT INTO public.user_roles (user_id, role)
VALUES ('54d4ccb0-73bf-4521-880e-b93c0b2fcc2f', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;