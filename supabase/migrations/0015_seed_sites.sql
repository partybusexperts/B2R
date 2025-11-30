insert into public.sites (id, slug, name, created_at, updated_at)
values
    ('0bad4d72-82be-442b-a8eb-f7e18b587e95', 'default', 'Default', '2025-09-09T22:26:56.344589Z', '2025-09-10T00:49:10.119425Z')
on conflict (id) do update set
    slug = excluded.slug,
    name = excluded.name,
    updated_at = excluded.updated_at;
