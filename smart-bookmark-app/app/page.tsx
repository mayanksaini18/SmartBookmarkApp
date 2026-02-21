"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Loading from "@/components/ui/Loading"; 

export default function Home() {
  const router = useRouter();
  
  const [isChecking, setIsChecking] = useState(true);

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

  
  return <Loading />;
}