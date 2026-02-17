"use client"

import { use, useEffect ,useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

type Bookmark ={
    id : string;
    title : string;
    url : string;
    created_at : string;
}
export  default function DashboardPage(){
 const router = useRouter()

 const [user,setUser] = useState<any>(null)
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
 const [bookmarks,setBookmarks] = useState<Bookmark[]>([])
 const [loading,setLoading] = useState(true)

 useEffect(()=>{
    // 1) Get user + fetch bookmarks
    const load = async () =>{
        const {data} = await supabase.auth.getUser()

        if(!data.user){
            router.push("/login")
            return;
        }

        setUser(data.user);
        const {data : bookmarksData} = await supabase
        .from("bookmarks")
        .select("*")
        .order("created_at" ,{ascending:false});
           
       setBookmarks(bookmarksData||[])
       setLoading(false)
    
    };
    load();
 },[router]);

 //2realtime listnere
 useEffect(()=>{
    if(!user) return;
    
    const channel = supabase
    .channel("bookmarks-realtime")
    .on(
        "postgres_changes",
       {
        event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
       },
       (payload) => {
         // Refresh list after any insert/delete/update
          supabase
            .from("bookmarks")
            .select("*")
            .order("created_at", { ascending: false })
            .then(({ data }) => {
              setBookmarks(data || []);
            });
       }
    )
    .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };

 },[user])

 //3.add bookmark
 const handleAddBookmark = async () => {
 if(!title.trim() || !url.trim()) return;
 
 await supabase.from("bookmarks").insert([
   {
     title,
    url,
    user_id : user.id,
   }
])
setTitle(""),
setUrl(" ")

};

 // 4) Delete bookmark
  const handleDelete = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

   // 5) Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;


return (
    <div style={{ padding: 20, maxWidth: 700, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Smart Bookmark Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <p>Logged in as: {user.email}</p>

      <div style={{ marginTop: 20 }}>
        <input
          placeholder="Bookmark Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />
        <input
          placeholder="Bookmark URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />
        <button onClick={handleAddBookmark} style={{ padding: 10, width: "100%" }}>
          Add Bookmark
        </button>
      </div>

      <h3 style={{ marginTop: 30 }}>Your Bookmarks</h3>

      {bookmarks.length === 0 ? (
        <p>No bookmarks yet.</p>
      ) : (
        <ul style={{ marginTop: 10 }}>
          {bookmarks.map((b) => (
            <li
              key={b.id}
              style={{
                padding: 12,
                border: "1px solid #333",
                borderRadius: 8,
                marginBottom: 10,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <b>{b.title}</b>
                  <br />
                  <a href={b.url} target="_blank">
                    {b.url}
                  </a>
                </div>

                <button onClick={() => handleDelete(b.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

}