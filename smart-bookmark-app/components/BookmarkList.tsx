'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<any[]>([])

  useEffect(() => {
    // 1. Initial Fetch
    const fetchBookmarks = async () => {
      const { data } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setBookmarks(data)
    }

    fetchBookmarks()

    // 2. Real-time Subscription
    const channel = supabase
      .channel('bookmarks-realtime')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bookmarks' }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookmarks(prev => [payload.new, ...prev])
          } else if (payload.eventType === 'DELETE') {
            setBookmarks(prev => prev.filter(b => b.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return (
    <div className="grid gap-4 mt-8">
      {bookmarks.map((b) => (
        <div key={b.id} className="p-4 bg-white border rounded-xl shadow-sm flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-slate-800">{b.title}</h3>
            <a href={b.url} className="text-blue-500 text-sm hover:underline" target="_blank">{b.url}</a>
          </div>
          <button className="text-red-400 hover:text-red-600">Delete</button>
        </div>
      ))}
    </div>
  )
}