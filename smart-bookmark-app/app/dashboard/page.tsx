"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Bookmark as BookmarkIcon, LogOut, Plus, Trash2, ExternalLink, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/Loading";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  created_at: string;
};

export default function DashboardPage() {
  const router = useRouter();
  

  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
        return;
      }
      setUser(data.user);

      const { data: bData } = await supabase
        .from("bookmarks")
        .select("*")
        .order("created_at", { ascending: false });

      setBookmarks(bData || []);
      setLoading(false);
    };
    loadData();
  }, [router, supabase]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("realtime-bookmarks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks", filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setBookmarks((prev) => [payload.new as Bookmark, ...prev]);
          } else if (payload.eventType === "DELETE") {
            setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, supabase]);

  const handleAddBookmark = async () => {
    if (!title.trim() || !url.trim()) return;
    const { error } = await supabase.from("bookmarks").insert([
      { title, url, user_id: user.id }
    ]);
    if (!error) {
      setTitle("");
      setUrl("");
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("bookmarks").delete().eq("id", id);
    if (!error) {
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white pb-20">
      {/* --- HEADER --- */}
      <header className="border-b border-black sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold tracking-tighter uppercase italic">
            <div className="bg-black text-white p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]">
              <BookmarkIcon size={18} />
            </div>
            Smartmark
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:block font-mono text-[10px] text-black/40 uppercase tracking-widest">
              {user.email}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="rounded-none border border-transparent hover:border-black hover:bg-white transition-all"
            >
              <LogOut size={16} className="mr-2" /> EXIT
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-12">
        {/* --- INPUT SECTION --- */}
        <section className="mb-16">
          <div className="border border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 text-black/40">Add_New_Entry</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="md:col-span-2 rounded-none border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-black font-medium"
              />
              <Input
                placeholder="URL (https://...)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="md:col-span-2 rounded-none border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-black font-mono text-sm"
              />
              <Button 
                onClick={handleAddBookmark}
                className="rounded-none bg-black text-white hover:bg-black/90 h-10 transition-transform active:translate-y-0.5"
              >
                <Plus size={18} className="mr-2" /> SAVE
              </Button>
            </div>
          </div>
        </section>

        {/* --- LIST SECTION --- */}
        <section>
          <div className="flex items-center justify-between mb-8 border-b border-black/10 pb-2">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black">Collections_Vault</h2>
            <span className="font-mono text-[10px] text-black/40 underline underline-offset-4">{bookmarks.length} entries FOUND</span>
          </div>

          <div className="grid gap-4">
            {bookmarks.length === 0 ? (
              <div className="py-20 border border-dashed border-black/10 flex flex-col items-center justify-center opacity-30 grayscale">
                <Globe size={40} strokeWidth={1} className="mb-4" />
                <p className="font-mono text-xs italic tracking-tight">System is currently empty...</p>
              </div>
            ) : (
              bookmarks.map((b) => (
                <div 
                  key={b.id} 
                  className="group relative border border-black/10 p-5 hover:border-black hover:bg-slate-50/50 transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 overflow-hidden">
                      <h3 className="font-bold text-lg leading-tight tracking-tight uppercase group-hover:underline truncate">
                        {b.title}
                      </h3>
                      <a 
                        href={b.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs font-mono text-black/40 hover:text-black transition-colors line-clamp-1 break-all"
                      >
                        {b.url} <ExternalLink size={10} />
                      </a>
                    </div>
                    
                    <Button 
                      onClick={() => handleDelete(b.id)}
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-none text-black/20 hover:text-white hover:bg-black transition-all"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                  
                  {/* Decorative timestamp */}
                  <div className="mt-4 pt-4 border-t border-black/5">
                    <span className="text-[8px] font-mono text-black/30 uppercase tracking-[0.2em]">
                      Captured: {new Date(b.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}