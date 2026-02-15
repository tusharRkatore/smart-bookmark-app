# Smart Bookmark App

A real-time bookmark manager built with Next.js, React, Supabase, and Tailwind CSS. Users can sign up with email & password, add bookmarks, and see updates across multiple tabs in real-time.

## Features

- ✅ **Email & Password Authentication** - Sign up and log in with email
- ✅ **Real-time Bookmarks** - Bookmarks sync instantly across open tabs using Supabase Realtime
- ✅ **Private Bookmarks** - Each user can only see and manage their own bookmarks
- ✅ **Add & Delete Bookmarks** - Easy interface to add new bookmarks and remove old ones
- ✅ **Responsive Design** - Works on desktop and mobile devices
- ✅ **Production Ready** - Ready to deploy on Vercel

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Realtime)
- **Authentication**: Email & Password via Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **Hosting**: Vercel 

## Prerequisites

Before you begin, make sure you have:

- Node.js 18+ installed
- npm or pnpm package manager
- A Supabase account (free at [supabase.com](https://supabase.com))

## Installation & Setup

### 1. Unzip and Install Dependencies

```bash
unzip smart-bookmark-app.zip
cd smart-bookmark-app
npm install
# or
pnpm install
```

### 2. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/log in
2. Click "New Project"
3. Choose your organization and set up the project:
   - **Name**: Smart Bookmark App (or your choice)
   - **Password**: Create a strong password
   - **Region**: Choose closest to you
4. Wait for the project to be created (about 2-3 minutes)

### 3. Set Up Database

1. In your Supabase project, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the entire content from `scripts/setup-database.sql`
4. Click **Run** to execute the SQL

This will create:
- `bookmarks` table with proper schema
- Row Level Security (RLS) policies
- Indexes for better performance
- Realtime subscriptions

### 4. Configure Email Authentication (Optional)

Email verification is enabled by default but optional. To enable email confirmation:

1. In Supabase, go to **Authentication** → **Providers**
2. Ensure **Email** is enabled (it should be by default)
3. (Optional) Go to **Email Templates** to customize confirmation emails

### 5. Get Supabase Credentials

1. In your Supabase project, go to **Settings** → **API**
2. Copy your **Project URL** (looks like `https://xxxxx.supabase.co`)
3. Copy your **Anon Public Key** (starts with `eyJh...`)

### 6. Set Environment Variables

Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace with your actual Supabase credentials.

### 7. Run Locally

```bash
npm run dev
# or
pnpm dev
```

The app will be available at `http://localhost:3000`

## Usage

1. **Sign In**: Click "Sign in with Google" on the login page
2. **Add Bookmark**: Enter a title and URL, click "Add Bookmark"
3. **View Bookmarks**: Your bookmarks appear in real-time
4. **Delete Bookmark**: Click the delete icon on any bookmark
5. **Real-time Sync**: Open the app in multiple tabs to see real-time updates
6. **Sign Out**: Click "Sign Out" to log out

## Deployment on Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/smart-bookmark-app.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Import Project**
3. Select your GitHub repository
4. Add environment variables in **Project Settings** → **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**

### 3. Update Google OAuth Redirect URI

1. In [Google Cloud Console](https://console.cloud.google.com/), update the OAuth authorized redirect URI:
   - Add: `https://your-vercel-domain.vercel.app/auth/callback`
2. In Supabase, the redirect URI should already be configured

## Project Structure

```
smart-bookmark-app/
├── app/
│   ├── page.tsx              # Login page
│   ├── dashboard/
│   │   └── page.tsx          # Bookmark dashboard
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts      # OAuth callback handler
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── AddBookmarkForm.tsx   # Form to add bookmarks
│   └── BookmarkList.tsx      # Display bookmarks
├── lib/
│   └── supabaseClient.ts     # Supabase client setup
├── scripts/
│   └── setup-database.sql    # Database initialization
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── tailwind.config.ts        # Tailwind configuration
└── README.md                 # This file
```

## Key Files Explained

### `lib/supabaseClient.ts`
Creates and exports Supabase client for browser use. Uses `@supabase/ssr` for proper session handling.

### `app/page.tsx`
Login page with Google OAuth button. Redirects to dashboard if user is already logged in.

### `app/dashboard/page.tsx`
Main dashboard showing user's bookmarks. Features:
- Displays user email
- Shows bookmarks list
- Adds realtime subscription to listen for changes
- Handles logout

### `components/AddBookmarkForm.tsx`
Form to add new bookmarks with:
- Title input
- URL input with validation
- Error handling
- Loading state

### `components/BookmarkList.tsx`
Grid display of bookmarks with:
- Title and URL
- External link button
- Delete functionality
- Timestamp

### `scripts/setup-database.sql`
SQL migration that:
- Creates `bookmarks` table
- Sets up Row Level Security (RLS)
- Enables Supabase Realtime

## Environment Variables Explained

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key (public)

These are prefixed with `NEXT_PUBLIC_` because they're safe to expose in the browser. Sensitive credentials should not be exposed.

## Troubleshooting

### "Session not found" error
- Make sure you've set up the auth callback route
- Check that your Supabase credentials are correct in `.env.local`

### Bookmarks not appearing
- Verify that the `bookmarks` table exists in Supabase
- Check that Row Level Security policies are correctly applied
- Ensure you're logged in with a valid session

### Real-time updates not working
- Confirm Realtime is enabled in Supabase SQL Editor
- Check browser console for any errors
- Verify the subscription filter is correct

### Google login not working
- Check that Google OAuth credentials are correctly set in Supabase
- Verify redirect URI matches your app URL
- Clear browser cookies and try again

## Performance & Security

- **Row Level Security**: Only users can access their own bookmarks
- **Session-based Auth**: Google OAuth handled securely via Supabase
- **Real-time Subscriptions**: Efficient WebSocket connections
- **Responsive Design**: Mobile-optimized interface

## Next Steps

- Add bookmark categories/tags
- Implement search and filter
- Add import/export bookmarks
- Implement bookmark collections
- Add dark mode toggle
- Implement bookmark sync across devices

## License

MIT

## Support

For issues, questions, or improvements, please open an issue on GitHub or contact support.

---

**Happy bookmarking!** 🚀
