'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabaseClient'
import { useState } from 'react'

type Bookmark = {
  id: string
  title: string
  url: string
  user_id: string
  created_at: string
}

export default function AddBookmarkForm({
  userId,
  onAdd,
}: {
  userId: string
  onAdd: (bookmark: Bookmark) => void
}) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim() || !url.trim()) {
      setError('Title and URL are required')
      return
    }

    // Basic URL validation
    try {
      new URL(url)
    } catch {
      setError('Please enter a valid URL')
      return
    }

    if (!userId) {
      setError('User not authenticated')
      return
    }

    setLoading(true)

    try {
      const { data, error: insertError } = await supabase
        .from('bookmarks')
        .insert({
          user_id: userId,
          title: title.trim(),
          url: url.trim(),
        })
        .select()
        .single()

      if (insertError) {
        console.error('[AddBookmark] Insert error:', insertError)
        setError(insertError.message || 'Failed to add bookmark')
      } else {
        // ✅ INSTANT UI UPDATE
        onAdd(data)

        // Reset form
        setTitle('')
        setUrl('')
      }
    } catch (err: any) {
      console.error('[AddBookmark] Unexpected error:', err)
      setError(err?.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          Title
        </label>
        <Input
          id="title"
          type="text"
          placeholder="e.g., My Favorite Blog"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
      </div>

      <div>
        <label
          htmlFor="url"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          URL
        </label>
        <Input
          id="url"
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {loading ? 'Adding…' : 'Add Bookmark'}
      </Button>
    </form>
  )
}