# Quick Start Guide

## 3-Step Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create `.env.local`
Get your Supabase credentials from https://supabase.com and create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### Step 3: Run the App
```bash
npm run dev
```

Visit `http://localhost:3000`

## Database Setup

1. Go to Supabase SQL Editor
2. Run this SQL:

```sql
-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS bookmarks_user_id_idx ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS bookmarks_created_at_idx ON bookmarks(created_at DESC);

-- Enable RLS
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own bookmarks" ON bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bookmarks" ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
```

## Features

- Sign up with email/password
- Add bookmarks (title + URL)
- Delete bookmarks  
- Real-time sync across tabs
- Private per-user bookmarks

## Troubleshooting

**Can't add bookmarks?**
- Check Supabase database table exists
- Verify RLS policies are correct
- Check console for error messages

**Auth issues?**
- Clear browser cookies
- Check `.env.local` has correct credentials
- Restart dev server

See `README.md` for detailed setup instructions.
