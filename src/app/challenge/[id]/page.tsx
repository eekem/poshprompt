"use client";

import { useState, useEffect } from "react";
import React from "react";
import { useParams } from "next/navigation";
import { useAuth } from '@/app/lib/use-auth';
import { ScoringService, PointMap, Tool, Archetype, ScoringResult } from '@/lib/scoringService';
import Modal from "@/components/Modal";
import TopUpModal from "@/components/TopUpModal";
import StrengthMeter from "@/components/StrengthMeter";
import ModelCreationModal from "@/components/ModelCreationModal";


// Model Feature Display Component
interface ModelFeatureDisplayProps {
  features: {
    robustness: number;
    accuracy: number;
    stability: number;
    creativity: number;
    efficiency: number;
  };
  featureCaps: {
    creativity: number;
    efficiency: number;
  };
  penalties?: {
    hallucination_risk: number;
    over_creativity: number;
    latency_overflow: number;
  };
}

const ModelFeatureDisplay: React.FC<ModelFeatureDisplayProps> = ({ features, featureCaps, penalties }) => {
  const featureConfigs = [
    { 
      key: 'robustness' as keyof typeof features, 
      label: 'Robustness', 
      color: 'bg-blue-500', 
      max: 100,
      icon: 'shield'
    },
    { 
      key: 'accuracy' as keyof typeof features, 
      label: 'Accuracy', 
      color: 'bg-green-500', 
      max: 100,
      icon: 'target'
    },
    { 
      key: 'stability' as keyof typeof features, 
      label: 'Stability', 
      color: 'bg-purple-500', 
      max: 100,
      icon: 'balance'
    },
    { 
      key: 'creativity' as keyof typeof features, 
      label: 'Creativity', 
      color: 'bg-pink-500', 
      max: featureCaps.creativity,
      icon: 'palette'
    },
    { 
      key: 'efficiency' as keyof typeof features, 
      label: 'Efficiency', 
      color: 'bg-amber-500', 
      max: featureCaps.efficiency,
      icon: 'speed'
    },
  ];

  const getPercentage = (value: number, max: number) => {
    return Math.round((value / max) * 100);
  };

  const getBarColor = (percentage: number, baseColor: string) => {
    if (percentage >= 80) return baseColor;
    if (percentage >= 50) return baseColor.replace('500', '400');
    return baseColor.replace('500', '300');
  };

  return (
    <div className="p-4 bg-panel-dark border border-border-dark rounded-xl">
      <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">analytics</span>
        Model Features
      </h4>
      
      <div className="space-y-3">
        {featureConfigs.map((config) => {
          const value = features[config.key];
          const percentage = getPercentage(value, config.max);
          const barColor = getBarColor(percentage, config.color);
          
          return (
            <div key={config.key} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs text-gray-400">
                    {config.icon}
                  </span>
                  <span className="text-xs text-gray-300">{config.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-white">
                    {value}/{config.max}
                  </span>
                  <span className={`text-xs font-medium ${
                    percentage >= 80 ? 'text-green-400' : 
                    percentage >= 50 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {percentage}%
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${barColor}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {penalties && (
        <div className="mt-4 pt-4 border-t border-border-dark">
          <h5 className="text-xs font-semibold text-red-400 mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">warning</span>
            Penalties
          </h5>
          <div className="space-y-1">
            {penalties.hallucination_risk > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Hallucination Risk:</span>
                <span className="text-xs font-medium text-red-400">
                  -{penalties.hallucination_risk.toFixed(1)}
                </span>
              </div>
            )}
            {penalties.over_creativity > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Over Creativity:</span>
                <span className="text-xs font-medium text-red-400">
                  -{penalties.over_creativity.toFixed(1)}
                </span>
              </div>
            )}
            {penalties.latency_overflow > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Latency Overflow:</span>
                <span className="text-xs font-medium text-red-400">
                  -{penalties.latency_overflow.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Archetype Selection Component
interface ArchetypeSelectionProps {
  archetypes: Archetype[];
  selectedArchetype: Archetype | null;
  onArchetypeSelect: (archetype: Archetype) => void;
}

const ArchetypeSelection: React.FC<ArchetypeSelectionProps> = ({ 
  archetypes, 
  selectedArchetype, 
  onArchetypeSelect 
}) => {
  const getArchetypeIcon = (type: Archetype['type']) => {
    switch (type) {
      case 'Guardian': return 'shield';
      case 'SpeedRunner': return 'speed';
      case 'Creator': return 'palette';
      default: return 'psychology';
    }
  };

  const getArchetypeColor = (type: Archetype['type']) => {
    switch (type) {
      case 'Guardian': return 'border-blue-500 bg-blue-500/10';
      case 'SpeedRunner': return 'border-amber-500 bg-amber-500/10';
      case 'Creator': return 'border-purple-500 bg-purple-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getArchetypeSelectedColor = (type: Archetype['type']) => {
    switch (type) {
      case 'Guardian': return 'ring-blue-500 border-blue-400 bg-blue-500/20';
      case 'SpeedRunner': return 'ring-amber-500 border-amber-400 bg-amber-500/20';
      case 'Creator': return 'ring-purple-500 border-purple-400 bg-purple-500/20';
      default: return 'ring-gray-500 border-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="p-4 bg-panel-dark border border-border-dark rounded-xl">
      <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">strategy</span>
        Choose Your Strategy
      </h4>
      
      <div className="space-y-3">
        {archetypes.map((archetype) => {
          const isSelected = selectedArchetype?.type === archetype.type;
          const colorClass = isSelected ? getArchetypeSelectedColor(archetype.type) : getArchetypeColor(archetype.type);
          
          return (
            <div
              key={archetype.type}
              onClick={() => onArchetypeSelect(archetype)}
              className={`
                p-3 rounded-lg border cursor-pointer transition-all duration-200
                ${colorClass}
                ${isSelected ? 'ring-2 shadow-lg' : 'hover:border-opacity-60'}
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isSelected ? 'bg-white/20' : 'bg-surface-dark'
                }`}>
                  <span className={`material-symbols-outlined text-sm ${
                    isSelected ? 'text-white' : 'text-primary'
                  }`}>
                    {getArchetypeIcon(archetype.type)}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className={`font-semibold text-sm ${
                      isSelected ? 'text-white' : 'text-gray-300'
                    }`}>
                      {archetype.type}
                    </h5>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-surface-dark text-gray-400'
                    }`}>
                      {archetype.meta_shift}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    {Object.entries(archetype.expectations).map(([feature, weight]) => (
                      <div key={feature} className="flex justify-between items-center text-xs">
                        <span className="text-gray-400 capitalize">{feature}:</span>
                        <span className={`font-medium ${
                          isSelected ? 'text-white' : 'text-gray-300'
                        }`}>
                          {(weight as number * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {isSelected && (
                <div className="mt-2 pt-2 border-t border-white/20">
                  <div className="flex items-center gap-1 text-white">
                    <span className="material-symbols-outlined text-xs">check_circle</span>
                    <span className="text-xs font-medium">Selected Strategy</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {!selectedArchetype && (
        <div className="mt-3 pt-3 border-t border-border-dark">
          <p className="text-xs text-gray-400">
            Select a strategy to customize how your model is evaluated. Each archetype emphasizes different features.
          </p>
        </div>
      )}
    </div>
  );
};

// Live Strength Preview Component
interface LiveStrengthPreviewProps {
  selectedTools: string[];
  sessionData: SessionData | null;
}

const LiveStrengthPreview: React.FC<LiveStrengthPreviewProps> = React.memo(({ selectedTools, sessionData }) => {
  if (!sessionData || selectedTools.length === 0) return null;
  
  // Get tools from categories structure
  const allTools = sessionData.categories.flatMap((cat: Category) => cat.tools || []);
  
  // Create pointMap with tools from categories for scoring
  const pointMapWithTools = {
    ...sessionData.pointMap,
    tools: allTools
  };
  
  // V3 Scoring System only
  const scoringResult = calculateV3Score(selectedTools, pointMapWithTools, sessionData.selectedArchetype);
  
  return (
    <div className="mb-4 space-y-4">
      {/* V3 Model Features Display */}
      <ModelFeatureDisplay
        features={scoringResult.featureBreakdown}
        featureCaps={sessionData.pointMap.feature_caps}
        penalties={scoringResult.penaltyBreakdown}
      />
      
      {/* V3 Build Preview */}
      <div className="p-4 bg-panel-dark border border-border-dark rounded-xl">
        <h4 className="text-sm font-semibold text-white mb-3">Build Preview</h4>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Final Strength:</span>
            <span className="text-lg font-bold text-primary">{scoringResult.finalStrength.toFixed(1)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Selected Tools:</span>
            <span className="text-sm font-medium text-white">{selectedTools.length}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Total Cost:</span>
            <span className="text-sm font-medium text-amber-400">
              {selectedTools.reduce((sum, toolSlug) => {
                const tool = allTools.find((t: Tool) => t.slug === toolSlug);
                return sum + (tool?.prompt_cost || tool?.promptCost || 0);
              }, 0)} prompts
            </span>
          </div>
        </div>
        
        {/* Formula Display */}
        {scoringResult.operationResult && (
          <div className="mt-3 pt-3 border-t border-border-dark">
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <span className="material-symbols-outlined text-sm">calculate</span>
              <span className="text-xs font-medium">Formula:</span>
            </div>
            <div className="text-xs text-purple-300 font-mono bg-surface-dark/50 p-2 rounded">
              {scoringResult.operationResult.formula}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Result: {scoringResult.operationResult.calculatedValue.toFixed(2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// Strategic Tool Card Component
interface ToolCardProps {
  tool: Tool;
  isSelected: boolean;
  onSelect: (toolSlug: string) => void;
  hasOperationSynergy?: boolean;
  isAnimating?: boolean;
  isSuggested?: boolean;
  strengthImpact?: number;
  expandedDescriptions: Set<string>;
  onToggleDescription: (toolSlug: string) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ 
  tool, 
  isSelected, 
  onSelect, 
  hasOperationSynergy = false, 
  isAnimating = false, 
  isSuggested = false, 
  strengthImpact = 0,
  expandedDescriptions,
  onToggleDescription
}) => {
  const getOperationLabel = (operationType?: string) => {
    if (!operationType) return 'Unknown';
    
    switch (operationType) {
      case 'add': return 'Amplify';
      case 'subtract': return 'Compress';
      case 'multiply': return 'Boost';
      case 'divide': return 'Distribute';
      case 'power': return 'Elevate';
      case 'modulus': return 'Balance';
      default: return 'Unknown';
    }
  };

  const getImpactColor = (impact: number) => {
    if (impact > 5) return 'text-green-400';
    if (impact > 0) return 'text-amber-400';
    return 'text-gray-400';
  };

  const getImpactText = (impact: number) => {
    if (impact > 5) return `+${impact.toFixed(1)} Strong!`;
    if (impact > 0) return `+${impact.toFixed(1)}`;
    return '+0.0';
  };

  return (
    <div
      onClick={() => onSelect(tool.slug)}
      className={`
        relative group cursor-pointer transition-all duration-300 transform
        ${isSelected 
          ? 'scale-105' 
          : 'hover:scale-102 hover:-translate-y-1'
        }
      `}
    >
      {/* Card Background */}
      <div className={`
        relative overflow-hidden rounded-xl border-2
        ${isSelected 
          ? 'border-amber-500 shadow-2xl shadow-amber-900/40 bg-amber-950/20' 
          : 'border-gray-700 shadow-lg hover:border-amber-600/50 hover:shadow-xl bg-panel-dark'
        }
        ${hasOperationSynergy ? 'ring-2 ring-purple-500/30' : ''}
        ${isSuggested && !isSelected ? 'ring-2 ring-blue-500/30' : ''}
      `}>
        {/* Gaming Pattern Overlay using app colors */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(251, 191, 36, 0.1) 10px, rgba(251, 191, 36, 0.1) 20px)`
          }}></div>
        </div>
        
        {/* Card Content */}
        <div className="relative p-4">
          {/* Header Section */}
          <div className="flex items-start gap-3 mb-3">
            {/* Prompt Cost Avatar - Gaming Style */}
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm
              border-2 shrink-0 relative
              ${isSelected 
                ? 'bg-amber-500 border-amber-400 text-white shadow-lg shadow-amber-500/50' 
                : 'bg-amber-500/20 border-amber-500/50 text-amber-400'
              }
            `}>
              {/* Inner glow effect using amber */}
              {isSelected && (
                <div className="absolute inset-0 bg-amber-400/20 rounded-full animate-pulse"></div>
              )}
              <span className="relative z-10">{tool.promptCost}</span>
            </div>
            
            {/* Tool Info */}
            <div className="flex-1 min-w-0">
              {/* Suggestion Badge - Gaming Style */}
              {isSuggested && !isSelected && (
                <div className="inline-flex items-center gap-1 bg-blue-500/20 border border-blue-500/50 rounded-full px-2 py-0.5 mb-2">
                  <span className="material-symbols-outlined text-xs text-blue-400">auto_awesome</span>
                  <span className="text-blue-400 text-xs font-medium">Suggested</span>
                </div>
              )}
              
              {/* Tool Description */}
              <div className="relative">
                <p className={`text-xs text-gray-300 leading-relaxed transition-all duration-200 ${
                  expandedDescriptions.has(tool.slug) ? '' : 'line-clamp-2'
                }`}>
                  {tool.description}
                </p>
                
                {/* Expand/Collapse Button */}
                {tool.description && tool.description.length > 100 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleDescription(tool.slug);
                    }}
                    className="mt-1 text-xs text-primary hover:text-primary/80 transition-colors duration-200 flex items-center gap-1"
                  >
                    <span>{expandedDescriptions.has(tool.slug) ? 'Show less' : 'Show more'}</span>
                    <span className={`material-symbols-outlined text-xs transition-transform duration-200 ${
                      expandedDescriptions.has(tool.slug) ? 'rotate-180' : ''
                    }`}>
                      expand_more
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Power Section - Gaming Style */}
          {!isSelected && (
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary">bolt</span>
                  {/* <span className="text-xs font-medium text-gray-300">Power:</span> */}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-primary uppercase tracking-wide">
                    {getOperationLabel(tool.operation?.type)}
                  </span>
                  {/* Power indicator dots */}
                  <div className="flex gap-1">
                    {[1, 2, 3].map((level) => (
                      <div 
                        key={level}
                        className={`w-1.5 h-1.5 rounded-full ${
                          tool.operation?.strength >= level * 3 
                            ? 'bg-amber-500' 
                            : 'bg-gray-600'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Selection State - Gaming Style */}
          {isSelected && (
            <div className="mt-3 bg-amber-500/20 rounded-lg p-2 border border-amber-500/30">
              <div className="flex items-center justify-center gap-2 text-amber-400">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span className="text-xs font-bold uppercase tracking-wide">Selected</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Gaming Effects */}
        {hasOperationSynergy && !isSelected && (
          <div className="absolute top-2 right-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse shadow-lg shadow-purple-500/50"></div>
          </div>
        )}
        
        {/* Hover Glow Effect using amber */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

// Unified Metrics Container Component
interface UnifiedMetricsProps {
  selectedTools: string[];
  sessionData: SessionData | null;
  areMetricsCollapsed: boolean;
  onToggleMetrics: () => void;
  challenge: Challenge | null;
  remainingPrompts: number;
  totalPromptCost: number;
}

const UnifiedMetrics: React.FC<UnifiedMetricsProps> = ({ 
  selectedTools, 
  sessionData, 
  areMetricsCollapsed, 
  onToggleMetrics,
  challenge,
  remainingPrompts,
  totalPromptCost
}) => {
  const getCurrentBuildStrength = () => {
    if (!sessionData || selectedTools.length === 0) return 0;
    
    const scoringResult = ScoringService.calculateV3Score(
      selectedTools, 
      sessionData.pointMap, 
      sessionData.selectedArchetype
    );
    
    return scoringResult.finalStrength;
  };

  const currentStrength = getCurrentBuildStrength();
  const scoringResult = selectedTools.length > 0 ? ScoringService.calculateV3Score(selectedTools, sessionData?.pointMap || {
    focus_display: { robustness: 0, accuracy: 0, stability: 0, creativity: 0, efficiency: 0 },
    expectations: { robustness: 0, accuracy: 0, stability: 0, creativity: 0, efficiency: 0 },
    penalties: { hallucination_risk: 0, over_creativity: 0, latency_overflow: 0 },
    feature_caps: { creativity: 100, efficiency: 100 },
    difficulty_curve: { k: 1, t: 1 }
  } as PointMap, sessionData?.selectedArchetype) : null;

  return (
    <div className="bg-panel-dark border border-border-dark rounded-xl">
      {/* Header with key metrics */}
      <div 
        className="p-4 cursor-pointer flex items-center justify-between"
        onClick={onToggleMetrics}
      >
        <div className="flex items-center gap-4">
          {/* Build Strength */}
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{currentStrength.toFixed(1)}</div>
            <div className="text-xs text-gray-400">Build Strength</div>
          </div>
          
          {/* Key Features */}
          {scoringResult && (
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">
                  {scoringResult.featureBreakdown.robustness.toFixed(0)}%
                </div>
                <div className="text-xs text-gray-400">Robustness</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">
                  {scoringResult.featureBreakdown.accuracy.toFixed(0)}%
                </div>
                <div className="text-xs text-gray-400">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-400">
                  {scoringResult.featureBreakdown.creativity.toFixed(0)}%
                </div>
                <div className="text-xs text-gray-400">Creativity</div>
              </div>
            </div>
          )}
          
          {/* Total Cost */}
          <div className="text-center">
            <div className={`text-lg font-bold ${
              totalPromptCost > remainingPrompts ? 'text-red-400' : 'text-amber-400'
            }`}>
              {totalPromptCost}
            </div>
            <div className="text-xs text-gray-400">Total Cost</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">See all</span>
          <span className={`material-symbols-outlined text-gray-400 transition-transform duration-200 ${
            areMetricsCollapsed ? '' : 'rotate-180'
          }`}>
            expand_more
          </span>
        </div>
      </div>
      
      {/* Collapsible Content */}
      {!areMetricsCollapsed && (
        <div className="border-t border-border-dark">
          <div className="p-4 space-y-4">
            {/* Strategy Section */}
            <div>
              <div 
                className="flex items-center justify-between mb-3 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  // Toggle strategy collapsed state
                }}
              >
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">strategy</span>
                  Strategy Guide
                </h4>
              </div>
              
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-surface-dark/50 border border-border-dark">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-sm text-amber-400 mt-0.5">lightbulb</span>
                    <div>
                      <h5 className="text-sm font-medium text-white mb-1">How to Earn Strength Points</h5>
                      <ul className="text-xs text-gray-300 space-y-1">
                        <li>• Look for tools with high strength meters (8-10)</li>
                        <li>• Combine tools with complementary operations (add→multiply→divide)</li>
                        <li>• Try "Suggested" tools (blue highlight) for operation combos</li>
                        <li>• Build complex BODMAS formulas for higher scores</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            {sessionData?.sessionTips && sessionData.sessionTips.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs text-primary">psychology</span>
                  AI-Generated Tips
                </h4>
                <div className="space-y-2">
                  {sessionData.sessionTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 p-2 rounded-lg bg-surface-dark/30 border border-border-dark">
                      <span className={`material-symbols-outlined text-sm ${tip.color} mt-0.5`}>
                        {tip.icon}
                      </span>
                      <p className="text-xs text-gray-300 leading-relaxed">{tip.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Full Model Features */}
            {scoringResult && (
              <ModelFeatureDisplay
                features={scoringResult.featureBreakdown}
                featureCaps={sessionData?.pointMap?.feature_caps || { creativity: 100, efficiency: 100 }}
                penalties={scoringResult.penaltyBreakdown}
              />
            )}

            {/* Minimum Build Power Warning */}
            {challenge?.minimumBuildPower && challenge.minimumBuildPower > 0 && (
              <div className={`p-3 rounded-lg border ${
                currentStrength >= challenge.minimumBuildPower 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <div className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-sm ${
                    currentStrength >= challenge.minimumBuildPower ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {currentStrength >= challenge.minimumBuildPower ? 'check_circle' : 'warning'}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">
                      Minimum Build Power: {challenge.minimumBuildPower.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-400">
                      Current: {currentStrength.toFixed(1)} / Required: {challenge.minimumBuildPower.toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// V3 Scoring Engine - Using Service
const calculateV3Score = (
  selectedTools: string[],
  pointMap: PointMap,
  selectedArchetype?: Archetype
): ScoringResult => {
  return ScoringService.calculateV3Score(selectedTools, pointMap, selectedArchetype);
};

// V2 Feature Interfaces
interface PlatformMetadata {
  title: string;
  description: string;
  goal: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface AIGeneratedData {
  focus_display: {
    robustness: number;
    accuracy: number;
    stability: number;
    creativity: number;
    efficiency: number;
  };
  expectations: {
    robustness: number;
    accuracy: number;
    stability: number;
    creativity: number;
    efficiency: number;
  };
  penalties: {
    hallucination_risk: number;
    over_creativity: number;
    latency_overflow: number;
  };
  feature_caps: {
    creativity: number;
    efficiency: number;
  };
  difficulty_curve: {
    k: number;
    t: number;
  };
  tools: Array<{
    slug: string;
    category: string;
    prompt_cost: number;
    features: {
      robustness?: number;
      accuracy?: number;
      stability?: number;
      creativity?: number;
      efficiency?: number;
      hallucination_risk?: number;
    };
  }>;
  synergy_rules: Array<{
    pair: [string, string];
    effect: {
      robustness?: number;
      accuracy?: number;
      stability?: number;
      creativity?: number;
      efficiency?: number;
      hallucination_risk?: number;
    };
  }>;
  order_rules: Array<{
    sequence: [string, string];
    effect: {
      robustness?: number;
      accuracy?: number;
      stability?: number;
      creativity?: number;
      efficiency?: number;
      hallucination_risk?: number;
    };
  }>;
}


interface ModelFeatureDisplay {
  feature: string;
  value: number;
  max_value: number;
  percentage: string;
}


interface Category {
  slug: string;
  title: string;
  tools: Tool[];
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  goal?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  version: number;
  isActive: boolean;
  isFeatured: boolean;
  week: string | null;
  rewardZoneType: string;
  rewardZoneValue: number;
  totalPrizePool: number | null;
  minimumBuildPower?: number;
}

interface SessionData {
  sessionId: string;
  categories: Category[];
  pointMap: PointMap;
  selectedArchetype?: Archetype;
  sessionTips?: Array<{
    icon: string;
    text: string;
    color: string;
  }>;
}

interface BuildResponse {
  strength: number;
  newTotalStrength: number;
  remainingPrompts: number;
  // V2 response structure
  v2ScoringResult?: {
    finalStrength: number;
    featureBreakdown: {
      robustness: number;
      accuracy: number;
      stability: number;
      creativity: number;
      efficiency: number;
    };
    penaltyBreakdown: {
      hallucination_risk: number;
      over_creativity: number;
      latency_overflow: number;
    };
    appliedSynergies: Array<{
      tools: [string, string];
      effects: any;
    }>;
    appliedOrderEffects: Array<{
      sequence: [string, string];
      effects: any;
    }>;
  };
}

export default function ChallengePage() {
  const params = useParams();
  const challengeId = params.id as string;
  const { user, loading: authLoading } = useAuth();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [userModel, setUserModel] = useState<any>(null);
  const [hasModel, setHasModel] = useState(false);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [buildResult, setBuildResult] = useState<BuildResponse | null>(null);
  const [remainingPrompts, setRemainingPrompts] = useState(0);
  const [totalStrength, setTotalStrength] = useState(0);
  const [modelGrowth, setModelGrowth] = useState<any>(null);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [userPrize, setUserPrize] = useState(0);
  const [rankData, setRankData] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [buildSuccessData, setBuildSuccessData] = useState<any>(null);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [isModelCreationOpen, setIsModelCreationOpen] = useState(false);
  const [animatingTools, setAnimatingTools] = useState<Set<string>>(new Set());
  const [selectedArchetype, setSelectedArchetype] = useState<Archetype | null>(null);
  const [areTipsCollapsed, setAreTipsCollapsed] = useState(true);
  const [areStrategyCollapsed, setAreStrategyCollapsed] = useState(true);
  const [areMetricsCollapsed, setAreMetricsCollapsed] = useState(true);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());

  // Update total prompt cost whenever selected tools change
  useEffect(() => {
    // Force re-render when tools change
  }, [selectedTools, sessionData]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = "/login";
    }
  }, [user, authLoading]);

  // Load challenge data
  useEffect(() => {
    const loadChallenge = async () => {
      try {
        // Fetch user's current prompt count
        const userResponse = await fetch(`/api/user/stats?userId=${user!.id}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setRemainingPrompts(userData.totalPrompts || 0);
        }

        // Fetch challenge data
        const challengeResponse = await fetch(`/api/challenge/${challengeId}`);
        if (challengeResponse.ok) {
          const challengeData = await challengeResponse.json();
          if (challengeData.success) {
            setChallenge(challengeData.challenge);
          }
        }

        // Check if user has a model for this challenge
        const modelResponse = await fetch(`/api/challenge/${challengeId}/model?userId=${user!.id}`);
        if (modelResponse.ok) {
          const modelData = await modelResponse.json();
          if (modelData.success) {
            setHasModel(modelData.hasModel);
            setUserModel(modelData.model);
          }
        }

        // Fetch user's current total strength for this challenge
        const buildResponse = await fetch(`/api/challenge/${challengeId}/builds?userId=${user!.id}`);
        if (buildResponse.ok) {
          const buildData = await buildResponse.json();
          if (buildData.success) {
            setTotalStrength(buildData.totalStrength || 0);
          }
        }

        // Fetch user's rank and prize information
        const rankResponse = await fetch(`/api/challenge/${challengeId}/rank?userId=${user!.id}`);
        if (rankResponse.ok) {
          const rankData = await rankResponse.json();
          if (rankData.success) {
            setModelGrowth(rankData);
            setTotalParticipants(rankData.totalParticipants);
            setUserPrize(rankData.prize);
            setRankData(rankData);
          }
        }
      } catch (error) {
        console.error("Error loading challenge:", error);
      }
    };

    if (user && challengeId) {
      loadChallenge();
    }
  }, [challengeId, user]);

  const getOperationType = (toolSlug: string) => {
    if (!sessionData || !sessionData.pointMap) return null;
    
    const tool = sessionData.pointMap.tools?.find(t => t.slug === toolSlug);
    return tool?.operation?.type || null;
  };

  // Get suggested tools based on operation types
  const getSuggestedTools = () => {
    if (!sessionData || !sessionData.pointMap) return [];
    
    const suggestions = new Set<string>();
    const currentOperations = selectedTools.map(getOperationType).filter(Boolean);
    
    // Suggest tools with complementary operations
    sessionData.pointMap.tools?.forEach(tool => {
      if (!tool.operation || selectedTools.includes(tool.slug)) return;
      
      const hasAdd = currentOperations.includes('add');
      const hasMultiply = currentOperations.includes('multiply');
      const hasDivide = currentOperations.includes('divide');
      
      // Suggest complementary operations
      if ((hasAdd && tool.operation.type === 'multiply') ||
          (hasMultiply && tool.operation.type === 'divide') ||
          (hasDivide && tool.operation.type === 'add')) {
        suggestions.add(tool.slug);
      }
    });
    
    return Array.from(suggestions);
  };

  // Get strength impact for a specific tool
  const getToolStrengthImpact = (toolSlug: string) => {
    if (!sessionData || !sessionData.pointMap) return 0;
    
    const currentScore = selectedTools.length > 0 
      ? ScoringService.calculateV3Score(selectedTools, sessionData.pointMap, sessionData.selectedArchetype).finalStrength 
      : 0;
    
    const newScore = ScoringService.calculateV3Score(
      [...selectedTools, toolSlug], 
      sessionData.pointMap, 
      sessionData.selectedArchetype
    ).finalStrength;
    
    return newScore - currentScore;
  };

  const handleToolToggle = (toolSlug: string) => {
    // Add animation effect
    setAnimatingTools(prev => new Set(prev).add(toolSlug));
    setTimeout(() => {
      setAnimatingTools(prev => {
        const newSet = new Set(prev);
        newSet.delete(toolSlug);
        return newSet;
      });
    }, 300);
    
    setSelectedTools(prev => {
      if (prev.includes(toolSlug)) {
        return prev.filter(slug => slug !== toolSlug);
      } else {
        return [...prev, toolSlug];
      }
    });
  };

  const handleCategorySelect = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
  };

  const handleModelCreated = (model: any) => {
    setUserModel(model);
    setHasModel(true);
  };

  const handleArchetypeSelect = (archetype: Archetype) => {
    setSelectedArchetype(archetype);
    // Update session data with selected archetype
    if (sessionData) {
      setSessionData(prev => prev ? { ...prev, selectedArchetype: archetype } : null);
    }
  };

  const toggleDescriptionExpansion = (toolSlug: string) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(toolSlug)) {
        newSet.delete(toolSlug);
      } else {
        newSet.add(toolSlug);
      }
      return newSet;
    });
  };

  const handleStartSession = async () => {
    if (!challenge || !user) return;

    setIsStartingSession(true);
    setSelectedTools([]);
    setBuildResult(null);
    setSessionData(null);

    try {
      const response = await fetch(`/api/challenge/${challengeId}/session/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to start session");
      }

      // Group tools by category
      const categoriesWithTools = data.categories.map((category: Category) => ({
        ...category,
        tools: data.tools.filter((tool: Tool) => tool.categorySlug === category.slug)
      }));

      setSessionData({
        sessionId: data.sessionId,
        categories: categoriesWithTools,
        pointMap: data.pointMap,
        sessionTips: data.sessionTips
      });
      
      // Expand first category by default
      if (categoriesWithTools.length > 0) {
        setSelectedCategory(categoriesWithTools[0].slug);
      }

    } catch (error) {
      console.error("Error starting session:", error);
      alert(`Error: ${error instanceof Error ? error.message : "Failed to start session"}`);
    } finally {
      setIsStartingSession(false);
    }
  };

  const calculateTotalPromptCost = () => {
    if (!sessionData) return 0;
    
    // Find tools from categories structure
    return selectedTools.reduce((sum, toolSlug) => {
      const tool = sessionData.categories
        .flatMap((cat: Category) => cat.tools || [])
        .find((t: Tool) => t.slug === toolSlug);
      return sum + (tool?.promptCost || 0);
    }, 0);
  };

  // Calculate current build strength for selected tools
  const getCurrentBuildStrength = () => {
    if (!sessionData || selectedTools.length === 0) return 0;
    
    const scoringResult = ScoringService.calculateV3Score(
      selectedTools, 
      sessionData.pointMap, 
      sessionData.selectedArchetype
    );
    
    return scoringResult.finalStrength;
  };

  // Check if build is allowed based on minimum build power
  const isBuildAllowed = () => {
    const currentStrength = getCurrentBuildStrength();
    const minimumRequired = challenge?.minimumBuildPower || 0;
    return currentStrength >= minimumRequired;
  };

  const handleBuild = async () => {
    if (!sessionData || !user) return;

    if (selectedTools.length === 0) {
      alert("Please select at least one tool to build.");
      return;
    }

    // Check minimum build power requirement
    if (!isBuildAllowed()) {
      const currentStrength = getCurrentBuildStrength();
      const minimumRequired = challenge?.minimumBuildPower || 0;
      alert(`Current build strength (${currentStrength.toFixed(1)}) is below the minimum required (${minimumRequired.toFixed(1)}). Select more tools to meet the requirement.`);
      return;
    }

    // Calculate total cost and check if user has enough prompts
    const totalCost = calculateTotalPromptCost();
    console.log('Build attempt:', { selectedTools, totalCost, remainingPrompts });
    
    if (totalCost > remainingPrompts) {
      alert(`You need ${totalCost} prompts but only have ${remainingPrompts}. Please top up to continue.`);
      setIsTopUpModalOpen(true);
      return;
    }

    setIsLoading(true);
    setBuildResult(null);

    // Deduct prompts immediately
    const currentPrompts = remainingPrompts;
    const newPrompts = currentPrompts - totalCost;
    console.log('About to deduct prompts:', { currentPrompts, totalCost, newPrompts });
    setRemainingPrompts(newPrompts);
    
    // Force a small delay to ensure state update
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log('After deduction:', remainingPrompts);

    try {
      const response = await fetch(`/api/challenge/${challengeId}/build`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          sessionId: sessionData.sessionId,
          selectedToolSlugs: selectedTools,
          selectedArchetype: sessionData.selectedArchetype || null,
        }),
      });

      const data: BuildResponse | { error: string } = await response.json();
      console.log('Build response:', data);

      if (!response.ok) {
        // Refund prompts if build failed
        setRemainingPrompts(prev => {
          console.log('Refunding prompts due to error');
          return prev + totalCost;
        });
        throw new Error((data as { error: string }).error || "Build failed");
      }

      const buildData = data as BuildResponse;
      console.log('Build successful:', { buildData });
      setBuildResult(buildData);
      setTotalStrength(buildData.newTotalStrength);
      
      // Only update remaining prompts if server response is different
      if (buildData.remainingPrompts !== undefined) {
        const expectedRemaining = remainingPrompts - totalCost;
        console.log('Prompt sync:', { 
          clientDeduction: expectedRemaining, 
          serverResponse: buildData.remainingPrompts,
          match: expectedRemaining === buildData.remainingPrompts 
        });
        setRemainingPrompts(buildData.remainingPrompts);
      }
      
      setSelectedTools([]); // Clear selection after successful build
      setSessionData(null); // Clear session after successful build
      
      // Show success modal/bottom sheet
      setBuildSuccessData({
        strength: buildData.strength,
        newTotalStrength: buildData.newTotalStrength,
        breakdown: buildData.v2ScoringResult || {
          finalStrength: buildData.strength,
          featureBreakdown: { robustness: 0, accuracy: 0, stability: 0, creativity: 0, efficiency: 0 },
          penaltyBreakdown: { hallucination_risk: 0, over_creativity: 0, latency_overflow: 0 },
          appliedSynergies: [],
          appliedOrderEffects: []
        }
      });
      setShowSuccessModal(true);
      
      // Refresh rank data after build
      const rankResponse = await fetch(`/api/challenge/${challengeId}/rank?userId=${user!.id}`);
      if (rankResponse.ok) {
        const rankData = await rankResponse.json();
        if (rankData.success) {
          setModelGrowth(rankData);
          setTotalParticipants(rankData.totalParticipants);
          setUserPrize(rankData.prize);
          setRankData(rankData);
        }
      }

    } catch (error) {
      console.error("Error building:", error);
      alert(`Error: ${error instanceof Error ? error.message : "Build failed"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!challenge) return;

    setIsRegenerating(true);
    setSelectedTools([]);
    setBuildResult(null);
    setSessionData(null);

    try {
      const response = await fetch(`/api/challenge/${challengeId}/regenerate`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Regeneration failed");
      }

      setChallenge(data.challenge);
      
    } catch (error) {
      console.error("Error regenerating:", error);
      alert(`Error: ${error instanceof Error ? error.message : "Regeneration failed"}`);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleTopUpComplete = (additionalPrompts: number) => {
    setRemainingPrompts(prev => prev + additionalPrompts);
  };


  const getOperationLabel = (operationType: string | null) => {
    switch (operationType) {
      case 'add': return 'Amplifier';
      case 'subtract': return 'Reducer';
      case 'multiply': return 'Multiplier';
      case 'divide': return 'Divider';
      case 'power': return 'Exponent';
      case 'modulus': return 'Balancer';
      default: return 'Unknown';
    }
  };

  const getTierInfo = (strength: number, rankData: any) => {
    // If we have rank data, use it for tier determination
    if (rankData && rankData.rank) {
      const percentile = rankData.percentile || 0;
      const rank = rankData.rank;
      const prize = rankData.prize || 0;
      
      let tier, icon, nextTier, nextTierMin, reward, progress;
      
      if (percentile >= 90) {
        tier = 'Elite';
        icon = '👑';
        nextTier = null;
        nextTierMin = null;
        reward = prize > 0 ? `$${prize} Prize` : 'Elite Rewards';
        progress = 100;
      } else if (percentile >= 70) {
        tier = 'Advanced';
        icon = '⚡';
        nextTier = 'Elite';
        nextTierMin = Math.ceil(totalParticipants * 0.1); // Top 10%
        reward = prize > 0 ? `$${prize} Prize` : 'Advanced Rewards';
        progress = ((percentile - 70) / 20) * 100;
      } else if (percentile >= 40) {
        tier = 'Skilled';
        icon = '⚡';
        nextTier = 'Advanced';
        nextTierMin = Math.ceil(totalParticipants * 0.3); // Top 30%
        reward = 'XP';
        progress = ((percentile - 40) / 30) * 100;
      } else {
        tier = 'Rookie';
        icon = '🌱';
        nextTier = 'Skilled';
        nextTierMin = Math.ceil(totalParticipants * 0.6); // Top 60%
        reward = 'XP only';
        progress = Math.min((percentile / 40) * 100, 100);
      }
      
      return {
        tier,
        icon,
        rank,
        nextTier,
        nextTierMin,
        reward,
        progress,
        percentile: Math.round(percentile),
        totalParticipants,
        prize
      };
    }
    
    // Fallback to strength-based system if no rank data
    if (strength <= 39) {
      return {
        tier: 'Rookie',
        icon: '🌱',
        rank: null,
        nextTier: 'Skilled',
        nextTierMin: 40,
        reward: 'XP only',
        progress: Math.min((strength / 40) * 100, 100),
        percentile: null,
        totalParticipants: 0,
        prize: 0
      };
    } else if (strength <= 69) {
      return {
        tier: 'Skilled',
        icon: '⚡',
        rank: null,
        nextTier: 'Advanced',
        nextTierMin: 70,
        reward: 'XP',
        progress: ((strength - 40) / 30) * 100,
        percentile: null,
        totalParticipants: 0,
        prize: 0
      };
    } else if (strength <= 89) {
      return {
        tier: 'Advanced',
        icon: '⚡',
        rank: null,
        nextTier: 'Elite',
        nextTierMin: 90,
        reward: 'XP + small bonus',
        progress: ((strength - 70) / 20) * 100,
        percentile: null,
        totalParticipants: 0,
        prize: 0
      };
    } else {
      return {
        tier: 'Elite',
        icon: '👑',
        rank: null,
        nextTier: null,
        nextTierMin: null,
        reward: 'XP + Cash/Coins',
        progress: 100,
        percentile: null,
        totalParticipants: 0,
        prize: 0
      };
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background-dark">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  if (!challenge) {
    return (
      <div className="flex items-center justify-center h-screen bg-background-dark">
        <div className="text-white">Loading challenge...</div>
      </div>
    );
  }

  const totalPromptCost = sessionData ? calculateTotalPromptCost() : 0;

  return (
    <div className="bg-background-dark font-display text-white overflow-hidden h-screen flex">
      {/* Left Sidebar - Tool Categories */}
      <aside className="w-64 bg-sidebar-dark border-r border-[#332a1e] flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-[#332a1e]">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">build</span>
            Tool Arsenal
          </h2>
        </div>
        
        {/* Category Tabs */}
        {sessionData && (
          <div className="flex-1 overflow-y-auto">
            {/* Suggested Tools Summary */}
            {selectedTools.length > 0 && (() => {
              const suggestedTools = getSuggestedTools();
              if (suggestedTools.length === 0) return null;
              
              return (
                <div className="p-3 border-b border-[#332a1e]">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-sm text-blue-400">lightbulb</span>
                      <span className="text-xs font-medium text-blue-400">
                        {suggestedTools.length} Suggested Tool{suggestedTools.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="text-xs text-gray-300">
                      Look for blue highlighted tools for synergy bonuses
                    </div>
                  </div>
                </div>
              );
            })()}
            
            <div className="p-2 space-y-1">
              {sessionData.categories.map((category: Category) => {
                const categoryTools = category.tools || [];
                const suggestedCount = categoryTools.filter((tool: Tool) => 
                  getSuggestedTools().includes(tool.slug)
                ).length;
                
                return (
                  <button
                    key={category.slug}
                    onClick={() => handleCategorySelect(category.slug)}
                    className={`w-full text-left p-3 rounded-lg transition-colors relative ${
                      selectedCategory === category.slug
                        ? 'bg-primary/20 text-white border border-primary/50'
                        : 'hover:bg-surface-dark/80 text-gray-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">
                          {selectedCategory === category.slug ? 'folder_open' : 'folder'}
                        </span>
                        <span className="font-medium text-sm">{category.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {suggestedCount > 0 && (
                          <div className="bg-blue-500/20 border border-blue-500/50 rounded-full px-2 py-0.5">
                            <span className="text-blue-400 text-xs font-medium">
                              {suggestedCount}
                            </span>
                          </div>
                        )}
                        <span className="text-xs bg-surface-dark px-2 py-1 rounded-full">
                          {categoryTools.length}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Model Info at Bottom of Sidebar */}
        {userModel && (
          <div className="p-4 border-t border-[#332a1e]">
            <div className="bg-panel-dark rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-sm">
                    {userModel.image || "smart_toy"}
                  </span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate">{userModel.title}</h4>
                  <p className="text-xs text-gray-400">Your AI Model</p>
                </div>
              </div>
              {totalStrength > 0 && (
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{totalStrength}</div>
                  <p className="text-xs text-gray-400">Strength</p>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full bg-background-dark">
        {/* Header */}
        <header className="h-16 border-b border-[#332a1e] flex items-center justify-between px-6 bg-sidebar-dark/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-surface-dark/80 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-white">arrow_back</span>
            </button>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {challenge.title}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-primary font-mono text-lg font-bold">
              <span className="material-symbols-outlined">psychology</span>
              <span>{remainingPrompts} prompts</span>
              {totalPromptCost > 0 && (
                <span className="text-xs text-gray-400 ml-1">
                  (-{totalPromptCost})
                </span>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          {/* Challenge Content */}
          <div className="h-full overflow-y-auto p-6">
            {/* Challenge Overview */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Mission Briefing</h2>
              
              {/* Challenge Metadata */}
              {challenge.goal && challenge.difficulty && (
                <div className="mb-4 p-4 bg-panel-dark border border-border-dark rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 mb-1">Objective</h3>
                      <p className="text-white text-sm">{challenge.goal}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 mb-1">Threat Level</h3>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          challenge.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                          challenge.difficulty === 'Intermediate' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' :
                          'bg-red-500/20 text-red-400 border border-red-500/50'
                        }`}>
                          {challenge.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <p className="text-gray-300 leading-relaxed">
                {challenge.description}
              </p>
            </div>

            {/* Game State Display */}
            {!hasModel ? (
              <div className="text-center py-12">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-surface-dark border-2 border-dashed border-[#332a1e] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-3xl text-gray-400">add</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Deploy Your AI Model</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    Before entering the battlefield, create a personalized AI model for this challenge.
                    Give it a name and choose an avatar to begin your mission.
                  </p>
                </div>
                <button
                  onClick={() => setIsModelCreationOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-black px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  Create AI Model
                </button>
              </div>
            ) : !sessionData ? (
              <div className="text-center py-12">
                <div className="mb-6">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-xl">
                        {userModel.image || "smart_toy"}
                      </span>
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-semibold text-white">{userModel.title}</h3>
                      <p className="text-sm text-gray-400">Ready for Deployment</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleStartSession}
                  disabled={isStartingSession}
                  className="bg-primary hover:bg-primary/90 text-black px-8 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isStartingSession ? "Initializing..." : "Start Mission"}
                </button>
                <p className="text-gray-400 mt-4">
                  Begin a new operation to generate tools and strategies for this challenge.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Unified Metrics Container */}
                <UnifiedMetrics
                  selectedTools={selectedTools}
                  sessionData={sessionData}
                  areMetricsCollapsed={areMetricsCollapsed}
                  onToggleMetrics={() => setAreMetricsCollapsed(!areMetricsCollapsed)}
                  challenge={challenge}
                  remainingPrompts={remainingPrompts}
                  totalPromptCost={totalPromptCost}
                />

                {/* Selected Tools Display */}
                {selectedTools.length > 0 && (
                  <div className="bg-panel-dark border border-border-dark rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Selected Loadout</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedTools.map((toolSlug) => {
                        const tool = sessionData.categories
                          .flatMap((cat: Category) => cat.tools || [])
                          .find((t: Tool) => t.slug === toolSlug);
                        return tool ? (
                          <div key={toolSlug} className="bg-primary/20 border border-primary/50 px-3 py-1 rounded-full text-sm text-white flex items-center gap-1">
                            {tool.title}
                            <span className="text-xs bg-primary/30 px-1 rounded">{tool.promptCost}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Total Cost:</span>
                      <span className="text-primary font-medium">{totalPromptCost} prompts</span>
                    </div>
                  </div>
                )}

                {/* Tools Grid */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Available Tools</h3>
                  {selectedCategory && sessionData.categories
                    .filter((category: Category) => category.slug === selectedCategory)
                    .map((category: Category) => (
                      <div key={category.slug} className="mb-6">
                        <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary">folder_open</span>
                          {category.title}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {category.tools?.map((tool: Tool, index: number) => {
                            const hasOperationSynergy = selectedTools.length > 0 && 
                              selectedTools.some(selectedTool => {
                                const selectedOp = getOperationType(selectedTool);
                                const currentOp = getOperationType(tool.slug);
                                return !selectedOp || !currentOp ? false : 
                                  ((selectedOp === 'add' && currentOp === 'multiply') ||
                                   (selectedOp === 'multiply' && currentOp === 'divide') ||
                                   (selectedOp === 'divide' && currentOp === 'add'));
                              });
                            
                            return (
                              <ToolCard
                                key={`${tool.slug}-${index}`}
                                tool={tool}
                                isSelected={selectedTools.includes(tool.slug)}
                                onSelect={handleToolToggle}
                                hasOperationSynergy={hasOperationSynergy}
                                isAnimating={animatingTools.has(tool.slug)}
                                isSuggested={getSuggestedTools().includes(tool.slug)}
                                strengthImpact={getToolStrengthImpact(tool.slug)}
                                expandedDescriptions={expandedDescriptions}
                                onToggleDescription={toggleDescriptionExpansion}
                              />
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  
                  {!selectedCategory && (
                    <div className="text-center py-8 text-gray-400">
                      <span className="material-symbols-outlined text-4xl mb-2">build</span>
                      <p>Select a category from the sidebar to view available tools</p>
                    </div>
                  )}
                </div>

                {/* Build Action */}
                {selectedTools.length > 0 && (
                  <div className="sticky bottom-6 bg-panel-dark border border-border-dark rounded-lg p-4">
                    <div className="mb-3">
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-gray-400">Total Cost:</span>
                        <span className={`font-medium ${
                          totalPromptCost > remainingPrompts ? 'text-red-400' : 'text-primary'
                        }`}>
                          {totalPromptCost} prompts
                        </span>
                      </div>
                      {totalPromptCost > remainingPrompts && (
                        <div className="text-xs text-red-400 mb-2">
                          Insufficient prompts! You need {totalPromptCost - remainingPrompts} more.
                        </div>
                      )}
                      {!isBuildAllowed() && (
                        <div className="text-xs text-red-400 mb-2">
                          Build strength too low! Minimum required: {challenge?.minimumBuildPower || 0}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleBuild}
                      disabled={isLoading || totalPromptCost > remainingPrompts || !isBuildAllowed()}
                      className="w-full bg-primary hover:bg-primary/90 text-black py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? "Building..." : 
                       totalPromptCost > remainingPrompts ? "Insufficient Prompts" : 
                       !isBuildAllowed() ? `Minimum Strength: ${challenge?.minimumBuildPower || 0}` : "Build Model"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Right Sidebar - Model Details & Accumulated Data Only */}
      <aside className="w-80 bg-sidebar-dark border-l border-[#332a1e] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {/* Model Details Section */}
          {userModel && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">smart_toy</span>
                Model Details
              </h3>
              <div className="bg-panel-dark border border-border-dark rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-lg">
                      {userModel.image || "smart_toy"}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-base font-semibold text-white truncate">{userModel.title}</h4>
                    <p className="text-sm text-gray-400">Your AI Model</p>
                  </div>
                </div>
                {totalStrength > 0 && (
                  <div className="text-center p-3 bg-surface-dark/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{totalStrength}</div>
                    <p className="text-xs text-gray-400">Total Strength</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cumulative Model Features - From Database */}
          {totalStrength > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">insights</span>
                Cumulative Model Features
              </h3>
              <div className="bg-panel-dark border border-border-dark rounded-xl p-4">
                <div className="space-y-3">
                  {(() => {
                    // Calculate cumulative features based on total strength
                    // This will be updated to read from database after build
                    const strengthRatio = Math.min(totalStrength / 100, 1);
                    
                    const cumulativeFeatures = {
                      robustness: Math.min(100, Math.round(strengthRatio * 85)),
                      accuracy: Math.min(100, Math.round(strengthRatio * 80)),
                      stability: Math.min(100, Math.round(strengthRatio * 75)),
                      creativity: Math.min(100, Math.round(strengthRatio * 70)),
                      efficiency: Math.min(100, Math.round(strengthRatio * 90))
                    };
                    
                    return (
                      <>
                        {Object.entries(cumulativeFeatures).map(([feature, value]) => {
                          const percentage = Math.round((value / 100) * 100);
                          const getColor = (feat: string) => {
                            switch(feat) {
                              case 'robustness': return 'bg-blue-500';
                              case 'accuracy': return 'bg-green-500';
                              case 'stability': return 'bg-purple-500';
                              case 'creativity': return 'bg-pink-500';
                              case 'efficiency': return 'bg-amber-500';
                              default: return 'bg-gray-500';
                            }
                          };
                          
                          const getIcon = (feat: string) => {
                            switch(feat) {
                              case 'robustness': return 'shield';
                              case 'accuracy': return 'target';
                              case 'stability': return 'balance';
                              case 'creativity': return 'palette';
                              case 'efficiency': return 'speed';
                              default: return 'analytics';
                            }
                          };
                          
                          return (
                            <div key={feature} className="space-y-1">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <span className="material-symbols-outlined text-xs text-gray-400">
                                    {getIcon(feature)}
                                  </span>
                                  <span className="text-xs text-gray-300 capitalize">{feature}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-white">
                                    {value}/100
                                  </span>
                                  <span className={`text-xs font-medium ${
                                    percentage >= 80 ? 'text-green-400' : 
                                    percentage >= 50 ? 'text-amber-400' : 'text-red-400'
                                  }`}>
                                    {percentage}%
                                  </span>
                                </div>
                              </div>
                              
                              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${getColor(feature)}`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                        
                        <div className="pt-3 border-t border-border-dark">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">Overall Performance:</span>
                            <span className="text-sm font-bold text-primary">
                              {totalStrength.toFixed(1)} Strength
                            </span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* Accumulated Data Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">analytics</span>
              Accumulated Data
            </h3>
            
            {/* Rank & Progress */}
            {rankData && (
              <div className="bg-panel-dark border border-border-dark rounded-lg p-4">
                <h4 className="text-sm font-semibold text-white mb-3">Mission Progress</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Rank:</span>
                    <span className="text-sm font-medium text-white">
                      {rankData.rank ? `#${rankData.rank}` : 'Not ranked'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Percentile:</span>
                    <span className="text-sm font-medium text-white">
                      {rankData.percentile ? `${Math.round(rankData.percentile)}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Participants:</span>
                    <span className="text-sm font-medium text-white">
                      {totalParticipants}
                    </span>
                  </div>
                  {rankData.prize > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Prize:</span>
                      <span className="text-sm font-medium text-amber-400">
                        ${rankData.prize}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tier Information */}
            {totalStrength > 0 && (
              <div className="bg-panel-dark border border-border-dark rounded-lg p-4">
                <h4 className="text-sm font-semibold text-white mb-3">Tier Status</h4>
                {(() => {
                  const tierInfo = getTierInfo(totalStrength, rankData);
                  return (
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">{tierInfo.icon}</div>
                        <div className="text-lg font-semibold text-white">{tierInfo.tier}</div>
                        <div className="text-xs text-gray-400">Current Tier</div>
                      </div>
                      {tierInfo.nextTier && (
                        <div className="pt-3 border-t border-border-dark">
                          <div className="flex justify-between items-center text-xs mb-2">
                            <span className="text-gray-400">Progress to {tierInfo.nextTier}:</span>
                            <span className="text-white">{Math.round(tierInfo.progress)}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${tierInfo.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Instructions */}
            <div className="bg-panel-dark border border-border-dark rounded-lg p-4">
              <h4 className="text-sm font-semibold text-white mb-2">Mission Briefing:</h4>
              <ul className="space-y-1 text-xs text-gray-400">
                <li>• Select tools from different categories</li>
                <li>• Look for synergy bonuses between tools</li>
                <li>• Build your model to earn strength</li>
                <li>• Start new sessions for fresh tools</li>
              </ul>
            </div>
          </div>
        </div>
      </aside>

      {/* Top Up Modal */}
      {isTopUpModalOpen && (
        <TopUpModal
          isOpen={isTopUpModalOpen}
          onClose={() => setIsTopUpModalOpen(false)}
          onTopUpComplete={handleTopUpComplete}
        />
      )}

      {/* Model Creation Modal */}
      {challenge && user && (
        <ModelCreationModal
          isOpen={isModelCreationOpen}
          onClose={() => setIsModelCreationOpen(false)}
          onModelCreated={handleModelCreated}
          challengeTitle={challenge.title}
          userId={user.id}
        />
      )}

      {/* Success Modal */}
      {showSuccessModal && buildSuccessData && (
        <Modal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="Build Successful!"
        >
          <div className="space-y-6">
            {/* Desktop View */}
            <div className="hidden lg:block space-y-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-20 h-20 bg-linear-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30">
                    <span className="material-symbols-outlined text-4xl text-white">check_circle</span>
                  </div>
                </div>
                <div className="text-6xl font-bold text-primary mb-2">
                  +{buildSuccessData.strength}
                </div>
                <p className="text-gray-400 text-lg">Strength Added</p>
              </div>
              
              {/* Tier Achievement */}
              {(() => {
                const newTotal = buildSuccessData.newTotalStrength;
                const tierInfo = newTotal >= 90 ? { tier: 'S', label: 'Elite', color: 'text-purple-400' } :
                                 newTotal >= 70 ? { tier: 'A', label: 'Advanced', color: 'text-amber-400' } :
                                 newTotal >= 40 ? { tier: 'B', label: 'Skilled', color: 'text-blue-400' } :
                                 { tier: 'C', label: 'Rookie', color: 'text-gray-400' };
                
                return (
                  <div className="text-center p-4 bg-panel-dark rounded-xl border border-border-dark">
                    <div className={`text-3xl font-bold ${tierInfo.color} mb-1`}>Tier {tierInfo.tier}</div>
                    <div className="text-sm text-gray-400">{tierInfo.label}</div>
                  </div>
                );
              })()}
              
              <div className="bg-surface-dark/50 border border-border-dark rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Previous Total:</span>
                    <span className="text-white font-medium">
                      {buildSuccessData.newTotalStrength - buildSuccessData.strength}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Added:</span>
                    <span className="text-primary font-bold text-lg">+{buildSuccessData.strength}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-border-dark">
                    <span className="text-gray-400">New Total:</span>
                    <span className="text-white font-bold text-xl text-primary">{buildSuccessData.newTotalStrength}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-primary hover:bg-primary/90 text-black py-3 rounded-lg font-semibold transition-all"
              >
                Continue Building
              </button>
            </div>
            
            {/* Mobile View */}
            <div className="lg:hidden space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-linear-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <span className="material-symbols-outlined text-3xl text-white">check_circle</span>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">+{buildSuccessData.strength}</div>
                    <p className="text-sm text-gray-400">Strength Added</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{buildSuccessData.newTotalStrength}</div>
                  <p className="text-sm text-gray-400">Total Strength</p>
                </div>
              </div>
              
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-primary hover:bg-primary/90 text-black py-2.5 rounded-lg font-semibold transition-all"
              >
                Continue Building
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
