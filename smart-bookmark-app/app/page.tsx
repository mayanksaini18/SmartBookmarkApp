"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, Globe, Plus, Trash2, User } from "lucide-react"; // npm install lucide-react

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
 

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
      }
    };
    checkUser();

    // Listen for auth changes (like signing out)
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") router.push("/login");
    });

    return () => authListener.subscription.unsubscribe();
  }, [router, supabase]);

  if (!user) return null; // Prevent flicker while redirecting

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Globe className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">SmartMark</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end text-right">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Account</span>
              <span className="text-sm font-medium text-slate-700">{user.email}</span>
            </div>
            <button
              onClick={() => supabase.auth.signOut()}
              className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* --- WELCOME HEADER --- */}
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            Welcome back, {user.user_metadata?.full_name?.split(" ")[0] || "User"}! 👋
          </h1>
          <p className="text-slate-500">You have 0 saved bookmarks. Let's add some!</p>
        </header>

        {/* --- ACTION GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Add Bookmark Card */}
          <div className="md:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Plus className="text-indigo-600" size={20} /> New Bookmark
            </h3>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Title (e.g. Google)"
                className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <input 
                type="url" 
                placeholder="https://example.com"
                className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-all active:scale-[0.98]">
                Add to Collection
              </button>
            </div>
          </div>

          {/* Bookmark Feed Placeholder */}
          <div className="md:col-span-2 space-y-4">
             {/* Empty State Illustration or List */}
             <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Globe className="text-slate-300" size={32} />
                </div>
                <p className="text-slate-400 font-medium">Your feed is looking a bit empty.</p>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}