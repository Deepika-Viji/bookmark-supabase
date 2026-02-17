1. Project Title
Smart Bookmark Manager
Realtime Private Bookmark App using Next.js + Supabase

2. Features Implemented
 Google OAuth Login (Supabase Auth)
 Add Bookmark (Title + URL)
 Bookmarks are user-private
 Delete own bookmarks
 Realtime sync across tabs (Supabase Realtime)
 Responsive UI using Tailwind
 Deployed on Vercel

3. Tech Stack
Next.js 14 (App Router)
Supabase (Auth + Database + Realtime)
Tailwind CSS
Vercel (Deployment)

4. How Realtime Works
Supabase Realtime subscriptions are used to listen to changes
in the bookmarks table.

Whenever a bookmark is added or deleted, all active sessions
receive live updates instantly without refresh.

5. Database Structure
Table: bookmarks

id (uuid)
user_id (uuid)
title (text)
url (text)
created_at (timestamp)

Row Level Security (RLS) enabled to ensure users can only
access their own bookmarks.

6. Security
RLS Policy:

Users can:
✔ Insert their own bookmarks
✔ View their own bookmarks
✔ Delete their own bookmarks

Users cannot access bookmarks of others.

7. Setup Instructions
Configure
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

Run:
npm install
npm run dev

8. Deployment
Deployed using Vercel
Supabase used as backend (Auth + DB + Realtime)
