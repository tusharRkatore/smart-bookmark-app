import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/auth/sign-up', request.url))
  }

  // ✅ This is the KEY difference:
  // We pass cookies() directly — no getAll / setAll
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies,
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('OAuth callback error:', error.message)
    return NextResponse.redirect(new URL('/auth/sign-up', request.url))
  }

  return NextResponse.redirect(new URL('/dashboard', request.url))
}