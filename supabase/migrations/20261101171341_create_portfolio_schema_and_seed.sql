/*
# Portfolio backend: profile, skills, projects, messages

Plain-English summary
- Creates the content tables behind the portfolio website and its owner profile page.
- Visitors can read the portfolio content and send a contact message.
- Only the site owner (the account with the owner email) can edit content or read messages.
- Pre-fills the profile, skills, and projects with the owner's existing information.

1. New Tables
- `profile`: single row with the owner's hero, about, education, and contact details.
- `skills`: skill name, icon key, and proficiency level (0-100).
- `projects`: title, description, tag, and optional live, repository, and image links.
- `messages`: contact form submissions with a read flag.

2. New Function
- `is_owner()`: returns true only when the signed-in user is the confirmed owner account.

3. Security
- Row Level Security enabled on every table.
- Public (anon and signed-in) can read profile, skills, and projects.
- Only the owner can insert, update, or delete skills and projects, and update the profile.
- Anyone can insert a message with validated lengths; only the owner can read, mark as read, or delete messages.
- Grants limited to the verbs each role uses.

4. Important Notes
- Seed inserts only run when the target table is empty, so re-running this migration never duplicates content.
- The owner account must be created through the sign-up form before owner-only actions work.
*/

CREATE TABLE IF NOT EXISTS profile (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  name text NOT NULL DEFAULT '',
  greeting text NOT NULL DEFAULT '',
  job_title text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  available boolean NOT NULL DEFAULT true,
  avatar_url text NOT NULL DEFAULT '',
  about_title text NOT NULL DEFAULT '',
  about_paragraphs text[] NOT NULL DEFAULT '{}',
  languages text NOT NULL DEFAULT '',
  education text NOT NULL DEFAULT '',
  ielts_score text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  instagram_url text NOT NULL DEFAULT '',
  telegram_url text NOT NULL DEFAULT '',
  github_url text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 60),
  icon text NOT NULL DEFAULT 'code',
  level integer NOT NULL DEFAULT 50 CHECK (level BETWEEN 0 AND 100),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 120),
  description text NOT NULL DEFAULT '' CHECK (char_length(description) <= 1000),
  tag text NOT NULL DEFAULT '' CHECK (char_length(tag) <= 40),
  live_url text NOT NULL DEFAULT '' CHECK (char_length(live_url) <= 500),
  repo_url text NOT NULL DEFAULT '' CHECK (char_length(repo_url) <= 500),
  image_url text NOT NULL DEFAULT '' CHECK (char_length(image_url) <= 500),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 200),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 2000),
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users u
    WHERE u.id = auth.uid()
      AND lower(u.email) = 'abduqahhorovsherdorbek770@gmail.com'
      AND u.email_confirmed_at IS NOT NULL
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_owner() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_owner() TO authenticated;

ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON profile TO anon, authenticated;
GRANT UPDATE ON profile TO authenticated;
GRANT SELECT ON skills TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON skills TO authenticated;
GRANT SELECT ON projects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON projects TO authenticated;
GRANT INSERT ON messages TO anon, authenticated;
GRANT SELECT, DELETE ON messages TO authenticated;
GRANT UPDATE (is_read) ON messages TO authenticated;

DROP POLICY IF EXISTS "public_select_profile" ON profile;
CREATE POLICY "public_select_profile" ON profile FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "owner_update_profile" ON profile;
CREATE POLICY "owner_update_profile" ON profile FOR UPDATE
  TO authenticated USING (public.is_owner()) WITH CHECK (public.is_owner());

DROP POLICY IF EXISTS "public_select_skills" ON skills;
CREATE POLICY "public_select_skills" ON skills FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "owner_insert_skills" ON skills;
CREATE POLICY "owner_insert_skills" ON skills FOR INSERT
  TO authenticated WITH CHECK (public.is_owner());
DROP POLICY IF EXISTS "owner_update_skills" ON skills;
CREATE POLICY "owner_update_skills" ON skills FOR UPDATE
  TO authenticated USING (public.is_owner()) WITH CHECK (public.is_owner());
DROP POLICY IF EXISTS "owner_delete_skills" ON skills;
CREATE POLICY "owner_delete_skills" ON skills FOR DELETE
  TO authenticated USING (public.is_owner());

DROP POLICY IF EXISTS "public_select_projects" ON projects;
CREATE POLICY "public_select_projects" ON projects FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "owner_insert_projects" ON projects;
CREATE POLICY "owner_insert_projects" ON projects FOR INSERT
  TO authenticated WITH CHECK (public.is_owner());
DROP POLICY IF EXISTS "owner_update_projects" ON projects;
CREATE POLICY "owner_update_projects" ON projects FOR UPDATE
  TO authenticated USING (public.is_owner()) WITH CHECK (public.is_owner());
DROP POLICY IF EXISTS "owner_delete_projects" ON projects;
CREATE POLICY "owner_delete_projects" ON projects FOR DELETE
  TO authenticated USING (public.is_owner());

DROP POLICY IF EXISTS "visitor_insert_messages" ON messages;
CREATE POLICY "visitor_insert_messages" ON messages FOR INSERT
  TO anon, authenticated WITH CHECK (
    char_length(name) BETWEEN 1 AND 100
    AND char_length(email) BETWEEN 3 AND 200
    AND char_length(message) BETWEEN 1 AND 2000
    AND is_read = false
  );
DROP POLICY IF EXISTS "owner_select_messages" ON messages;
CREATE POLICY "owner_select_messages" ON messages FOR SELECT
  TO authenticated USING (public.is_owner());
DROP POLICY IF EXISTS "owner_update_messages" ON messages;
CREATE POLICY "owner_update_messages" ON messages FOR UPDATE
  TO authenticated USING (public.is_owner()) WITH CHECK (public.is_owner());
DROP POLICY IF EXISTS "owner_delete_messages" ON messages;
CREATE POLICY "owner_delete_messages" ON messages FOR DELETE
  TO authenticated USING (public.is_owner());

INSERT INTO profile (
  id, name, greeting, job_title, location, available, about_title, about_paragraphs,
  languages, education, ielts_score, email, phone, instagram_url, telegram_url, github_url
)
VALUES (
  1,
  'Sherdorbek Abduqahhorov',
  'Hi, welcome to my portfolio',
  'Frontend Developer',
  'Based in the world',
  true,
  'Creating Modern and Meaningful Web Experiences',
  ARRAY[
    'I’m a Front-End Developer with an IELTS score of 7, which has opened doors to global opportunities and strengthened my ability to communicate effectively in international environments.',
    'I specialize in building modern, responsive, and user-friendly web applications. My journey began with a passion for design and evolved into a deep interest in how websites function and deliver real value to users.',
    'I enjoy transforming ideas into interactive digital experiences using modern technologies. My focus is on creating clean, efficient, and visually engaging interfaces that provide a seamless user experience.',
    'Beyond coding, I continuously work on improving my skills, exploring new technologies, and developing high-performance web solutions. I believe in writing maintainable code and growing as a developer in a global tech environment.'
  ],
  'HTML, CSS, JS, React, Next',
  'Graduated from Najot Ta’lim',
  '7',
  'abduqahhorovsherdorbek770@gmail.com',
  '+998 90 368 67 57',
  'https://instagram.com/Sherdorbek_770_',
  'https://t.me/Andewr77_77',
  'https://github.com/SherdorbekAbduqahhorov'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO skills (name, icon, level, created_at)
SELECT v.name, v.icon, v.level, now() - v.age
FROM (VALUES
  ('HTML', 'code', 100, interval '10 minutes'),
  ('CSS', 'paintbrush', 100, interval '9 minutes'),
  ('Tailwind CSS', 'wind', 100, interval '8 minutes'),
  ('SASS', 'sparkles', 80, interval '7 minutes'),
  ('JavaScript', 'braces', 90, interval '6 minutes'),
  ('TypeScript', 'file-code', 80, interval '5 minutes'),
  ('React.js', 'atom', 95, interval '4 minutes'),
  ('Next.js', 'globe', 90, interval '3 minutes'),
  ('GitHub', 'github', 100, interval '2 minutes'),
  ('Git', 'git-branch', 80, interval '1 minute'),
  ('Kali Linux', 'shield', 90, interval '0 minutes')
) AS v(name, icon, level, age)
WHERE NOT EXISTS (SELECT 1 FROM skills);

INSERT INTO projects (title, description, tag, live_url, created_at)
SELECT v.title, v.description, v.tag, v.live_url, now() - v.age
FROM (VALUES
  ('Blogify', 'Write blogs, read posts from other people, and share images.', 'Website', 'https://blogifyproject.netlify.app/', interval '60 minutes'),
  ('My Portfolio', 'A portfolio built to showcase projects, skills, and experience.', 'Portfolio', 'https://sherdorbeksportfolio.netlify.app/', interval '50 minutes'),
  ('Christmas Shop', 'A simple marketplace built for friends to explore and shop.', 'E-commerce', 'https://littleshopchristmas.netlify.app/', interval '40 minutes'),
  ('Image Gallery', 'A platform to upload, store, and view different types of images.', 'App', 'https://choosimages.netlify.app/', interval '30 minutes'),
  ('Top Universities', 'Explore information about the top 10 universities worldwide.', 'Education', 'https://top10universities.netlify.app/', interval '20 minutes'),
  ('Todo App', 'A simple application where users manage their daily tasks.', 'Productivity', 'https://regal-bubblegum-456ebe.netlify.app/', interval '10 minutes')
) AS v(title, description, tag, live_url, age)
WHERE NOT EXISTS (SELECT 1 FROM projects);
