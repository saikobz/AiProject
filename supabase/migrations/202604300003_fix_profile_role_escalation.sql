-- Block non-admins from changing profiles.role (privilege escalation via RLS update).

create or replace function private.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role is distinct from old.role and not private.is_admin() then
    raise exception 'Only admins can change profile roles';
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_protect_role on public.profiles;

create trigger profiles_protect_role
before update on public.profiles
for each row
execute function private.protect_profile_role();
