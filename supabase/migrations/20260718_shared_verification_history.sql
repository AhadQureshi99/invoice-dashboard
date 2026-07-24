-- Multiple people at the same company each added the SAME seller NTN under
-- their own separate login (no formal team-invite link between them), so the
-- old "only see verifications you personally ran" rule meant each person saw
-- only their own slice of a shared company's FBR filing history — while FBR's
-- own IRIS portal shows every filing for that NTN regardless of who filed it.
--
-- Fix: a user can now also see (and log activity against) any verification
-- whose seller_ntn matches a company THEY have added in their own Settings —
-- i.e. visibility follows "do you manage this company", not "did you click
-- Verify". This does not expose verifications for a company you have no
-- relationship to.
drop policy if exists "verifications read" on public.verifications;
create policy "verifications read" on public.verifications for select using (
  auth.uid() = user_id
  or user_id is null
  or exists (
    select 1 from public.sellers s
    where s.user_id = auth.uid()
      and s.ntn = verifications.seller_ntn
  )
);
