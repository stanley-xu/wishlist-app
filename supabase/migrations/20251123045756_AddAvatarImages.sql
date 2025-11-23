-- Set up Storage!
insert into storage.buckets (id, name)  values ('avatars', 'avatars');
-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage/security/access-control#policy-examples for more details.
create policy "Avatar images are publicly accessible." on storage.objects 
for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
for insert with check (bucket_id = 'avatars');

create policy "Anyone can update their own avatar." on storage.objects
for update using ((select auth.uid()) = owner) with check (bucket_id = 'avatars');
