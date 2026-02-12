"use client";

import { useState, useEffect } from "react";

interface BuildingToolOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  impactScore: number;
}

interface BuildingToolsProps {
  challengeId: string;
  userId: string;
  chatId?: string;
  onToolSelect: (tool: BuildingToolOption) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function BuildingTools({
  challengeId,
  userId,
  chatId,
  onToolSelect,
  isLoading = false,
  disabled = false
}: BuildingToolsProps) {
  const [tools, setTools] = useState<BuildingToolOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBuildingTools();
  }, [challengeId, userId, chatId]);

  const fetchBuildingTools = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        challengeId,
        userId,
        ...(chatId && { chatId })
      });

      const response = await fetch(`/api/building-tools?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch building tools');
      }

      const data = await response.json();
      setTools(data.options || []);
    } catch (err) {
      console.error('Error fetching building tools:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-900/30 border-green-700 text-green-400';
      case 'medium':
        return 'bg-yellow-900/30 border-yellow-700 text-yellow-400';
      case 'hard':
        return 'bg-red-900/30 border-red-700 text-red-400';
      default:
        return 'bg-gray-900/30 border-gray-700 text-gray-400';
    }
  };

  const getImpactColor = (score: number) => {
    if (score >= 8) return 'text-purple-400';
    if (score >= 6) return 'text-blue-400';
    if (score >= 4) return 'text-green-400';
    return 'text-gray-400';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Training Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-surface-dark/50 border border-[#332a1e] rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Training Tools</h3>
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
          <p className="text-red-400">Error loading training tools: {error}</p>
          <button
            onClick={fetchBuildingTools}
            className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Training Tools</h3>
        <div className="text-sm text-gray-400">
          Select a tool to train your AI
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => !disabled && !isLoading && onToolSelect(tool)}
            disabled={disabled || isLoading}
            className={`
              relative bg-surface-dark/50 border border-[#332a1e] rounded-lg p-4
              transition-all duration-200 hover:border-[#493b22] hover:bg-surface-dark/80
              disabled:opacity-50 disabled:cursor-not-allowed
              ${!disabled && !isLoading ? 'hover:shadow-lg hover:shadow-[#493b22]/20' : ''}
              group
            `}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl text-primary">
                  {tool.icon}
                </span>
                <h4 className="font-medium text-white text-sm group-hover:text-primary transition-colors">
                  {tool.title}
                </h4>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(tool.difficulty)}`}>
                {tool.difficulty}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm mb-3 line-clamp-2">
              {tool.description}
            </p>

            {/* Impact Score */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">bolt</span>
                <span className={`text-sm font-medium ${getImpactColor(tool.impactScore)}`}>
                  Impact: {tool.impactScore}/10
                </span>
              </div>
              
              {/* Impact Indicator */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${
                      i < Math.ceil(tool.impactScore / 2)
                        ? getImpactColor(tool.impactScore)
                        : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Hover effect overlay */}
            {!disabled && !isLoading && (
              <div className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            )}
          </button>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-sidebar-dark/30 border border-[#332a1e] rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-primary">info</span>
          <span className="text-sm font-medium text-primary">How to use:</span>
        </div>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Select a training tool to focus on specific AI capabilities</li>
          <li>• Higher impact tools provide more significant training improvements</li>
          <li>• Each tool selection builds upon previous training context</li>
          <li>• Progress is tracked and scored automatically</li>
        </ul>
      </div>
    </div>
  );
}
