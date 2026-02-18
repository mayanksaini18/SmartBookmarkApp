"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Plus, LogOut, Bookmark, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) router.push("/login");
      else setUser(data.user);
    };
    checkUser();
  }, [router, supabase]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* HEADER */}
      <header className="border-b border-black/5 py-4 px-6 sticky top-0 bg-white/80 backdrop-blur-xl z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold tracking-tighter text-xl">
            <div className="bg-black text-white p-1 rounded">
              <Bookmark size={18} />
            </div>
            SMARTMARK
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => supabase.auth.signOut()}
            className="hover:bg-black hover:text-white transition-all duration-300"
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* ADD SECTION */}
        <section className="mb-16">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] mb-6 text-black/40">Add New</h2>
          <div className="flex flex-col md:flex-row gap-3">
            <Input 
              placeholder="Bookmark Title" 
              className="border-black focus-visible:ring-black rounded-none"
            />
            <Input 
              placeholder="URL (https://...)" 
              className="border-black focus-visible:ring-black rounded-none"
            />
            <Button className="bg-black text-white hover:bg-black/90 rounded-none px-8">
              <Plus className="mr-2 h-4 w-4" /> Save
            </Button>
          </div>
        </section>

        {/* FEED SECTION */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] mb-6 text-black/40">Your Collection</h2>
          
          <div className="grid gap-4">
            {/* Mockup of a Bookmark Card */}
            <Card className="rounded-none border-black/10 hover:border-black transition-all duration-300 group shadow-none">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-medium">Next.js Documentation</span>
                  <span className="text-xs text-black/40 font-mono">nextjs.org/docs</span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-black hover:text-white">
                    <ExternalLink size={14} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-500 hover:text-white border-transparent">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Empty State */}
            <div className="py-20 border border-dashed border-black/10 flex flex-col items-center justify-center text-black/30">
              <p className="text-sm font-mono italic underline underline-offset-4">Nothing here yet...</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}