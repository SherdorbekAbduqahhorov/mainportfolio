/*
# Create portfolio image storage bucket

Plain-English summary: adds a public image storage area for the profile photo and project cover images, so the owner can upload pictures directly instead of pasting links.

1. New storage
- Bucket `portfolio-images`: public (images load on the portfolio page by URL), 5 MB per file limit, JPG/PNG/WebP/GIF only.

2. Security
- Anyone can view images by their link (needed for the public site).
- Only the owner account (checked with public.is_owner()) can upload, replace, or delete files in this bucket.
- No other tables are changed.

3. Notes
- Uses ON CONFLICT so the migration is safe to re-run.
- Policies are dropped and recreated so re-running does not duplicate them.
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-images',
  'portfolio-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "owner_insert_portfolio_images" ON storage.objects;
CREATE POLICY "owner_insert_portfolio_images" ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-images' AND public.is_owner());

DROP POLICY IF EXISTS "owner_update_portfolio_images" ON storage.objects;
CREATE POLICY "owner_update_portfolio_images" ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-images' AND public.is_owner())
WITH CHECK (bucket_id = 'portfolio-images' AND public.is_owner());

DROP POLICY IF EXISTS "owner_delete_portfolio_images" ON storage.objects;
CREATE POLICY "owner_delete_portfolio_images" ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-images' AND public.is_owner());
