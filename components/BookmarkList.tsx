'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, ExternalLink } from 'lucide-react'
import { useState } from 'react'

interface Bookmark {
  id: string
  title: string
  url: string
  created_at: string
}

interface BookmarkListProps {
  bookmarks: Bookmark[]
  onDelete: (id: string) => void
}

export default function BookmarkList({
  bookmarks,
  onDelete,
}: BookmarkListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this bookmark?')) {
      setDeletingId(id)
      await onDelete(id)
      setDeletingId(null)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {bookmarks.map((bookmark) => (
        <Card key={bookmark.id} className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col h-full">
              <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
                {bookmark.title}
              </h3>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm mb-3 line-clamp-1 flex items-center gap-1"
              >
                <span className="truncate">{bookmark.url}</span>
                <ExternalLink className="w-4 h-4 flex-shrink-0" />
              </a>
              <p className="text-xs text-slate-500 mb-4">
                {new Date(bookmark.created_at).toLocaleDateString()} at{' '}
                {new Date(bookmark.created_at).toLocaleTimeString()}
              </p>
              <div className="flex gap-2 mt-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(bookmark.id)}
                  disabled={deletingId === bookmark.id}
                  className="flex-1 text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  {deletingId === bookmark.id ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
