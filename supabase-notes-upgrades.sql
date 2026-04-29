-- Ejecuta este SQL en Supabase > SQL Editor para habilitar:
-- etiquetas, recordatorios e imágenes en Storage.

alter table public.notes
  add column if not exists labels text[] not null default '{}',
  add column if not exists reminder_at timestamptz;

create index if not exists notes_labels_idx
  on public.notes using gin (labels);

create index if not exists notes_reminder_at_idx
  on public.notes (reminder_at)
  where reminder_at is not null;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'note-images',
  'note-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Anyone can view note images'
  ) then
    create policy "Anyone can view note images"
      on storage.objects for select
      to public
      using (bucket_id = 'note-images');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Users can upload own note images'
  ) then
    create policy "Users can upload own note images"
      on storage.objects for insert
      to authenticated
      with check (
        bucket_id = 'note-images'
        and (storage.foldername(name))[1] = auth.uid()::text
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Users can update own note images'
  ) then
    create policy "Users can update own note images"
      on storage.objects for update
      to authenticated
      using (
        bucket_id = 'note-images'
        and (storage.foldername(name))[1] = auth.uid()::text
      )
      with check (
        bucket_id = 'note-images'
        and (storage.foldername(name))[1] = auth.uid()::text
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Users can delete own note images'
  ) then
    create policy "Users can delete own note images"
      on storage.objects for delete
      to authenticated
      using (
        bucket_id = 'note-images'
        and (storage.foldername(name))[1] = auth.uid()::text
      );
  end if;
end $$;
