ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS temporary_registration_closes_at TIMESTAMPTZ;
