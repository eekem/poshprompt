// Test cases for strength calculation logic

interface PointMap {
  baseMultiplier: number;
  synergyRules: Array<{
    tools: string[];
    bonus: number;
  }>;
  categoryDiversityBonus: number;
  maxStrength: number;
}

interface Tool {
  slug: string;
  promptCost: number;
  categoryId: string;
}

// Strength calculation function (copied from build endpoint)
function calculateStrength(
  selectedTools: Tool[],
  pointMap: PointMap
): {
  baseScore: number;
  diversityBonus: number;
  synergyBonus: number;
  finalStrength: number;
} {
  // Calculate total prompt cost
  const totalPromptCost = selectedTools.reduce((sum, tool) => sum + tool.promptCost, 0);

  // Base score calculation
  const baseScore = totalPromptCost * pointMap.baseMultiplier;

  // Diversity bonus calculation
  const selectedCategories = new Set(selectedTools.map(tool => tool.categoryId));
  const diversityBonus = selectedCategories.size > 1 ? pointMap.categoryDiversityBonus : 0;

  // Synergy bonus calculation
  let synergyBonus = 0;
  const selectedToolSlugs = selectedTools.map(tool => tool.slug);
  
  for (const rule of pointMap.synergyRules) {
    const isRuleSatisfied = rule.tools.every(toolSlug => selectedToolSlugs.includes(toolSlug));
    
    if (isRuleSatisfied) {
      synergyBonus += rule.bonus;
    }
  }

  // Calculate final strength
  const rawStrength = baseScore + diversityBonus + synergyBonus;
  const finalStrength = Math.min(rawStrength, pointMap.maxStrength);

  return {
    baseScore,
    diversityBonus,
    synergyBonus,
    finalStrength
  };
}

// Test cases
const testCases = [
  {
    name: "Single tool, no bonuses",
    tools: [
      { slug: "tool-a", promptCost: 5, categoryId: "cat-1" }
    ],
    pointMap: {
      baseMultiplier: 1.2,
      synergyRules: [],
      categoryDiversityBonus: 10,
      maxStrength: 100
    },
    expected: {
      baseScore: 6,
      diversityBonus: 0,
      synergyBonus: 0,
      finalStrength: 6
    }
  },
  {
    name: "Multiple categories, diversity bonus",
    tools: [
      { slug: "tool-a", promptCost: 3, categoryId: "cat-1" },
      { slug: "tool-b", promptCost: 4, categoryId: "cat-2" }
    ],
    pointMap: {
      baseMultiplier: 1.5,
      synergyRules: [],
      categoryDiversityBonus: 10,
      maxStrength: 100
    },
    expected: {
      baseScore: 10.5,
      diversityBonus: 10,
      synergyBonus: 0,
      finalStrength: 20.5
    }
  },
  {
    name: "Synergy bonus applied",
    tools: [
      { slug: "tool-a", promptCost: 3, categoryId: "cat-1" },
      { slug: "tool-b", promptCost: 4, categoryId: "cat-2" },
      { slug: "tool-c", promptCost: 2, categoryId: "cat-1" }
    ],
    pointMap: {
      baseMultiplier: 1.2,
      synergyRules: [
        { tools: ["tool-a", "tool-b"], bonus: 15 },
        { tools: ["tool-b", "tool-c"], bonus: 8 }
      ],
      categoryDiversityBonus: 10,
      maxStrength: 100
    },
    expected: {
      baseScore: 10.8,
      diversityBonus: 10,
      synergyBonus: 23, // Both synergy rules apply
      finalStrength: 43.8
    }
  },
  {
    name: "Max strength cap",
    tools: [
      { slug: "tool-a", promptCost: 50, categoryId: "cat-1" },
      { slug: "tool-b", promptCost: 50, categoryId: "cat-2" }
    ],
    pointMap: {
      baseMultiplier: 2.0,
      synergyRules: [
        { tools: ["tool-a", "tool-b"], bonus: 50 }
      ],
      categoryDiversityBonus: 20,
      maxStrength: 100
    },
    expected: {
      baseScore: 200,
      diversityBonus: 20,
      synergyBonus: 50,
      finalStrength: 100 // Capped at maxStrength
    }
  }
];

// Run tests
function runTests() {
  console.log("Running strength calculation tests...\n");
  
  let passedTests = 0;
  let totalTests = testCases.length;

  testCases.forEach((testCase, index) => {
    const result = calculateStrength(testCase.tools, testCase.pointMap);
    
    const isPassing = 
      Math.abs(result.baseScore - testCase.expected.baseScore) < 0.01 &&
      result.diversityBonus === testCase.expected.diversityBonus &&
      result.synergyBonus === testCase.expected.synergyBonus &&
      Math.abs(result.finalStrength - testCase.expected.finalStrength) < 0.01;

    console.log(`Test ${index + 1}: ${testCase.name}`);
    console.log(`Expected:`, testCase.expected);
    console.log(`Actual:`, result);
    console.log(`Status: ${isPassing ? '✅ PASS' : '❌ FAIL'}\n`);

    if (isPassing) {
      passedTests++;
    }
  });

  console.log(`\nTest Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log("🎉 All tests passed!");
  } else {
    console.log("❌ Some tests failed. Please review the implementation.");
  }
}

// Export for running in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runTests, calculateStrength };
}

// Auto-run in browser environment
if (typeof window !== 'undefined') {
  runTests();
}
