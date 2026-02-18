"use client";

import { supabase } from "@/lib/supabase/client";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")` }}>
      </div>

      <div className="relative z-10 w-full max-w-sm px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-black text-white rounded-none mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
            <Bookmark size={24} />
            
          </div>
          <h1 className="text-2xl font-bold tracking-tighter uppercase italic">
            Smartmark
          </h1>
          <p className="text-black/40 text-sm font-mono mt-2">
            Store. Sync. Simple.
          </p>
        </div>

        <div className="border border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-sm font-semibold mb-6 text-center uppercase tracking-widest">
            Authentication
          </p>
          
          <Button 
            onClick={handleGoogleLogin}
            className="w-full bg-black text-white hover:bg-black/90 rounded-none h-12 border border-black transition-transform active:translate-x-1 active:translate-y-1"
          >
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Continue with Google
          </Button>

          <div className="mt-8 flex flex-col gap-2">
            <div className="h-[1px] bg-black/10 w-full" />
            <p className="text-[10px] text-black/40 text-center font-mono uppercase tracking-tighter">
              Private • Real-time • Hyperlocal
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-black/30 mt-8 font-mono">
          &copy; 2026 SMARTMARK_SYSTEMS
        </p>
      </div>
    </div>
  );
}