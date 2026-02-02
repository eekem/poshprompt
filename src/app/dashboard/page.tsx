'use client';

import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 22, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
        if (totalSeconds <= 0) return { hours: 0, minutes: 0, seconds: 0 };
        
        return {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="px-4 py-8 sm:p-12 flex flex-col items-center">
          <div className="max-w-[960px] w-full flex flex-col gap-8 sm:gap-12">
            <div className="text-center">
              <p className="text-[#f59e0b] text-xs sm:text-sm font-bold uppercase tracking-[0.3em] sm:tracking-[0.5em] mb-4 shadow-[0_0_10px_rgba(245,158,11,0.5)]">Current Active Challenge</p>
              <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-[-0.05em]">Season 4: The Alchemist's Code</h1>
              <p className="text-[#a8906e] text-sm sm:text-base md:text-lg lg:text-xl font-light mt-4 px-2">Transmute abstract concepts into precise architectural prompts.</p>
            </div>

            <div className="bg-[rgba(22,17,10,0.6)] backdrop-blur-md border border-[rgba(245,158,11,0.1)] rounded-2xl sm:rounded-3xl p-6 sm:p-10 flex flex-col gap-8 sm:gap-10">
              {/* Timer */}
              <div className="flex flex-col items-center gap-4">
                <div className="text-[#a8906e] text-xs font-bold uppercase tracking-widest">Time Remaining</div>
                <div className="flex gap-2 sm:gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center rounded-xl sm:rounded-2xl bg-[#211b11]/80 border border-[#f59e0b]/20">
                      <p className="text-white text-2xl sm:text-4xl font-black shadow-[0_0_10px_rgba(245,158,11,0.5)]">{String(timeLeft.hours).padStart(2, '0')}</p>
                    </div>
                    <p className="text-[#a8906e] text-xs uppercase font-medium">Hours</p>
                  </div>
                  <div className="text-white text-2xl sm:text-4xl font-black self-start mt-6">:</div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center rounded-xl sm:rounded-2xl bg-[#211b11]/80 border border-[#f59e0b]/20">
                      <p className="text-white text-2xl sm:text-4xl font-black shadow-[0_0_10px_rgba(245,158,11,0.5)]">{String(timeLeft.minutes).padStart(2, '0')}</p>
                    </div>
                    <p className="text-[#a8906e] text-xs uppercase font-medium">Minutes</p>
                  </div>
                  <div className="text-white text-2xl sm:text-4xl font-black self-start mt-6">:</div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center rounded-xl sm:rounded-2xl bg-[#211b11]/80 border border-[#f59e0b]/20">
                      <p className="text-white text-2xl sm:text-4xl font-black shadow-[0_0_10px_rgba(245,158,11,0.5)]">{String(timeLeft.seconds).padStart(2, '0')}</p>
                    </div>
                    <p className="text-[#a8906e] text-xs uppercase font-medium">Seconds</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2">
                  <div className="flex flex-col">
                    <p className="text-white text-base sm:text-lg font-bold">Grandmaster Tier Progress</p>
                    <p className="text-[#a8906e] text-xs sm:text-sm">1,250 XP remaining until rank up</p>
                  </div>
                  <p className="text-[#f59e0b] text-xl sm:text-2xl font-black shadow-[0_0_10px_rgba(245,158,11,0.5)]">85%</p>
                </div>
                <div className="h-3 sm:h-4 w-full bg-[#1a140c] rounded-full overflow-hidden border border-[#2d2417]">
                  <div className="h-full bg-[#f59e0b] shadow-[0_0_20px_rgba(245,158,11,0.3)] relative transition-all duration-500" style={{width: '85%'}}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex justify-center mt-4">
                <button className="group relative px-8 sm:px-12 py-4 sm:py-5 bg-[#f59e0b] rounded-xl font-black text-base sm:text-xl text-black tracking-tight overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.3)] shadow-[0_0_30px_rgba(245,158,11,0.2)] w-full sm:w-auto">
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    ENTER THE ARENA
                    <span className="material-symbols-outlined">bolt</span>
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
              </div>
            </div>

            {/* XP Accumulation Section */}
            <div className="bg-[rgba(22,17,10,0.6)] backdrop-blur-md border border-[rgba(245,158,11,0.1)] rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h3 className="text-white text-lg sm:text-xl font-bold">XP Accumulation</h3>
                <button className="text-[#f59e0b] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
                  Refresh Target
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="flex flex-col gap-2">
                  <p className="text-[#a8906e] text-sm">Current Session</p>
                  <p className="text-white text-xl sm:text-2xl font-bold">+320 XP</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-[#a8906e] text-sm">Today's Total</p>
                  <p className="text-white text-xl sm:text-2xl font-bold">+1,250 XP</p>
                </div>
              </div>
            </div>

            {/* Pending Rewards Section */}
            <div className="bg-[rgba(22,17,10,0.6)] backdrop-blur-md border border-[rgba(245,158,11,0.1)] rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
              <h3 className="text-white text-lg sm:text-xl font-bold">Pending Rewards</h3>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-[#211b11]/50 rounded-xl sm:rounded-2xl border border-[#f59e0b]/20 gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-white font-bold">Current Round</p>
                  <p className="text-[#a8906e] text-sm">Finalizes in 4h 22m</p>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="text-right">
                    <p className="text-white text-lg sm:text-xl font-bold">2,450</p>
                    <p className="text-[#f59e0b] text-xs font-bold uppercase tracking-widest">COINS</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-lg sm:text-xl font-bold">$24.50</p>
                    <p className="text-[#f59e0b] text-xs font-bold uppercase tracking-widest">CASH</p>
                  </div>
                </div>
              </div>
              <p className="text-[#a8906e]/60 text-xs italic">Rewards are finalized when the challenge round ends. XP is awarded immediately.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-[rgba(22,17,10,0.6)] backdrop-blur-md border border-[rgba(245,158,11,0.1)] p-4 sm:p-6 rounded-xl sm:rounded-2xl flex flex-col gap-1 border-l-4 border-l-[#f59e0b] shadow-lg">
                <p className="text-[#a8906e] text-xs font-bold uppercase tracking-wider">Current XP</p>
                <div className="flex items-center gap-2">
                  <p className="text-xl sm:text-2xl font-black text-white">8,750</p>
                  <span className="text-[#f59e0b] text-xs font-black uppercase tracking-widest px-2 py-0.5 bg-[#f59e0b]/10 rounded border border-[#f59e0b]/20">XP</span>
                </div>
              </div>
              <div className="bg-[rgba(22,17,10,0.6)] backdrop-blur-md border border-[rgba(245,158,11,0.1)] p-4 sm:p-6 rounded-xl sm:rounded-2xl flex flex-col gap-1">
                <p className="text-[#a8906e] text-xs font-bold uppercase tracking-wider">Pending Coins</p>
                <div className="flex items-center gap-2">
                  <p className="text-xl sm:text-2xl font-black text-white">2,450</p>
                  <span className="text-[#f59e0b] text-xs font-black uppercase tracking-widest px-2 py-0.5 bg-[#f59e0b]/10 rounded border border-[#f59e0b]/20">COINS</span>
                </div>
              </div>
              <div className="bg-[rgba(22,17,10,0.6)] backdrop-blur-md border border-[rgba(245,158,11,0.1)] p-4 sm:p-6 rounded-xl sm:rounded-2xl flex flex-col gap-1">
                <p className="text-[#a8906e] text-xs font-bold uppercase tracking-wider">Next Target</p>
                <div className="flex items-center gap-2">
                  <p className="text-xl sm:text-2xl font-black text-white">1,250</p>
                  <span className="text-[#f59e0b] text-xs font-black uppercase tracking-widest px-2 py-0.5 bg-[#f59e0b]/10 rounded border border-[#f59e0b]/20">XP</span>
                </div>
              </div>
            </div>

            <p className="text-center text-[#a8906e]/40 text-xs sm:text-sm italic py-6 sm:py-8 px-4">
              "Precision is the only alchemy that yields true digital gold." — The Architect
            </p>
          </div>
        </div>
  );
}
