"use client";

import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <Layout>
      <section className="relative pt-24 sm:pt-32 md:pt-40 pb-12 sm:pb-16 md:pb-20 hero-gradient min-h-screen flex items-center overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 mb-6 sm:mb-8 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[8px] sm:text-[10px] font-black text-primary uppercase tracking-[0.1em] sm:tracking-[0.2em]">Season 1: Gold Rush is Live</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black mb-4 sm:mb-6 leading-[0.9] sm:leading-[0.95] tracking-tighter">
            Turn Prompt Skill Into XP — <br />
            <span className="text-primary italic drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">and Real Rewards</span>
          </h1>
          <p className="max-w-lg sm:max-w-2xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl text-amber-100/60 mb-8 sm:mb-10 font-light leading-relaxed">
            The world's first competitive arena for prompt engineers. <br className="hidden sm:block" />
            Battle in real-time challenges, level up your rank, and claim loot.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <button className="w-full sm:w-auto bg-primary hover:bg-primary-accent text-black px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-xl text-base sm:text-lg lg:text-xl font-black transition-all transform hover:scale-105 shadow-xl shadow-primary/20 cursor-pointer" onClick={() => router.push('/register')}>
              Start Your First Challenge
            </button>
            <button className="w-full sm:w-auto border border-border-dark bg-white/5 hover:bg-white/10 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-xl text-base sm:text-lg lg:text-xl font-bold transition-all backdrop-blur-sm cursor-pointer" onClick={() => router.push('/leaderboard')}>
              View Leaderboard
            </button>
          </div>
          <div className="mt-12 sm:mt-16 md:mt-24 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 opacity-40 hover:opacity-100 transition-opacity duration-700 border-t border-white/5 pt-8 sm:pt-12">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <span className="material-symbols-outlined text-xl sm:text-2xl text-primary">bolt</span>
              <span className="font-bold tracking-widest text-xs sm:text-sm">GPT-4O</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <span className="material-symbols-outlined text-xl sm:text-2xl text-primary">brush</span>
              <span className="font-bold tracking-widest text-xs sm:text-sm">MIDJOURNEY</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <span className="material-symbols-outlined text-xl sm:text-2xl text-primary">code</span>
              <span className="font-bold tracking-widest text-xs sm:text-sm">CLAUDE 3.5</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <span className="material-symbols-outlined text-xl sm:text-2xl text-primary">psychology</span>
              <span className="font-bold tracking-widest text-xs sm:text-sm">GEMINI PRO</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 lg:py-24 border-t border-border-dark bg-panel-dark">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="mb-8 sm:mb-12 md:mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4 uppercase tracking-tight">The Mechanics</h2>
              <div className="h-1 w-20 sm:w-24 md:w-32 bg-primary xp-bar-glow"></div>
            </div>
            <div className="hidden md:block text-primary/40 font-mono text-xs sm:text-sm">
              SYSTEM_STATUS: ACTIVE
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="group p-4 sm:p-6 lg:p-8 rounded-2xl border border-border-dark bg-background-dark/50 hover:border-primary/50 transition-all">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                <span className="material-symbols-outlined text-primary text-xl sm:text-2xl lg:text-3xl">account_balance_wallet</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 tracking-tight">Connect</h3>
              <p className="text-amber-100/50 leading-relaxed text-xs sm:text-sm">Link your wallet or account to start your journey and track your progression.</p>
            </div>
            <div className="group p-4 sm:p-6 lg:p-8 rounded-2xl border border-border-dark bg-background-dark/50 hover:border-primary/50 transition-all">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                <span className="material-symbols-outlined text-primary text-xl sm:text-2xl lg:text-3xl">swords</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 tracking-tight">Enter Arena</h3>
              <p className="text-amber-100/50 leading-relaxed text-xs sm:text-sm">Select from live prompts or scheduled tournaments with varying stake levels.</p>
            </div>
            <div className="group p-4 sm:p-6 lg:p-8 rounded-2xl border border-border-dark bg-background-dark/50 hover:border-primary/50 transition-all">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                <span className="material-symbols-outlined text-primary text-xl sm:text-2xl lg:text-3xl">terminal</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 tracking-tight">Craft Prompts</h3>
              <p className="text-amber-100/50 leading-relaxed text-xs sm:text-sm">Engineer the perfect prompt to achieve the highest semantic score against peers.</p>
            </div>
            <div className="group p-4 sm:p-6 lg:p-8 rounded-2xl border border-border-dark bg-background-dark/50 hover:border-primary/50 transition-all">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                <span className="material-symbols-outlined text-primary text-xl sm:text-2xl lg:text-3xl">military_tech</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 tracking-tight">Earn XP & Loot</h3>
              <p className="text-amber-100/50 leading-relaxed text-xs sm:text-sm">Win matches to gain XP, unlock new tiers, and claim real cryptocurrency rewards.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background-dark overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-primary/30 to-transparent"></div>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 tracking-tighter uppercase">Master the Arena</h2>
            <p className="text-amber-100/40 max-w-md sm:max-w-lg mx-auto text-sm sm:text-base">Elite tools designed for the next generation of prompt engineers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-2xl group-hover:bg-primary/10 transition-all"></div>
              <div className="relative h-full p-6 sm:p-8 rounded-2xl border border-white/5 bg-panel-dark flex flex-col justify-between overflow-hidden glow-border">
                <div className="mb-4 sm:mb-6">
                  <span className="material-symbols-outlined text-primary text-4xl sm:text-5xl mb-4 sm:mb-6">trending_up</span>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 tracking-tight">Dynamic XP</h3>
                  <p className="text-amber-100/60 leading-relaxed text-sm sm:text-base">Every character counts. Our proprietary algorithm measures prompt efficiency, semantic accuracy, and creativity.</p>
                </div>
                <div className="mt-auto pt-4 sm:pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest cursor-pointer group-hover:gap-3 transition-all">
                    Learn More <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-2xl group-hover:bg-primary/10 transition-all"></div>
              <div className="relative h-full p-6 sm:p-8 rounded-2xl border border-white/5 bg-panel-dark flex flex-col justify-between overflow-hidden glow-border">
                <div className="mb-4 sm:mb-6">
                  <span className="material-symbols-outlined text-primary text-4xl sm:text-5xl mb-4 sm:mb-6">visibility_off</span>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 tracking-tight">Invisible Leaderboard</h3>
                  <p className="text-amber-100/60 leading-relaxed text-sm sm:text-base">Competing with peace of mind. Our ELO system pairs you with similar skill levels without the toxic noise.</p>
                </div>
                <div className="mt-auto pt-4 sm:pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest cursor-pointer group-hover:gap-3 transition-all">
                    Learn More <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-2xl group-hover:bg-primary/10 transition-all"></div>
              <div className="relative h-full p-6 sm:p-8 rounded-2xl border border-white/5 bg-panel-dark flex flex-col justify-between overflow-hidden glow-border">
                <div className="mb-4 sm:mb-6">
                  <span className="material-symbols-outlined text-primary text-4xl sm:text-5xl mb-4 sm:mb-6">payments</span>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 tracking-tight">Instant Rewards</h3>
                  <p className="text-amber-100/60 leading-relaxed text-sm sm:text-base">No waiting for payouts. Secure smart contracts deliver your winnings directly to your wallet the moment you rank.</p>
                </div>
                <div className="mt-auto pt-4 sm:pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest cursor-pointer group-hover:gap-3 transition-all">
                    Learn More <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-10 md:py-12 bg-panel-dark border-y border-border-dark overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-6 sm:gap-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-16 lg:w-16 lg:h-16 rounded-full border-2 border-primary p-1">
                <div className="w-full h-full bg-primary/20 rounded-full flex items-center justify-center text-primary font-black text-xs sm:text-sm">LVL 42</div>
              </div>
              <div>
                <h4 className="font-bold text-base sm:text-lg">Current Rank: Gold Elite</h4>
                <p className="text-xs text-amber-100/40 uppercase tracking-widest">Global Ranking: #1,204</p>
              </div>
            </div>
            <div className="w-full">
              <div className="flex justify-between text-[8px] sm:text-[10px] font-black uppercase mb-2 tracking-[0.1em] sm:tracking-widest text-primary">
                <span>XP Progression</span>
                <span>8,450 / 10,000 XP</span>
              </div>
              <div className="h-2 sm:h-3 w-full bg-white/5 rounded-full overflow-hidden p-[1px] sm:p-[2px] border border-white/10">
                <div className="h-full bg-linear-to-r from-amber-600 to-primary rounded-full xp-bar-glow" style={{width: "84.5%"}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background-dark">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4 uppercase tracking-tighter">Choose Your Path</h2>
            <p className="text-amber-100/40 text-sm sm:text-base">From humble prompt-smith to legendary engineer.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-4xl mx-auto">
            <div className="p-6 sm:p-8 lg:p-10 rounded-2xl border border-border-dark bg-panel-dark flex flex-col">
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-bold text-amber-100/40 mb-2 uppercase tracking-widest">Starter</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-black">$0</span>
                  <span className="text-white/30 text-sm sm:text-base lg:text-lg">/mo</span>
                </div>
              </div>
              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 lg:mb-10 grow">
                <li className="flex items-center gap-2 sm:gap-3 text-white/70 text-sm">
                  <span className="material-symbols-outlined text-primary text-lg sm:text-xl">check_circle</span>
                  Basic Arena Access
                </li>
                <li className="flex items-center gap-2 sm:gap-3 text-white/70 text-sm">
                  <span className="material-symbols-outlined text-primary text-lg sm:text-xl">check_circle</span>
                  Standard XP Multiplier
                </li>
                <li className="flex items-center gap-2 sm:gap-3 text-white/70 text-sm">
                  <span className="material-symbols-outlined text-primary text-lg sm:text-xl">check_circle</span>
                  3 Challenges Per Day
                </li>
                <li className="flex items-center gap-2 sm:gap-3 text-white/20 text-sm">
                  <span className="material-symbols-outlined text-lg sm:text-xl">block</span>
                  Exclusive Tournaments
                </li>
              </ul>
              <button className="w-full py-3 sm:py-4 rounded-xl border border-border-dark font-black uppercase text-xs sm:text-sm tracking-widest hover:bg-white/5 transition-all cursor-pointer">
                Join Free
              </button>
            </div>
            <div className="p-6 sm:p-8 lg:p-10 rounded-2xl border-2 border-primary bg-panel-dark flex flex-col relative overflow-hidden shadow-2xl shadow-primary/10">
              <div className="absolute top-0 right-0 bg-primary text-black text-[8px] sm:text-[10px] px-3 sm:px-4 py-1.5 font-black uppercase tracking-widest rounded-bl-lg">
                Recommended
              </div>
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-bold text-primary mb-2 uppercase tracking-widest">Pro Engineer</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-black">$29</span>
                  <span className="text-white/30 text-sm sm:text-base lg:text-lg">/mo</span>
                </div>
              </div>
              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 lg:mb-10 grow">
                <li className="flex items-center gap-2 sm:gap-3 text-sm">
                  <span className="material-symbols-outlined text-primary text-lg sm:text-xl">check_circle</span>
                  All Tiers Arena Access
                </li>
                <li className="flex items-center gap-2 sm:gap-3 text-sm">
                  <span className="material-symbols-outlined text-primary text-lg sm:text-xl">check_circle</span>
                  2x XP Boost & Reputation
                </li>
                <li className="flex items-center gap-2 sm:gap-3 text-sm">
                  <span className="material-symbols-outlined text-primary text-lg sm:text-xl">check_circle</span>
                  Unlimited Daily Battles
                </li>
                <li className="flex items-center gap-2 sm:gap-3 text-sm">
                  <span className="material-symbols-outlined text-primary text-lg sm:text-xl">check_circle</span>
                  Early Access to High-Stakes
                </li>
                <li className="flex items-center gap-2 sm:gap-3 text-sm">
                  <span className="material-symbols-outlined text-primary text-lg sm:text-xl">check_circle</span>
                  Exclusive Discord Role
                </li>
              </ul>
              <button className="w-full py-3 sm:py-4 rounded-xl bg-primary text-black font-black uppercase text-xs sm:text-sm tracking-widest hover:bg-primary-accent transition-all shadow-lg shadow-primary/30 cursor-pointer">
                Level Up Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background-dark relative overflow-hidden">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
          <div className="bg-linear-to-br from-amber-500 to-amber-700 rounded-2xl sm:rounded-[2.5rem] p-8 sm:p-12 md:p-16 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary/20">
            <div className="absolute inset-0 opacity-10" style={{backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "24px 24px"}}></div>
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black mb-4 sm:mb-6 tracking-tighter text-black uppercase">Are You Ready?</h2>
              <p className="text-sm sm:text-base lg:text-lg text-black/80 mb-6 sm:mb-8 lg:mb-10 max-w-md sm:max-w-lg lg:max-w-xl mx-auto font-medium">
                Don't let your skills go to waste. Join thousands of engineers competing for glory and real-world rewards.
              </p>
              <button className="bg-black text-primary px-8 sm:px-12 lg:px-16 py-3 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl text-base sm:text-lg lg:text-xl font-black hover:scale-105 transition-transform shadow-2xl tracking-[0.1em] sm:tracking-widest cursor-pointer">
                JOIN THE ARENA
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
