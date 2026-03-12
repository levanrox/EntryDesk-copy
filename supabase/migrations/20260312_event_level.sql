do $$
begin
    if not exists (
        select 1
        from pg_type
        where typname = 'event_level'
    ) then
        create type event_level as enum ('district', 'state', 'national', 'international');
    end if;
end
$$;

alter table public.events
add column if not exists event_level event_level;

comment on column public.events.event_level is 'Competition scope such as district, state, national, or international.';