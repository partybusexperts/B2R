insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
    ('vehicles', 'vehicles', true, null, null),
    ('vehicles1', 'vehicles1', true, null, null),
    ('Events1', 'Events1', true, null, null),
    ('Blog', 'Blog', true, null, null)
on conflict (id) do update set
    name = excluded.name,
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;
