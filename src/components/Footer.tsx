"use client";

import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  return (
    <footer className="py-8 sm:py-12 lg:py-16 border-t border-border-dark bg-background-dark text-amber-100/30">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12 lg:mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="text-primary">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z" fill="currentColor"></path>
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tighter uppercase italic">PoshPrompt</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed mb-6 sm:mb-8">
              The premier destination for elite prompt engineers. Battle, rank up, and earn rewards in the most advanced AI arena ever built.
            </p>
            <div className="flex gap-4 sm:gap-6">
              <a className="hover:text-primary transition-colors p-2" href="https://twitter.com/poshprompt" target="_blank" rel="noopener noreferrer"><span className="material-symbols-outlined text-xl sm:text-base">public</span></a>
              <a className="hover:text-primary transition-colors p-2" href="https://discord.gg/poshprompt" target="_blank" rel="noopener noreferrer"><span className="material-symbols-outlined text-xl sm:text-base">forum</span></a>
              <a className="hover:text-primary transition-colors p-2" href="https://github.com/poshprompt" target="_blank" rel="noopener noreferrer"><span className="material-symbols-outlined text-xl sm:text-base">terminal</span></a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs sm:text-sm mb-4 sm:mb-6">Platform</h4>
            <div className="flex flex-col gap-3 sm:gap-4 text-sm">
              <button className="hover:text-primary transition-colors text-left py-1" onClick={() => router.push('/arena')}>Arena</button>
              <button className="hover:text-primary transition-colors text-left py-1" onClick={() => router.push('/leaderboard')}>Leaderboard</button>
              <button className="hover:text-primary transition-colors text-left py-1" onClick={() => router.push('/challenges')}>Challenges</button>
              <button className="hover:text-primary transition-colors text-left py-1" onClick={() => router.push('/docs')}>Documentation</button>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs sm:text-sm mb-4 sm:mb-6">Company</h4>
            <div className="flex flex-col gap-3 sm:gap-4 text-sm">
              <button className="hover:text-primary transition-colors text-left py-1" onClick={() => router.push('/about')}>About Us</button>
              <button className="hover:text-primary transition-colors text-left py-1" onClick={() => router.push('/privacy')}>Privacy Policy</button>
              <button className="hover:text-primary transition-colors text-left py-1" onClick={() => router.push('/terms')}>Terms of Service</button>
              <button className="hover:text-primary transition-colors text-left py-1" onClick={() => router.push('/support')}>Support</button>
            </div>
          </div>
        </div>
        <div className="pt-6 sm:pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
          <p className="text-center sm:text-left">© 2024 PoshPrompt Arena. Forge your legacy.</p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 lg:gap-8 text-center sm:text-right">
            <span className="text-primary/50">Server Status: 100% Online</span>
            <span className="text-primary/50">Uptime: 99.9%</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
