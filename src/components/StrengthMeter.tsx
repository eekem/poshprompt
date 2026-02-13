"use client";

import { useEffect, useState } from "react";

interface StrengthMeterProps {
  strength: number;
  totalStrength: number;
  showBreakdown?: boolean;
  breakdown?: {
    baseScore: number;
    diversityBonus: number;
    synergyBonus: number;
  };
}

const getTierInfo = (strength: number) => {
  if (strength >= 90) {
    return { tier: 'S', color: 'text-purple-400', bgColor: 'bg-purple-500/20', borderColor: 'border-purple-500', label: 'Elite' };
  } else if (strength >= 70) {
    return { tier: 'A', color: 'text-amber-400', bgColor: 'bg-amber-500/20', borderColor: 'border-amber-500', label: 'Advanced' };
  } else if (strength >= 40) {
    return { tier: 'B', color: 'text-blue-400', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500', label: 'Skilled' };
  } else {
    return { tier: 'C', color: 'text-gray-400', bgColor: 'bg-gray-500/20', borderColor: 'border-gray-500', label: 'Rookie' };
  }
};

export default function StrengthMeter({ 
  strength, 
  totalStrength, 
  showBreakdown = false, 
  breakdown 
}: StrengthMeterProps) {
  const [animatedStrength, setAnimatedStrength] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showTierAnimation, setShowTierAnimation] = useState(false);
  
  const tierInfo = getTierInfo(strength);
  const maxStrength = 100;

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setAnimatedStrength(strength);
      if (strength >= 70) {
        setShowTierAnimation(true);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [strength]);

  return (
    <div className={`bg-panel-dark rounded-xl p-6 border border-border-dark transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      {/* Tier Badge */}
      <div className="flex justify-center mb-6">
        <div className={`relative ${showTierAnimation ? 'animate-pulse' : ''}`}>
          <div className={`px-6 py-3 rounded-full border ${tierInfo.bgColor} ${tierInfo.borderColor} ${tierInfo.color} font-bold text-2xl tracking-wider`}>
            {tierInfo.tier}
          </div>
          <div className="text-xs text-center mt-1 text-gray-400">{tierInfo.label}</div>
        </div>
      </div>
      
      {/* Main Strength Display */}
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-primary mb-2">
          {Math.round(animatedStrength)}
        </div>
        <div className="text-sm text-gray-400">Build Strength</div>
      </div>
      
      {/* Circular Progress Meter */}
      <div className="relative w-48 h-48 mx-auto mb-6">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-gray-700"
          />
          {/* Progress circle with gradient */}
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="url(#gradient)"
            strokeWidth="12"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 88}`}
            strokeDashoffset={`${2 * Math.PI * 88 * (1 - animatedStrength / maxStrength)}`}
            className="transition-all duration-1500 ease-out"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-white">{Math.round(animatedStrength)}</div>
          <div className="text-xs text-gray-400">/ {maxStrength}</div>
        </div>
      </div>
      
      {/* Total Model Strength */}
      <div className="text-center mb-6 p-4 bg-surface-dark rounded-lg">
        <div className="text-sm text-gray-400 mb-1">Total Model Strength</div>
        <div className="text-2xl font-bold text-primary">{Math.round(totalStrength)}</div>
      </div>

      {/* Breakdown */}
      {showBreakdown && breakdown && (
        <div className="border-t border-border-dark pt-4 mt-4">
          <h4 className="text-sm font-medium text-gray-400 mb-3">Strength Breakdown</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Base Score:</span>
              <span className="text-sm font-medium text-white">{Math.round(breakdown.baseScore)}</span>
            </div>
            {breakdown.diversityBonus > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Diversity Bonus:</span>
                <span className="text-sm font-medium text-green-400">+{breakdown.diversityBonus}</span>
              </div>
            )}
            {breakdown.synergyBonus > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Synergy Bonus:</span>
                <span className="text-sm font-medium text-amber-400">+{breakdown.synergyBonus}</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Reward Zones */}
      <div className="mt-6 pt-4 border-t border-border-dark">
        <div className="text-sm font-medium text-gray-400 mb-3">Reward Zones</div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className={`text-center p-2 rounded ${strength >= 40 ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700/50 text-gray-500'}`}>
            <div className="font-bold">B</div>
            <div>40+</div>
          </div>
          <div className={`text-center p-2 rounded ${strength >= 70 ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-700/50 text-gray-500'}`}>
            <div className="font-bold">A</div>
            <div>70+</div>
          </div>
          <div className={`text-center p-2 rounded ${strength >= 90 ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-700/50 text-gray-500'}`}>
            <div className="font-bold">S</div>
            <div>90+</div>
          </div>
        </div>
      </div>
    </div>
  );
}
