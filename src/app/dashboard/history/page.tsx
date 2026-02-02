'use client';

import { useState } from 'react';

export default function History() {
  const [activeTab, setActiveTab] = useState<'challenges' | 'rounds'>('challenges');

  const challengeHistory = [
    {
      id: 1,
      type: 'Recreation',
      title: 'Architectural Visualization',
      xp: 180,
      coins: 245,
      status: 'completed',
      date: '2 hours ago',
      score: 92
    },
    {
      id: 2,
      type: 'Problem-Solving',
      title: 'Code Debug Analysis',
      xp: 320,
      coins: 420,
      status: 'completed',
      date: '5 hours ago',
      score: 88
    },
    {
      id: 3,
      type: 'Optimization',
      title: 'Token Efficiency Challenge',
      xp: 450,
      coins: 580,
      status: 'completed',
      date: '1 day ago',
      score: 95
    },
    {
      id: 4,
      type: 'Recreation',
      title: 'Style Transfer Recreation',
      xp: 150,
      coins: 195,
      status: 'completed',
      date: '1 day ago',
      score: 78
    },
    {
      id: 5,
      type: 'Problem-Solving',
      title: 'Data Structure Analysis',
      xp: 280,
      coins: 365,
      status: 'completed',
      date: '2 days ago',
      score: 85
    }
  ];

  const roundHistory = [
    {
      id: 1,
      season: 'Season 4',
      round: 'Round 3',
      status: 'active',
      startDate: 'Feb 1, 2026',
      endDate: 'Feb 5, 2026',
      totalXP: 1250,
      estimatedCoins: 2450,
      estimatedCash: 24.50,
      challengesCompleted: 12
    },
    {
      id: 2,
      season: 'Season 4',
      round: 'Round 2',
      status: 'completed',
      startDate: 'Jan 25, 2026',
      endDate: 'Jan 29, 2026',
      totalXP: 2100,
      finalCoins: 3200,
      finalCash: 32.00,
      challengesCompleted: 18
    },
    {
      id: 3,
      season: 'Season 4',
      round: 'Round 1',
      status: 'completed',
      startDate: 'Jan 18, 2026',
      endDate: 'Jan 22, 2026',
      totalXP: 1850,
      finalCoins: 2800,
      finalCash: 28.00,
      challengesCompleted: 15
    }
  ];

  return (
    <div className="p-4 sm:p-8 lg:p-12 flex flex-col items-center">
      <div className="max-w-[1200px] w-full flex flex-col gap-12">
        {/* Header */}
        <div className="text-center">
          <p className="text-[#f59e0b] text-sm font-bold uppercase tracking-[0.5em] mb-4 shadow-[0_0_10px_rgba(245,158,11,0.5)]">Challenge History</p>
          <h1 className="text-white text-3xl sm:text-4xl lg:text-6xl font-black leading-tight tracking-[-0.05em]">Your Journey</h1>
          <p className="text-[#a8906e] text-xl font-light mt-4">Track your progress and achievements over time.</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-[rgba(22,17,10,0.6)] backdrop-blur-md border border-[rgba(245,158,11,0.1)] p-4 sm:p-6 rounded-xl sm:rounded-2xl flex flex-col gap-1">
            <p className="text-[#a8906e] text-xs font-bold uppercase tracking-wider">Total Challenges</p>
            <p className="text-xl sm:text-2xl font-black text-white">47</p>
          </div>
          <div className="bg-[rgba(22,17,10,0.6)] backdrop-blur-md border border-[rgba(245,158,11,0.1)] p-4 sm:p-6 rounded-xl sm:rounded-2xl flex flex-col gap-1">
            <p className="text-[#a8906e] text-xs font-bold uppercase tracking-wider">Total XP</p>
            <p className="text-xl sm:text-2xl font-black text-white">8,750</p>
          </div>
          <div className="bg-[rgba(22,17,10,0.6)] backdrop-blur-md border border-[rgba(245,158,11,0.1)] p-4 sm:p-6 rounded-xl sm:rounded-2xl flex flex-col gap-1">
            <p className="text-[#a8906e] text-xs font-bold uppercase tracking-wider">Avg Score</p>
            <p className="text-xl sm:text-2xl font-black text-white">87.6</p>
          </div>
          <div className="bg-[rgba(22,17,10,0.6)] backdrop-blur-md border border-[rgba(245,158,11,0.1)] p-4 sm:p-6 rounded-xl sm:rounded-2xl flex flex-col gap-1">
            <p className="text-[#a8906e] text-xs font-bold uppercase tracking-wider">Success Rate</p>
            <p className="text-xl sm:text-2xl font-black text-white">94%</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-[rgba(22,17,10,0.6)] backdrop-blur-md border border-[rgba(245,158,11,0.1)] rounded-2xl sm:rounded-3xl p-2 flex gap-2 flex-col sm:flex-row">
          <button
            onClick={() => setActiveTab('challenges')}
            className={`flex-1 px-4 sm:px-6 py-3 rounded-xl font-bold uppercase tracking-wider transition-all ${
              activeTab === 'challenges' 
                ? 'bg-[#f59e0b] text-black' 
                : 'text-[#a8906e] hover:text-white'
            }`}
          >
            Challenge History
          </button>
          <button
            onClick={() => setActiveTab('rounds')}
            className={`flex-1 px-4 sm:px-6 py-3 rounded-xl font-bold uppercase tracking-wider transition-all ${
              activeTab === 'rounds' 
                ? 'bg-[#f59e0b] text-black' 
                : 'text-[#a8906e] hover:text-white'
            }`}
          >
            Round History
          </button>
        </div>

        {/* Content */}
        <div className="bg-[rgba(22,17,10,0.6)] backdrop-blur-md border border-[rgba(245,158,11,0.1)] rounded-2xl sm:rounded-3xl p-6 sm:p-8">
          {activeTab === 'challenges' && (
            <div className="flex flex-col gap-6">
              <h3 className="text-white text-xl font-bold">Recent Challenges</h3>
              <div className="space-y-4">
                {challengeHistory.map((challenge) => (
                  <div key={challenge.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-[#211b11]/50 rounded-xl sm:rounded-2xl border border-[#f59e0b]/10 gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 text-xs font-bold uppercase rounded-full ${
                          challenge.type === 'Recreation' ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30' :
                          challenge.type === 'Problem-Solving' ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
                          'bg-purple-500/20 text-purple-500 border border-purple-500/30'
                        }`}>
                          {challenge.type}
                        </span>
                        <span className="text-[#a8906e] text-sm">{challenge.date}</span>
                      </div>
                      <p className="text-white font-bold">{challenge.title}</p>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="text-center">
                        <p className="text-white text-lg sm:text-xl font-bold">{challenge.xp}</p>
                        <p className="text-[#f59e0b] text-xs font-bold uppercase tracking-widest">XP</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white text-lg sm:text-xl font-bold">{challenge.coins}</p>
                        <p className="text-[#f59e0b] text-xs font-bold uppercase tracking-widest">COINS</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white text-lg sm:text-xl font-bold">{challenge.score}</p>
                        <p className="text-[#f59e0b] text-xs font-bold uppercase tracking-widest">SCORE</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'rounds' && (
            <div className="flex flex-col gap-6">
              <h3 className="text-white text-xl font-bold">Round Performance</h3>
              <div className="space-y-4">
                {roundHistory.map((round) => (
                  <div key={round.id} className="p-4 bg-[#211b11]/50 rounded-xl sm:rounded-2xl border border-[#f59e0b]/10">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-4">
                      <div>
                        <h4 className="text-white text-lg font-bold">{round.season} - {round.round}</h4>
                        <p className="text-[#a8906e] text-sm">{round.startDate} to {round.endDate}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${
                        round.status === 'active' 
                          ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' 
                          : 'bg-green-500/20 text-green-500 border-green-500/30'
                      }`}>
                        {round.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="text-[#a8906e] text-xs uppercase tracking-wider">Challenges</p>
                        <p className="text-white font-bold">{round.challengesCompleted}</p>
                      </div>
                      <div>
                        <p className="text-[#a8906e] text-xs uppercase tracking-wider">Total XP</p>
                        <p className="text-white font-bold">{round.totalXP.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[#a8906e] text-xs uppercase tracking-wider">
                          {round.status === 'active' ? 'Est. Coins' : 'Final Coins'}
                        </p>
                        <p className="text-white font-bold">
                          ${round.status === 'active' ? round.estimatedCoins : round.finalCoins}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#a8906e] text-xs uppercase tracking-wider">
                          {round.status === 'active' ? 'Est. Cash' : 'Final Cash'}
                        </p>
                        <p className="text-white font-bold">
                          ${round.status === 'active' ? (round.estimatedCash || 0).toFixed(2) : (round.finalCash || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-[#a8906e]/40 text-sm italic py-8">
          "Every challenge completed is a step toward mastery - your history tells the story of your growth."
        </p>
      </div>
    </div>
  );
}
