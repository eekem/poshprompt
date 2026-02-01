"use client";

import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  return (
    <nav className="fixed top-0 w-full z-50 glass-nav border-b border-border-dark">
      <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-primary">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold tracking-tight uppercase italic">PoshPrompt</h2>
        </div>
        <div className="hidden md:flex items-center gap-10">
          <button className="text-sm font-medium hover:text-primary transition-colors tracking-wide" onClick={() => router.push('/arena')}>Arena</button>
          <button className="text-sm font-medium hover:text-primary transition-colors tracking-wide" onClick={() => router.push('/leaderboard')}>Leaderboard</button>
          <button className="text-sm font-medium hover:text-primary transition-colors tracking-wide" onClick={() => router.push('/features')}>Features</button>
          <button className="text-sm font-medium hover:text-primary transition-colors tracking-wide" onClick={() => router.push('/pricing')}>Pricing</button>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-5 py-2 text-sm font-bold hover:text-primary transition-colors cursor-pointer" onClick={() => router.push('/login')}>Login</button>
          <button className="bg-primary hover:bg-primary-accent text-black px-6 py-2.5 rounded-lg text-sm font-black tracking-wide transition-all shadow-lg shadow-primary/20 cursor-pointer" onClick={() => router.push('/register')}>
            Join the Arena
          </button>
        </div>
      </div>
    </nav>
  );
}
