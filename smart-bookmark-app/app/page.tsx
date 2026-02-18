"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react"; // npm install lucide-react

export default function Home() {
  const router = useRouter();
  

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router, supabase]);

  // Minimalist "Redirecting" UI
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-black" size={32} />
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-black/40">
          Verifying_Session...
        </p>
      </div>
    </div>
  );
}