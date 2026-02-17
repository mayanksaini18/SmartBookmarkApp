"use client"
import { supabase} from '@/lib/supabase/client'

export default function LoginPage(){
   

    const handleGoogleLogin = async () =>{
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options:{
                redirectTo: `${window.location.origin}/auth/callback`
            }
        
        })
    }
return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <h1 className="text-3xl font-bold mb-8 text-slate-900">Smart Bookmark App</h1>
      <button 
        onClick={handleGoogleLogin}
        className="px-6 py-3 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 transition-all font-medium flex items-center gap-2"
      >
        Sign in with Google
      </button>
    </div>
  )
    
}