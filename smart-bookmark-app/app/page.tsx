"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import  Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();


  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if(!data.user) router.push("/login");
    });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Home</h2>

      {user ? (
        <>
          <p>Logged in as: {user.email}</p>
          <button onClick={() => supabase.auth.signOut()}>Logout</button>
        </>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  );
}
