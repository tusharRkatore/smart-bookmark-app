'use client'

import AddBookmarkForm from '@/components/AddBookmarkForm'
import BookmarkList from '@/components/BookmarkList'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabaseClient'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const init = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.push('/')
        return
      }

      const currentUser = data.session.user
      setUser(currentUser)

      const { data: initial } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })

      if (isMounted) {
        setBookmarks(initial || [])
        setLoading(false)
      }

      // 🔴 Realtime (for other tabs)
      const channel = supabase
        .channel('bookmarks-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookmarks',
            filter: `user_id=eq.${currentUser.id}`,
          },
          (payload) => {
            if (!isMounted) return

            if (payload.eventType === 'INSERT') {
              setBookmarks((prev) =>
                prev.some((b) => b.id === payload.new.id)
                  ? prev
                  : [payload.new, ...prev]
              )
            }

            if (payload.eventType === 'DELETE') {
              setBookmarks((prev) =>
                prev.filter((b) => b.id !== payload.old.id)
              )
            }
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }

    init()
    return () => {
      isMounted = false
    }
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  // Optimistic delete
  const handleDeleteBookmark = async (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id))

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Failed to delete bookmark')
    }
  }

  if (loading) {
    return <div className="p-10 text-center">Loading…</div>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">Smart Bookmarks</h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add Bookmark</CardTitle>
          </CardHeader>
          <CardContent>
            {/* 🔴 PASS CALLBACK */}
            <AddBookmarkForm
              userId={user.id}
              onAdd={(bookmark) =>
                setBookmarks((prev) => [bookmark, ...prev])
              }
            />
          </CardContent>
        </Card>

        <BookmarkList
          bookmarks={bookmarks}
          onDelete={handleDeleteBookmark}
        />
      </div>
    </div>
  )
}