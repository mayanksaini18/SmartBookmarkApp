"use client";

import { Bookmark, Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white">
      {/* Central Logo with a subtle pulse */}
      <div className="relative mb-8">
        <div className="w-16 h-16 bg-black text-white flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] animate-pulse">
          <Bookmark size={32} />
        </div>
      </div>

      {/* Modern Spinner + Text */}
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="animate-spin text-black/20" size={24} />
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-black/40 ml-1">
          Establishing_Secure_Connection
        </span>
      </div>

      {/* Decorative Progress Bar Background */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black/5 overflow-hidden">
        <div className="h-full bg-black w-1/3 animate-[loading_2s_infinite_ease-in-out]" />
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}