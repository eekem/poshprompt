"use client";

import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  return (
    <footer className="border-t border-border-dark bg-background-dark pt-12 sm:pt-16 pb-6 sm:pb-8 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 mb-8 sm:mb-12">
        <div className="col-span-1 sm:col-span-2 lg:col-span-2">
          <div className="flex items-center gap-2 text-white mb-3 sm:mb-4">
            <div className="flex items-center justify-center size-5 sm:size-6 rounded bg-primary/20 text-primary">
              <span className="material-symbols-outlined text-xs sm:text-sm">terminal</span>
            </div>
            <h2 className="text-sm sm:text-base font-bold">PoshPrompt</h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xs leading-relaxed">
            The definitive platform for professional prompt engineering competitions. Craft better prompts, faster.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:gap-3">
          <h4 className="text-white font-bold text-xs sm:text-sm">Platform</h4>
          <button className="text-slate-400 hover:text-primary text-xs sm:text-sm transition-colors text-left" onClick={() => router.push('/challenges')}>Challenges</button>
          <button className="text-slate-400 hover:text-primary text-xs sm:text-sm transition-colors text-left" onClick={() => router.push('/leaderboard')}>Leaderboard</button>
          <button className="text-slate-400 hover:text-primary text-xs sm:text-sm transition-colors text-left" onClick={() => router.push('/pricing')}>Pricing</button>
          <button className="text-slate-400 hover:text-primary text-xs sm:text-sm transition-colors text-left" onClick={() => router.push('/api')}>API</button>
        </div>
        <div className="flex flex-col gap-2 sm:gap-3">
          <h4 className="text-white font-bold text-xs sm:text-sm">Company</h4>
          <button className="text-slate-400 hover:text-primary text-xs sm:text-sm transition-colors text-left" onClick={() => router.push('/about')}>About</button>
          <button className="text-slate-400 hover:text-primary text-xs sm:text-sm transition-colors text-left" onClick={() => router.push('/careers')}>Careers</button>
          <button className="text-slate-400 hover:text-primary text-xs sm:text-sm transition-colors text-left" onClick={() => router.push('/blog')}>Blog</button>
          <button className="text-slate-400 hover:text-primary text-xs sm:text-sm transition-colors text-left" onClick={() => router.push('/contact')}>Contact</button>
        </div>
        <div className="flex flex-col gap-2 sm:gap-3">
          <h4 className="text-white font-bold text-xs sm:text-sm">Legal</h4>
          <button className="text-slate-400 hover:text-primary text-xs sm:text-sm transition-colors text-left" onClick={() => router.push('/terms')}>Terms</button>
          <button className="text-slate-400 hover:text-primary text-xs sm:text-sm transition-colors text-left" onClick={() => router.push('/privacy')}>Privacy</button>
          <button className="text-slate-400 hover:text-primary text-xs sm:text-sm transition-colors text-left" onClick={() => router.push('/cookies')}>Cookies</button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center pt-6 sm:pt-8 border-t border-border-dark text-slate-600 text-xs sm:text-sm">
        <p>© 2023 PoshPrompt Inc. All rights reserved.</p>
        <div className="flex gap-4 sm:gap-6 mt-3 sm:mt-4 md:mt-0">
          <button className="hover:text-primary transition-colors" onClick={() => router.push('https://twitter.com/poshprompt')}>Twitter</button>
          <button className="hover:text-primary transition-colors" onClick={() => router.push('https://github.com/poshprompt')}>GitHub</button>
          <button className="hover:text-primary transition-colors" onClick={() => router.push('https://discord.gg/poshprompt')}>Discord</button>
        </div>
      </div>
    </footer>
  );
}
