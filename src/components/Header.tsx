"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/lib/use-auth";

export default function Header() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
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
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-border-dark bg-background-dark/80 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 lg:px-10">
        <div className="flex items-center gap-2 sm:gap-3 text-white">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2 sm:gap-3 text-white hover:text-primary transition-colors"
          >
            <div className="w-[120px] sm:w-[150px]">
              <img src="/logo.svg" alt="PoshPrompt" className="w-full h-full" />
            </div>
          </button>
        </div>
        <nav className="hidden md:flex flex-1 justify-center gap-4 sm:gap-6 lg:gap-8">
          <button className="text-slate-400 hover:text-primary transition-colors text-xs sm:text-sm font-medium" onClick={() => {
            if (window.location.pathname === '/') {
              document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
            } else {
              router.push('/#demo');
            }
          }}>Demo</button>
          <button className="text-slate-400 hover:text-primary transition-colors text-xs sm:text-sm font-medium" onClick={() => {
            if (window.location.pathname === '/') {
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            } else {
              router.push('/#features');
            }
          }}>Features</button>
          <button className="text-slate-400 hover:text-primary transition-colors text-xs sm:text-sm font-medium" onClick={() => {
            if (window.location.pathname === '/') {
              document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
            } else {
              router.push('/#pricing');
            }
          }}>Pricing</button>
        </nav>
        <div className="hidden md:flex items-center gap-2 sm:gap-4">
          {!user && (
            <button className="hidden sm:block text-slate-300 hover:text-white text-xs sm:text-sm font-medium" onClick={() => router.push('/login')}>Sign In</button>
          )}
          <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 sm:h-9 px-3 sm:px-4 bg-primary hover:bg-amber-400 transition-colors text-[#231c10] text-xs sm:text-sm font-bold leading-normal tracking-wide shadow-[0_0_15px_rgba(245,159,10,0.3)]" onClick={() => user ? router.push('/challenge') : router.push('/login')}>
            <span className="truncate">{user ? 'Dashboard' : 'Get Started'}</span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden fixed top-4 right-4 z-50 p-2 text-white hover:text-primary transition-colors"
        onClick={() => setIsDrawerOpen(true)}
      >
        <span className="block w-6 h-0.5 bg-current mb-1"></span>
        <span className="block w-6 h-0.5 bg-current mb-1"></span>
        <span className="block w-6 h-0.5 bg-current"></span>
      </button>

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
                <button 
                  onClick={() => { router.push('/'); setIsDrawerOpen(false); }}
                  className="flex items-center gap-2 text-white hover:text-primary transition-colors"
                >
                  <div className="size-12">
                    <img src="/logo.svg" alt="PoshPrompt" className="w-full h-full" />
                  </div>
                </button>
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
                  onClick={() => {
                    if (window.location.pathname === '/') {
                      document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      router.push('/#demo');
                    }
                    setIsDrawerOpen(false);
                  }}
                >
                  Demo
                </button>
                <button 
                  className="block w-full text-left py-3 px-4 text-sm font-medium hover:bg-white/5 hover:text-primary rounded-lg transition-all transform hover:translate-x-1"
                  onClick={() => {
                    if (window.location.pathname === '/') {
                      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      router.push('/#features');
                    }
                    setIsDrawerOpen(false);
                  }}
                >
                  Features
                </button>
                <button 
                  className="block w-full text-left py-3 px-4 text-sm font-medium hover:bg-white/5 hover:text-primary rounded-lg transition-all transform hover:translate-x-1"
                  onClick={() => {
                    if (window.location.pathname === '/') {
                      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      router.push('/#pricing');
                    }
                    setIsDrawerOpen(false);
                  }}
                >
                  Pricing
                </button>
              </div>
            </div>
            
            {/* Mobile Auth Buttons */}
            <div className="p-4 border-t border-border-dark bg-panel-dark/30">
              <div className="space-y-3">
                {user ? (
                  <button 
                    className="w-full py-3 px-4 bg-primary hover:bg-amber-400 text-[#231c10] font-bold text-sm tracking-wide transition-all shadow-lg shadow-primary/20 rounded-lg"
                    onClick={() => { router.push('/challenges'); setIsDrawerOpen(false); }}
                  >
                    Go to Dashboard
                  </button>
                ) : (
                  <>
                    <button 
                      className="w-full py-3 px-4 text-slate-300 hover:text-white text-sm font-medium transition-all rounded-lg"
                      onClick={() => { router.push('/login'); setIsDrawerOpen(false); }}
                    >
                      Sign In
                    </button>
                    <button 
                      className="w-full py-3 px-4 bg-primary hover:bg-amber-400 text-[#231c10] font-bold text-sm tracking-wide transition-all shadow-lg shadow-primary/20 rounded-lg"
                      onClick={() => { router.push('/register'); setIsDrawerOpen(false); }}
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
