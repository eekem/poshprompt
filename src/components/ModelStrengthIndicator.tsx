"use client";

import { useState, useEffect } from "react";

interface TrainingProgress {
  constraintAdherence: number;
  roleConsistency: number;
  forbiddenAvoidance: number;
  overallStrength: number;
  improvementAreas: string[];
  strengths: string[];
}

interface ModelStrengthIndicatorProps {
  progress?: TrainingProgress;
  score?: number;
  maxScore?: number;
  isLoading?: boolean;
}

export default function ModelStrengthIndicator({
  progress,
  score = 0,
  maxScore = 100,
  isLoading = false
}: ModelStrengthIndicatorProps) {
  const [animatedValues, setAnimatedValues] = useState({
    overall: 0,
    constraint: 0,
    role: 0,
    forbidden: 0
  });

  useEffect(() => {
    if (progress && !isLoading) {
      const timer = setTimeout(() => {
        setAnimatedValues({
          overall: progress.overallStrength,
          constraint: progress.constraintAdherence,
          role: progress.roleConsistency,
          forbidden: progress.forbiddenAvoidance
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [progress, isLoading]);

  const getStrengthColor = (value: number) => {
    if (value >= 80) return 'text-green-400';
    if (value >= 60) return 'text-yellow-400';
    if (value >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getStrengthBgColor = (value: number) => {
    if (value >= 80) return 'bg-green-900/30 border-green-700';
    if (value >= 60) return 'bg-yellow-900/30 border-yellow-700';
    if (value >= 40) return 'bg-orange-900/30 border-orange-700';
    return 'bg-red-900/30 border-red-700';
  };

  const getProgressBarColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    if (value >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Model Strength</h3>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex justify-between mb-1">
                <div className="h-4 bg-gray-700 rounded w-24"></div>
                <div className="h-4 bg-gray-700 rounded w-12"></div>
              </div>
              <div className="h-2 bg-gray-700 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Model Strength</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStrengthBgColor(animatedValues.overall)}`}>
          <span className={getStrengthColor(animatedValues.overall)}>
            {Math.round(animatedValues.overall)}%
          </span>
        </div>
      </div>

      {/* Overall Strength */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">speed</span>
            <span className="text-sm font-medium text-white">Overall Strength</span>
          </div>
          <span className={`text-sm font-bold ${getStrengthColor(animatedValues.overall)}`}>
            {Math.round(animatedValues.overall)}%
          </span>
        </div>
        <div className="relative">
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ease-out ${getProgressBarColor(animatedValues.overall)}`}
              style={{ width: `${animatedValues.overall}%` }}
            />
          </div>
          {/* Animated glow effect */}
          <div
            className="absolute top-0 left-0 h-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 ease-out"
            style={{ 
              width: `${animatedValues.overall}%`,
              animation: animatedValues.overall > 0 ? 'shimmer 2s infinite' : 'none'
            }}
          />
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="space-y-3 pt-2">
        {/* Constraint Adherence */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-400 text-sm">rule</span>
              <span className="text-sm text-gray-300">Constraint Adherence</span>
            </div>
            <span className={`text-sm font-medium ${getStrengthColor(animatedValues.constraint)}`}>
              {Math.round(animatedValues.constraint)}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-full transition-all duration-1000 ease-out ${getProgressBarColor(animatedValues.constraint)}`}
              style={{ width: `${animatedValues.constraint}%` }}
            />
          </div>
        </div>

        {/* Role Consistency */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-400 text-sm">psychology</span>
              <span className="text-sm text-gray-300">Role Consistency</span>
            </div>
            <span className={`text-sm font-medium ${getStrengthColor(animatedValues.role)}`}>
              {Math.round(animatedValues.role)}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-full transition-all duration-1000 ease-out ${getProgressBarColor(animatedValues.role)}`}
              style={{ width: `${animatedValues.role}%` }}
            />
          </div>
        </div>

        {/* Forbidden Avoidance */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-red-400 text-sm">block</span>
              <span className="text-sm text-gray-300">Forbidden Avoidance</span>
            </div>
            <span className={`text-sm font-medium ${getStrengthColor(animatedValues.forbidden)}`}>
              {Math.round(animatedValues.forbidden)}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-full transition-all duration-1000 ease-out ${getProgressBarColor(animatedValues.forbidden)}`}
              style={{ width: `${animatedValues.forbidden}%` }}
            />
          </div>
        </div>
      </div>

      {/* Strengths and Improvement Areas */}
      {progress && (
        <div className="pt-4 space-y-3">
          {/* Strengths */}
          {progress.strengths && progress.strengths.length > 0 && (
            <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-green-400 text-sm">trending_up</span>
                <span className="text-sm font-medium text-green-400">Strengths</span>
              </div>
              <ul className="text-xs text-green-300 space-y-1">
                {progress.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-green-400 mt-0.5">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Improvement Areas */}
          {progress.improvementAreas && progress.improvementAreas.length > 0 && (
            <div className="bg-orange-900/20 border border-orange-700/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-orange-400 text-sm">trending_up</span>
                <span className="text-sm font-medium text-orange-400">Improvement Areas</span>
              </div>
              <ul className="text-xs text-orange-300 space-y-1">
                {progress.improvementAreas.map((area, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-orange-400 mt-0.5">•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Score Display */}
      <div className="mt-4 p-3 bg-sidebar-dark/30 border border-[#332a1e] rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Training Score</span>
          <span className="text-lg font-bold text-primary">
            {score}/{maxScore}
          </span>
        </div>
      </div>
    </div>
  );
}

// Add shimmer animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(200%); }
    }
  `;
  document.head.appendChild(style);
}
