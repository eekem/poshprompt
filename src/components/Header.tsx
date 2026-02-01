"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Header() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Close drawer when clicking outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDrawerOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);
  
  return (
    <>
      <nav className="fixed top-0 w-full z-40 glass-nav border-b border-border-dark">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-primary">
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight uppercase italic">PoshPrompt</h2>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-10">
            <button className="text-xs sm:text-sm font-medium hover:text-primary transition-colors tracking-wide" onClick={() => router.push('/arena')}>Arena</button>
            <button className="text-xs sm:text-sm font-medium hover:text-primary transition-colors tracking-wide" onClick={() => router.push('/leaderboard')}>Leaderboard</button>
            <button className="text-xs sm:text-sm font-medium hover:text-primary transition-colors tracking-wide" onClick={() => router.push('/features')}>Features</button>
            <button className="text-xs sm:text-sm font-medium hover:text-primary transition-colors tracking-wide" onClick={() => router.push('/pricing')}>Pricing</button>
          </div>
          
          {/* Desktop Buttons */}
          <div className="hidden sm:flex items-center gap-3 lg:gap-4">
            <button className="px-4 lg:px-5 py-2 text-sm font-bold hover:text-primary transition-colors cursor-pointer" onClick={() => router.push('/login')}>Login</button>
            <button className="bg-primary hover:bg-primary-accent text-black px-4 lg:px-6 py-2 lg:py-2.5 rounded-lg text-sm font-black tracking-wide transition-all shadow-lg shadow-primary/20 cursor-pointer" onClick={() => router.push('/register')}>
              Join the Arena
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex flex-col gap-1 p-2 hover:text-primary transition-colors"
            onClick={() => setIsDrawerOpen(true)}
          >
            <span className="block w-6 h-0.5 bg-current"></span>
            <span className="block w-6 h-0.5 bg-current"></span>
            <span className="block w-6 h-0.5 bg-current"></span>
          </button>
        </div>
      </nav>

      {/* Offcanvas Drawer */}
      <div className={`fixed inset-0 z-50 ${isDrawerOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsDrawerOpen(false)}
        ></div>
        
        {/* Drawer Panel */}
        <div className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-background-dark border-l border-border-dark transform transition-all duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-border-dark bg-panel-dark/50">
              <div className="flex items-center gap-2">
                <div className="text-primary">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z" fill="currentColor"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-bold tracking-tight uppercase italic">PoshPrompt</h3>
              </div>
              <button 
                className="p-2 hover:bg-white/10 rounded-lg transition-all hover:text-primary"
                onClick={() => setIsDrawerOpen(false)}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                <button 
                  className="block w-full text-left py-3 px-4 text-sm font-medium hover:bg-white/5 hover:text-primary rounded-lg transition-all transform hover:translate-x-1"
                  onClick={() => { router.push('/arena'); setIsDrawerOpen(false); }}
                >
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">sports_esports</span>
                    Arena
                  </span>
                </button>
                <button 
                  className="block w-full text-left py-3 px-4 text-sm font-medium hover:bg-white/5 hover:text-primary rounded-lg transition-all transform hover:translate-x-1"
                  onClick={() => { router.push('/leaderboard'); setIsDrawerOpen(false); }}
                >
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">leaderboard</span>
                    Leaderboard
                  </span>
                </button>
                <button 
                  className="block w-full text-left py-3 px-4 text-sm font-medium hover:bg-white/5 hover:text-primary rounded-lg transition-all transform hover:translate-x-1"
                  onClick={() => { router.push('/features'); setIsDrawerOpen(false); }}
                >
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">stars</span>
                    Features
                  </span>
                </button>
                <button 
                  className="block w-full text-left py-3 px-4 text-sm font-medium hover:bg-white/5 hover:text-primary rounded-lg transition-all transform hover:translate-x-1"
                  onClick={() => { router.push('/pricing'); setIsDrawerOpen(false); }}
                >
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">payments</span>
                    Pricing
                  </span>
                </button>
              </div>
            </div>
            
            {/* Mobile Auth Buttons */}
            <div className="p-4 border-t border-border-dark bg-panel-dark/30">
              <div className="space-y-3">
                <button 
                  className="w-full py-3 px-4 border border-border-dark font-bold text-sm hover:bg-white/5 transition-all rounded-lg transform hover:scale-105 hover:translate-x-1"
                  onClick={() => { router.push('/login'); setIsDrawerOpen(false); }}
                >
                  Login
                </button>
                <button 
                  className="w-full py-3 px-4 bg-primary hover:bg-primary-accent text-black font-black text-sm tracking-wide transition-all shadow-lg shadow-primary/20 rounded-lg transform hover:scale-105 hover:translate-x-1 hover:shadow-primary/30"
                  onClick={() => { router.push('/register'); setIsDrawerOpen(false); }}
                >
                  Join the Arena
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
