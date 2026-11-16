/*
# Create documents table and storage bucket for Document AI module

1. New Tables
- `documents`
  - `id` (uuid, primary key, default gen_random_uuid())
  - `title` (text, not null) — the original file name
  - `file_path` (text, not null) — storage path within the `documents` bucket
  - `file_size` (text, not null) — human-readable file size
  - `summary` (text, nullable) — AI-generated summary, null until processing completes
  - `created_at` (timestamptz, default now())
2. Storage
- Create bucket `documents` (public read, authenticated write) for PDF/TXT uploads
3. Security
- Enable RLS on `documents`.
- Single-tenant app (no sign-in): allow anon + authenticated full CRUD on documents table.
- Storage policies: public read, authenticated + anon upload on `documents` bucket.
*/

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  file_path text NOT NULL,
  file_size text NOT NULL,
  summary text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_documents" ON documents;
CREATE POLICY "anon_select_documents" ON documents FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_documents" ON documents;
CREATE POLICY "anon_insert_documents" ON documents FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_documents" ON documents;
CREATE POLICY "anon_update_documents" ON documents FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_documents" ON documents;
CREATE POLICY "anon_delete_documents" ON documents FOR DELETE
  TO anon, authenticated USING (true);

-- Storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: allow public read, anon + authenticated upload
DROP POLICY IF EXISTS "anon_read_documents_storage" ON storage.objects;
CREATE POLICY "anon_read_documents_storage" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'documents');

DROP POLICY IF EXISTS "anon_upload_documents_storage" ON storage.objects;
CREATE POLICY "anon_upload_documents_storage" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'documents');

DROP POLICY IF EXISTS "anon_update_documents_storage" ON storage.objects;
CREATE POLICY "anon_update_documents_storage" ON storage.objects
  FOR UPDATE TO anon, authenticated
  USING (bucket_id = 'documents') WITH CHECK (bucket_id = 'documents');

DROP POLICY IF EXISTS "anon_delete_documents_storage" ON storage.objects;
CREATE POLICY "anon_delete_documents_storage" ON storage.objects
  FOR DELETE TO anon, authenticated
  USING (bucket_id = 'documents');
