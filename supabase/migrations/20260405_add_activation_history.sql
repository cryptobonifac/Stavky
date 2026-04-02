-- Activation history table to track all activation periods set by admin
CREATE TABLE public.activation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  active_from timestamptz NOT NULL,
  active_to timestamptz NOT NULL,
  activated_by uuid NOT NULL REFERENCES public.users(id),
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT active_from_before_active_to CHECK (active_from <= active_to)
);

CREATE INDEX idx_activation_history_user_id ON public.activation_history(user_id);

ALTER TABLE public.activation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activation_history FORCE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "betting role manage activation history"
  ON public.activation_history
  FOR ALL
  USING (public.has_role('betting'))
  WITH CHECK (public.has_role('betting'));

-- Users can view their own activation history
CREATE POLICY "users view own activation history"
  ON public.activation_history
  FOR SELECT
  USING (auth.uid() = user_id);
