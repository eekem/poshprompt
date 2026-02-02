'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Challenges() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const router = useRouter();

  const challengeTypes = [
    {
      id: 'recreation',
      title: 'Recreation Challenges',
      description: 'Reproduce target outputs with precise prompting',
      icon: 'auto_fix_high',
      difficulty: 'Medium',
      avgTime: '5-10 min',
      xpReward: '100-250 XP',
      examples: [
        'Recreate this specific image style and composition',
        'Generate text matching the exact tone and structure',
        'Reproduce this data format with identical schema'
      ]
    },
    {
      id: 'problem-solving',
      title: 'Problem-Solving Challenges',
      description: 'Solve tasks with accurate and efficient prompts',
      icon: 'psychology',
      difficulty: 'Hard',
      avgTime: '8-15 min',
      xpReward: '200-400 XP',
      examples: [
        'Debug this code issue using only prompts',
        'Analyze and summarize complex technical documentation',
        'Create a solution for this business scenario'
      ]
    },
    {
      id: 'optimization',
      title: 'Optimization Challenges',
      description: 'Achieve maximum results with minimal resources',
      icon: 'speed',
      difficulty: 'Expert',
      avgTime: '10-20 min',
      xpReward: '300-500 XP',
      examples: [
        'Generate the same output with 50% fewer tokens',
        'Optimize prompt structure for faster inference',
        'Balance quality vs efficiency trade-offs'
      ]
    }
  ];

  const selectedChallenge = challengeTypes.find(c => c.id === selectedType);

  return (
    <div className="p-4 sm:p-8 lg:p-12 flex flex-col items-center">
      <div className="max-w-[1200px] w-full flex flex-col gap-12">
        {/* Header */}
        <div className="text-center">
          <p className="text-[#f59e0b] text-sm font-bold uppercase tracking-[0.5em] mb-4 shadow-[0_0_10px_rgba(245,158,11,0.5)]">Challenge Types</p>
          <h1 className="text-white text-3xl sm:text-4xl lg:text-6xl font-black leading-tight tracking-[-0.05em]">Master Your Craft</h1>
          <p className="text-[#a8906e] text-xl font-light mt-4">Choose your challenge type and earn XP through prompt mastery.</p>
        </div>

        {/* Challenge Types Grid */}
        {!selectedType ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {challengeTypes.map((challenge) => (
              <div
                key={challenge.id}
                onClick={() => setSelectedType(challenge.id)}
                className="bg-[rgba(22,17,10,0.6)] backdrop-blur-md border border-[rgba(245,158,11,0.1)] rounded-2xl sm:rounded-3xl p-6 sm:p-8 cursor-pointer transition-all hover:scale-105 hover:border-[rgba(245,158,11,0.3)] group"
              >
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#f59e0b]/20 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:bg-[#f59e0b]/30 transition-colors">
                      <span className="material-symbols-outlined text-2xl sm:text-3xl text-[#f59e0b]">{challenge.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white text-lg sm:text-xl font-bold text-center sm:text-left">{challenge.title}</h3>
                      <span className={`inline-block px-3 py-1 text-xs font-bold uppercase rounded-full ${
                        challenge.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
                        challenge.difficulty === 'Hard' ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
                        'bg-purple-500/20 text-purple-500 border border-purple-500/30'
                      }`}>
                        {challenge.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-[#a8906e] text-sm leading-relaxed">{challenge.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#211b11]/50 rounded-xl p-3 border border-[#f59e0b]/10">
                      <p className="text-[#a8906e] text-xs uppercase tracking-wider">Avg Time</p>
                      <p className="text-white font-bold">{challenge.avgTime}</p>
                    </div>
                    <div className="bg-[#211b11]/50 rounded-xl p-3 border border-[#f59e0b]/10">
                      <p className="text-[#a8906e] text-xs uppercase tracking-wider">XP Reward</p>
                      <p className="text-white font-bold">{challenge.xpReward}</p>
                    </div>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedType(challenge.id);
                    }}
                    className="w-full bg-[#f59e0b] text-black font-bold py-3 px-4 rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 group"
                  >
                    <span>Start Challenge</span>
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Back Button */}
            <button
              onClick={() => setSelectedType(null)}
              className="self-start text-[#f59e0b] font-bold uppercase tracking-widest text-sm hover:text-white transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Back to Challenges
            </button>

            {/* Selected Challenge Details */}
            <div className="bg-[rgba(22,17,10,0.6)] backdrop-blur-md border border-[rgba(245,158,11,0.1)] rounded-2xl sm:rounded-3xl p-6 sm:p-10">
              <div className="flex flex-col items-center text-center gap-4 mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#f59e0b]/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl sm:text-4xl text-[#f59e0b]">{selectedChallenge?.icon}</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-white text-2xl sm:text-3xl font-bold mb-2">{selectedChallenge?.title}</h2>
                  <p className="text-[#a8906e] text-lg">{selectedChallenge?.description}</p>
                </div>
                <div className="text-center sm:text-right">
                  <p className="text-[#f59e0b] text-2xl font-black">{selectedChallenge?.xpReward}</p>
                  <p className="text-[#a8906e] text-sm">per challenge</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-[#211b11]/50 rounded-xl p-4 border border-[#f59e0b]/10">
                  <p className="text-[#a8906e] text-xs uppercase tracking-wider mb-1">Difficulty</p>
                  <p className="text-white font-bold">{selectedChallenge?.difficulty}</p>
                </div>
                <div className="bg-[#211b11]/50 rounded-xl p-4 border border-[#f59e0b]/10">
                  <p className="text-[#a8906e] text-xs uppercase tracking-wider mb-1">Average Time</p>
                  <p className="text-white font-bold">{selectedChallenge?.avgTime}</p>
                </div>
                <div className="bg-[#211b11]/50 rounded-xl p-4 border border-[#f59e0b]/10">
                  <p className="text-[#a8906e] text-xs uppercase tracking-wider mb-1">Success Rate</p>
                  <p className="text-white font-bold">68%</p>
                </div>
              </div>

              <div className="border-t border-[#f59e0b]/20 pt-6 sm:pt-8">
                <h3 className="text-white text-lg sm:text-xl font-bold mb-3 sm:mb-4">Example Challenges</h3>
                <div className="space-y-2 sm:space-y-3">
                  {selectedChallenge?.examples.map((example, index) => (
                    <div key={index} className="bg-[#211b11]/30 rounded-xl p-3 sm:p-4 border border-[#f59e0b]/10">
                      <p className="text-[#a8906e] text-xs sm:text-sm leading-relaxed">{example}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center mt-6 sm:mt-8">
                <button 
                  onClick={() => router.push('/dashboard/challenges/arena')}
                  className="w-full max-w-md group relative px-6 sm:px-12 py-4 sm:py-5 bg-[#f59e0b] rounded-xl font-black text-base sm:text-lg text-black tracking-tight overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                    <span className="text-sm sm:text-base">Start {selectedChallenge?.title.split(' ')[0]} Challenge</span>
                    <span className="material-symbols-outlined text-lg sm:text-xl">play_arrow</span>
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-[#a8906e]/40 text-sm italic py-8">
          "Every prompt is a puzzle waiting to be solved with precision and creativity."
        </p>
      </div>
    </div>
  );
}
