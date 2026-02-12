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

export default function StrengthMeter({ 
  strength, 
  totalStrength, 
  showBreakdown = false, 
  breakdown 
}: StrengthMeterProps) {
  const [animatedStrength, setAnimatedStrength] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setAnimatedStrength(strength);
    }, 100);
    return () => clearTimeout(timer);
  }, [strength]);

  const getColorClass = (value: number) => {
    if (value <= 30) return "bg-red-500";
    if (value <= 70) return "bg-amber-500";
    return "bg-green-500";
  };

  const getTextColorClass = (value: number) => {
    if (value <= 30) return "text-red-400";
    if (value <= 70) return "text-amber-400";
    return "text-green-400";
  };

  return (
    <div className={`bg-surface-dark rounded-lg p-6 border border-[#332a1e] transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-400">Build Strength</span>
          <span className={`text-lg font-bold ${getTextColorClass(strength)}`}>
            {Math.round(strength)}/100
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${getColorClass(strength)}`}
            style={{ width: `${animatedStrength}%` }}
          />
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-400">Total Model Strength</span>
          <span className="text-xl font-bold text-primary">
            {Math.round(totalStrength)}
          </span>
        </div>
      </div>

      {showBreakdown && breakdown && (
        <div className="border-t border-[#332a1e] pt-4 mt-4">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Strength Breakdown</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Base Score:</span>
              <span className="text-white">{Math.round(breakdown.baseScore)}</span>
            </div>
            {breakdown.diversityBonus > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Diversity Bonus:</span>
                <span className="text-green-400">+{breakdown.diversityBonus}</span>
              </div>
            )}
            {breakdown.synergyBonus > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Synergy Bonus:</span>
                <span className="text-green-400">+{breakdown.synergyBonus}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Color legend */}
      <div className="flex justify-between text-xs text-gray-500 mt-4">
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          0-30 Weak
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
          31-70 Moderate
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          71-100 Strong
        </span>
      </div>
    </div>
  );
}
