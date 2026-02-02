'use client';

import { useState } from 'react';

export default function Rewards() {
  const [activeTab, setActiveTab] = useState<'xp' | 'coins' | 'cash'>('xp');

  const xpHistory = [
    { id: 1, challenge: 'Recreation Challenge #1247', xp: 180, time: '2 hours ago', type: 'earned' },
    { id: 2, challenge: 'Problem-Solving Challenge #892', xp: 320, time: '5 hours ago', type: 'earned' },
    { id: 3, challenge: 'Optimization Challenge #456', xp: 450, time: '1 day ago', type: 'earned' },
    { id: 4, challenge: 'Recreation Challenge #1246', xp: 150, time: '1 day ago', type: 'earned' },
    { id: 5, challenge: 'Daily Target Refresh', xp: -50, time: '2 days ago', type: 'penalty' },
  ];

  const coinHistory = [
    { id: 1, round: 'Season 4 - Round 3', coins: 2450, status: 'pending', finalizes: '4h 22m' },
    { id: 2, round: 'Season 4 - Round 2', coins: 3200, status: 'finalized', finalized: '3 days ago' },
    { id: 3, round: 'Season 4 - Round 1', coins: 1800, status: 'finalized', finalized: '10 days ago' },
    { id: 4, round: 'Season 3 - Round 8', coins: 2900, status: 'finalized', finalized: '17 days ago' },
  ];

  const cashHistory = [
    { id: 1, round: 'Season 4 - Round 2', amount: 32.00, status: 'redeemable', date: '3 days ago' },
    { id: 2, round: 'Season 4 - Round 1', amount: 18.00, status: 'redeemed', date: '10 days ago' },
    { id: 3, round: 'Season 3 - Round 8', amount: 29.00, status: 'redeemed', date: '17 days ago' },
  ];

  return (
    <div className="p-4 sm:p-8 lg:p-12 flex flex-col items-center">
      <div className="max-w-[1200px] w-full flex flex-col gap-12">
        {/* Header */}
        <div className="text-center">
          <p className="text-[#f59e0b] text-sm font-bold uppercase tracking-[0.5em] mb-4 shadow-[0_0_10px_rgba(245,158,11,0.5)]">Rewards & Earnings</p>
          <h1 className="text-white text-3xl sm:text-4xl lg:text-6xl font-black leading-tight tracking-[-0.05em]">Your Progress</h1>
          <p className="text-[#a8906e] text-xl font-light mt-4">Track your XP, coins, and cash rewards.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-[rgba(22,17,10,0.6)] backdrop-blur-md border border-[rgba(245,158,11,0.1)] p-6 rounded-2xl flex flex-col gap-1 border-l-4 border-l-[#f59e0b] shadow-lg">
            <p className="text-[#a8906e] text-xs font-bold uppercase tracking-wider">Total XP</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-black text-white">8,750</p>
              <span className="text-[#f59e0b] text-xs font-black uppercase tracking-widest px-2 py-0.5 bg-[#f59e0b]/10 rounded border border-[#f59e0b]/20">XP</span>
            </div>
          </div>
          <div className="bg-[rgba(22,17,10,0.6)] backdrop-blur-md border border-[rgba(245,158,11,0.1)] p-6 rounded-2xl flex flex-col gap-1">
            <p className="text-[#a8906e] text-xs font-bold uppercase tracking-wider">Available Coins</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-black text-white">3,200</p>
              <span className="text-[#f59e0b] text-xs font-black uppercase tracking-widest px-2 py-0.5 bg-[#f59e0b]/10 rounded border border-[#f59e0b]/20">COINS</span>
            </div>
          </div>
          <div className="bg-[rgba(22,17,10,0.6)] backdrop-blur-md border border-[rgba(245,158,11,0.1)] p-6 rounded-2xl flex flex-col gap-1">
            <p className="text-[#a8906e] text-xs font-bold uppercase tracking-wider">Redeemable Cash</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-black text-white">$32.00</p>
              <span className="text-[#f59e0b] text-xs font-black uppercase tracking-widest px-2 py-0.5 bg-[#f59e0b]/10 rounded border border-[#f59e0b]/20">USD</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-[rgba(22,17,10,0.6)] backdrop-blur-md border border-[rgba(245,158,11,0.1)] rounded-2xl sm:rounded-3xl p-2 flex gap-2 flex-col sm:flex-row">
          <button
            onClick={() => setActiveTab('xp')}
            className={`flex-1 px-4 sm:px-6 py-3 rounded-xl font-bold uppercase tracking-wider transition-all ${
              activeTab === 'xp' 
                ? 'bg-[#f59e0b] text-black' 
                : 'text-[#a8906e] hover:text-white'
            }`}
          >
            XP History
          </button>
          <button
            onClick={() => setActiveTab('coins')}
            className={`flex-1 px-4 sm:px-6 py-3 rounded-xl font-bold uppercase tracking-wider transition-all ${
              activeTab === 'coins' 
                ? 'bg-[#f59e0b] text-black' 
                : 'text-[#a8906e] hover:text-white'
            }`}
          >
            Coin Rewards
          </button>
          <button
            onClick={() => setActiveTab('cash')}
            className={`flex-1 px-4 sm:px-6 py-3 rounded-xl font-bold uppercase tracking-wider transition-all ${
              activeTab === 'cash' 
                ? 'bg-[#f59e0b] text-black' 
                : 'text-[#a8906e] hover:text-white'
            }`}
          >
            Cash Payouts
          </button>
        </div>

        {/* Content */}
        <div className="bg-[rgba(22,17,10,0.6)] backdrop-blur-md border border-[rgba(245,158,11,0.1)] rounded-2xl sm:rounded-3xl p-4 sm:p-8">
          {activeTab === 'xp' && (
            <div className="flex flex-col gap-6">
              <h3 className="text-white text-xl font-bold">XP Transaction History</h3>
              <div className="space-y-4">
                {xpHistory.map((entry) => (
                  <div key={entry.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-4 bg-[#211b11]/50 rounded-xl border border-[#f59e0b]/10">
                    <div className="flex-1">
                      <p className="text-white font-bold">{entry.challenge}</p>
                      <p className="text-[#a8906e] text-sm">{entry.time}</p>
                    </div>
                    <div className={`text-lg sm:text-xl font-black ${
                      entry.type === 'earned' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {entry.type === 'earned' ? '+' : ''}{entry.xp} XP
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'coins' && (
            <div className="flex flex-col gap-6">
              <h3 className="text-white text-xl font-bold">Coin Reward History</h3>
              <div className="space-y-4">
                {coinHistory.map((entry) => (
                  <div key={entry.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 p-4 bg-[#211b11]/50 rounded-xl border border-[#f59e0b]/10">
                    <div className="flex-1">
                      <p className="text-white font-bold">{entry.round}</p>
                      <p className="text-[#a8906e] text-sm">
                        {entry.status === 'pending' ? `Finalizes in ${entry.finalizes}` : `Finalized ${entry.finalized}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-left sm:text-right">
                        <p className="text-white text-lg sm:text-xl font-black">{entry.coins}</p>
                        <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                          entry.status === 'pending' 
                            ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' 
                            : 'bg-green-500/20 text-green-500 border-green-500/30'
                        }`}>
                          {entry.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[#a8906e]/60 text-sm italic">Coins are calculated based on your performance and finalized when each round ends.</p>
            </div>
          )}

          {activeTab === 'cash' && (
            <div className="flex flex-col gap-6">
              <h3 className="text-white text-xl font-bold">Cash Payout History</h3>
              <div className="space-y-4">
                {cashHistory.map((entry) => (
                  <div key={entry.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 p-4 bg-[#211b11]/50 rounded-xl border border-[#f59e0b]/10">
                    <div className="flex-1">
                      <p className="text-white font-bold">{entry.round}</p>
                      <p className="text-[#a8906e] text-sm">{entry.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-left sm:text-right">
                        <p className="text-white text-lg sm:text-xl font-black">${entry.amount.toFixed(2)}</p>
                        <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                          entry.status === 'redeemable' 
                            ? 'bg-blue-500/20 text-blue-500 border-blue-500/30' 
                            : 'bg-green-500/20 text-green-500 border-green-500/30'
                        }`}>
                          {entry.status}
                        </span>
                      </div>
                      {entry.status === 'redeemable' && (
                        <button className="w-full sm:w-auto px-4 py-2 bg-[#f59e0b] text-black font-bold rounded-lg hover:scale-105 transition-transform">
                          Redeem
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[#a8906e]/60 text-sm italic">Cash payouts are available for redemption after round finalization.</p>
            </div>
          )}
        </div>

        <p className="text-center text-[#a8906e]/40 text-sm italic py-8">
          "Your skill translates directly into value - every XP earned is a step toward mastery."
        </p>
      </div>
    </div>
  );
}
