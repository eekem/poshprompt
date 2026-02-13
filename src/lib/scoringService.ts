// V3 Scoring Service for Challenge System
// Based on mathematical operations (BODMAS) and strength meters

export interface Tool {
  slug: string;
  title: string;
  description: string;
  icon: string;
  categorySlug: string;
  promptCost: number;
  prompt_cost?: number; // For API compatibility
  category?: string; // For API compatibility
  // New mathematical operation system
  operation: {
    type: 'add' | 'subtract' | 'multiply' | 'divide' | 'power' | 'modulus';
    value: number; // Hidden value used for calculation
    strength: number; // Visible strength meter (1-10)
  };
  // Legacy features for compatibility (will be calculated from operations)
  features?: {
    robustness?: number;
    accuracy?: number;
    stability?: number;
    creativity?: number;
    efficiency?: number;
    hallucination_risk?: number;
  };
}

export interface PointMap {
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
  tools?: Tool[];
  archetypes?: Array<{
    type: 'Guardian' | 'SpeedRunner' | 'Creator';
    meta_shift: string;
    expectations: {
      robustness?: number;
      accuracy?: number;
      stability?: number;
      creativity?: number;
      efficiency?: number;
      adaptability?: number;
    };
  }>;
}

export interface Archetype {
  type: 'Guardian' | 'SpeedRunner' | 'Creator';
  meta_shift: string;
  expectations: {
    robustness?: number;
    accuracy?: number;
    stability?: number;
    creativity?: number;
    efficiency?: number;
    adaptability?: number;
  };
}

export interface ScoringResult {
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
  // Simplified operation result
  operationResult: {
    formula: string; // BODMAS formula from selected tools
    calculatedValue: number;
    toolOperations: Array<{
      toolSlug: string;
      operation: string;
      value: number;
      strength: number;
    }>;
  };
}

export class ScoringService {
  /**
   * Calculate V3 score based on mathematical operations (BODMAS)
   * Tools have hidden values and visible strength meters
   */
  static calculateV3Score(
    selectedTools: string[],
    pointMap: PointMap,
    selectedArchetype?: Archetype
  ): ScoringResult {
    // Step 1: Get tool operations and build formula
    const toolOperations: ScoringResult['operationResult']['toolOperations'] = [];
    let formula = '';
    
    selectedTools.forEach((toolSlug, index) => {
      const tool = pointMap.tools?.find(t => t.slug === toolSlug);
      if (tool && tool.operation) {
        toolOperations.push({
          toolSlug,
          operation: tool.operation.type,
          value: tool.operation.value,
          strength: tool.operation.strength
        });
        
        // Build BODMAS formula
        if (index === 0) {
          formula += tool.operation.value;
        } else {
          switch (tool.operation.type) {
            case 'add':
              formula += ` + ${tool.operation.value}`;
              break;
            case 'subtract':
              formula += ` - ${tool.operation.value}`;
              break;
            case 'multiply':
              formula += ` * ${tool.operation.value}`;
              break;
            case 'divide':
              formula += ` / ${tool.operation.value}`;
              break;
            case 'power':
              formula += ` ** ${tool.operation.value}`;
              break;
            case 'modulus':
              formula += ` % ${tool.operation.value}`;
              break;
          }
        }
      }
    });
    
    // Step 2: Calculate formula value safely
    let calculatedValue = 0;
    try {
      // Safe evaluation of BODMAS formula
      calculatedValue = this.evaluateFormula(formula);
    } catch (error) {
      console.warn('Formula evaluation failed:', formula, error);
      calculatedValue = 0;
    }
    
    // Step 3: Convert operation result to features based on tool relevance
    const features = this.convertOperationsToFeatures(toolOperations, calculatedValue);
    
    // Step 4: Apply feature caps
    const cappedFeatures = {
      robustness: Math.min(features.robustness, 100),
      accuracy: Math.min(features.accuracy, 100),
      stability: Math.min(features.stability, 100),
      creativity: Math.min(features.creativity, pointMap.feature_caps.creativity),
      efficiency: Math.min(features.efficiency, pointMap.feature_caps.efficiency),
    };
    
    // Step 5: Weighted Score
    const expectations = selectedArchetype?.expectations || pointMap.expectations;
    let weightedScore = 0;
    
    Object.keys(cappedFeatures).forEach(feature => {
      const key = feature as keyof typeof cappedFeatures;
      const expectation = expectations[key] || 0;
      weightedScore += cappedFeatures[key] * expectation;
    });
    
    // Step 6: Apply Penalty Score
    let penaltyScore = 0;
    
    // Hallucination risk from operations
    const hallucinationRisk = toolOperations.reduce((risk, tool) => {
      if (tool.operation === 'divide' || tool.operation === 'power') {
        return risk + (tool.strength * 0.5); // Higher risk for complex operations
      }
      return risk;
    }, 0);
    
    penaltyScore += hallucinationRisk * pointMap.penalties.hallucination_risk;
    
    // Over creativity penalty
    if (cappedFeatures.creativity > pointMap.feature_caps.creativity * 0.8) {
      const overAmount = cappedFeatures.creativity - (pointMap.feature_caps.creativity * 0.8);
      penaltyScore += overAmount * pointMap.penalties.over_creativity;
    }
    
    // Latency overflow penalty (based on number of tools)
    const toolCount = selectedTools.length;
    if (toolCount > 10) {
      const overflow = toolCount - 10;
      penaltyScore += overflow * pointMap.penalties.latency_overflow;
    }
    
    // Step 7: Difficulty Curve Scaling
    const rawStrength = weightedScore - penaltyScore;
    const difficultyFactor = pointMap.difficulty_curve.k * (rawStrength - pointMap.difficulty_curve.t);
    const scaledScore = weightedScore * (1 + difficultyFactor);
    
    // Step 8: Final Strength (0-100)
    const finalStrength = Math.max(0, Math.min(100, scaledScore - penaltyScore));
    
    return {
      finalStrength: Math.round(finalStrength * 100) / 100,
      featureBreakdown: cappedFeatures,
      penaltyBreakdown: {
        hallucination_risk: hallucinationRisk * pointMap.penalties.hallucination_risk,
        over_creativity: Math.max(0, cappedFeatures.creativity - (pointMap.feature_caps.creativity * 0.8)) * pointMap.penalties.over_creativity,
        latency_overflow: Math.max(0, toolCount - 10) * pointMap.penalties.latency_overflow,
      },
      operationResult: {
        formula,
        calculatedValue,
        toolOperations
      }
    };
  }
  
  /**
   * Safely evaluate mathematical formula
   */
  private static evaluateFormula(formula: string): number {
    // Remove any potentially harmful characters and evaluate
    const cleanFormula = formula.replace(/[^0-9+\-*/%.()\s]/g, '');
    
    try {
      // Use Function constructor for safer evaluation
      const result = new Function('return ' + cleanFormula)();
      return isNaN(result) ? 0 : Math.abs(result);
    } catch {
      return 0;
    }
  }
  
  /**
   * Convert tool operations to feature scores
   */
  private static convertOperationsToFeatures(
    toolOperations: ScoringResult['operationResult']['toolOperations'],
    calculatedValue: number
  ) {
    // Base feature calculation from operation types and values
    const baseFeatures = {
      robustness: 0,
      accuracy: 0,
      stability: 0,
      creativity: 0,
      efficiency: 0,
    };
    
    toolOperations.forEach(tool => {
      const strengthMultiplier = tool.strength / 10; // Convert strength 1-10 to 0.1-1.0
      
      switch (tool.operation) {
        case 'add':
          baseFeatures.robustness += tool.value * strengthMultiplier * 2;
          baseFeatures.stability += tool.value * strengthMultiplier * 1.5;
          break;
        case 'subtract':
          baseFeatures.accuracy += tool.value * strengthMultiplier * 2;
          baseFeatures.efficiency += tool.value * strengthMultiplier * 1.5;
          break;
        case 'multiply':
          baseFeatures.efficiency += tool.value * strengthMultiplier * 3;
          baseFeatures.creativity += tool.value * strengthMultiplier * 1;
          break;
        case 'divide':
          baseFeatures.accuracy += tool.value * strengthMultiplier * 2.5;
          baseFeatures.robustness += tool.value * strengthMultiplier * 1;
          break;
        case 'power':
          baseFeatures.creativity += tool.value * strengthMultiplier * 4;
          baseFeatures.efficiency += tool.value * strengthMultiplier * 2;
          break;
        case 'modulus':
          baseFeatures.stability += tool.value * strengthMultiplier * 3;
          baseFeatures.accuracy += tool.value * strengthMultiplier * 1.5;
          break;
      }
    });
    
    // Add bonus based on calculated value complexity
    const complexityBonus = Math.min(calculatedValue / 10, 20);
    baseFeatures.creativity += complexityBonus;
    
    // Normalize features
    Object.keys(baseFeatures).forEach(feature => {
      const key = feature as keyof typeof baseFeatures;
      baseFeatures[key] = Math.round(baseFeatures[key]);
    });
    
    return baseFeatures;
  }

  /**
   * Get feature display data for UI
   */
  static getFeatureDisplay(
    selectedTools: string[],
    pointMap: PointMap,
    selectedArchetype?: Archetype
  ) {
    const result = this.calculateV3Score(selectedTools, pointMap, selectedArchetype);
    
    return {
      robustness: {
        value: Math.round(result.featureBreakdown.robustness),
        maxValue: 100,
        percentage: Math.round((result.featureBreakdown.robustness / 100) * 100),
      },
      accuracy: {
        value: Math.round(result.featureBreakdown.accuracy),
        maxValue: 100,
        percentage: Math.round((result.featureBreakdown.accuracy / 100) * 100),
      },
      stability: {
        value: Math.round(result.featureBreakdown.stability),
        maxValue: 100,
        percentage: Math.round((result.featureBreakdown.stability / 100) * 100),
      },
      creativity: {
        value: Math.round(result.featureBreakdown.creativity),
        maxValue: pointMap.feature_caps.creativity,
        percentage: Math.round((result.featureBreakdown.creativity / pointMap.feature_caps.creativity) * 100),
      },
      efficiency: {
        value: Math.round(result.featureBreakdown.efficiency),
        maxValue: pointMap.feature_caps.efficiency,
        percentage: Math.round((result.featureBreakdown.efficiency / pointMap.feature_caps.efficiency) * 100),
      },
    };
  }

  /**
   * Get tier info based on strength
   */
  static getTierInfo(strength: number, rankData?: any) {
    if (strength >= 80) return { tier: 'Platinum', color: 'text-purple-400', bgColor: 'bg-purple-500/20' };
    if (strength >= 60) return { tier: 'Gold', color: 'text-amber-400', bgColor: 'bg-amber-500/20' };
    if (strength >= 40) return { tier: 'Silver', color: 'text-gray-300', bgColor: 'bg-gray-500/20' };
    return { tier: 'Bronze', color: 'text-orange-600', bgColor: 'bg-orange-500/20' };
  }
}
