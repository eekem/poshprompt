import * as dotenv from 'dotenv';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Load environment variables first
dotenv.config({ path: '.env' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Create a new Prisma client for seeding
const prisma = new PrismaClient({ adapter });

// Challenge templates for each game type
const challengeTemplates = {
  image: {
    beginner: [
      {
        title: "Warm Portrait Generator",
        description: "Generate a professional portrait with specific lighting and mood",
        objective: "Create a portrait using descriptive prompts",
        required: ["person", "studio lighting"],
        forbidden: ["cartoon", "anime"],
        optional: ["warm tones", "professional attire"],
        modelName: "black-forest-labs/FLUX.1-dev",
        timeLimit: 180,
        maxTurns: 1,
        scoringMode: "constraint_based"
      },
      {
        title: "Simple Landscape Scene",
        description: "Create a basic landscape with natural elements",
        objective: "Generate a peaceful landscape image",
        required: ["landscape", "nature"],
        forbidden: ["urban", "buildings"],
        optional: ["mountains", "water"],
        modelName: "black-forest-labs/FLUX.1-dev",
        timeLimit: 120,
        maxTurns: 1,
        scoringMode: "constraint_based"
      }
    ],
    intermediate: [
      {
        title: "Product Photography",
        description: "Create professional product images with specific styling",
        objective: "Generate commercial-quality product photos",
        required: ["product", "clean background"],
        forbidden: ["people", "text"],
        optional: ["studio lighting", "minimalist"],
        modelName: "black-forest-labs/FLUX.1-dev",
        timeLimit: 240,
        maxTurns: 1,
        scoringMode: "constraint_based"
      },
      {
        title: "Fantasy Character Design",
        description: "Design unique fantasy characters with specific traits",
        objective: "Create original fantasy character concepts",
        required: ["character", "fantasy elements"],
        forbidden: ["realistic", "modern clothing"],
        optional: ["magical abilities", "unique features"],
        modelName: "black-forest-labs/FLUX.1-dev",
        timeLimit: 300,
        maxTurns: 1,
        scoringMode: "quality_score"
      }
    ],
    advanced: [
      {
        title: "Architectural Visualization",
        description: "Create complex architectural scenes with specific styles",
        objective: "Generate detailed architectural renderings",
        required: ["architecture", "specific style"],
        forbidden: ["cartoonish", "unrealistic proportions"],
        optional: ["sustainability features", "innovative design"],
        modelName: "black-forest-labs/FLUX.1-dev",
        timeLimit: 360,
        maxTurns: 1,
        scoringMode: "quality_score"
      },
      {
        title: "Abstract Art Composition",
        description: "Create meaningful abstract art with emotional impact",
        objective: "Generate abstract compositions with specific themes",
        required: ["abstract", "emotional theme"],
        forbidden: ["representational", "literal objects"],
        optional: ["color harmony", "dynamic composition"],
        modelName: "black-forest-labs/FLUX.1-dev",
        timeLimit: 300,
        maxTurns: 1,
        scoringMode: "quality_score"
      }
    ]
  },
  text: {
    beginner: [
      {
        title: "Tweet Storm Generator",
        description: "Turn a paragraph into a short, engaging Twitter thread",
        objective: "Generate a 5-tweet thread from a paragraph",
        required: ["5 tweets", "main points covered"],
        forbidden: ["grammar errors", "exceed character limits"],
        optional: ["humor", "emojis"],
        modelName: "meta-llama/Llama-3.1-8B-Instruct",
        timeLimit: 120,
        maxTurns: 1,
        scoringMode: "quality_score"
      },
      {
        title: "Simple Summary Writing",
        description: "Condense articles into concise summaries",
        objective: "Create brief summaries of given texts",
        required: ["main points", "under 100 words"],
        forbidden: ["personal opinions", "additional information"],
        optional: ["bullet points", "clear structure"],
        modelName: "meta-llama/Llama-3.1-8B-Instruct",
        timeLimit: 90,
        maxTurns: 1,
        scoringMode: "constraint_based"
      }
    ],
    intermediate: [
      {
        title: "Blog Post Introduction",
        description: "Write engaging blog post introductions",
        objective: "Create compelling introductions for technical topics",
        required: ["hook", "thesis statement", "preview"],
        forbidden: ["clickbait", "misleading claims"],
        optional: ["statistics", "personal anecdote"],
        modelName: "meta-llama/Llama-3.1-8B-Instruct",
        timeLimit: 180,
        maxTurns: 1,
        scoringMode: "quality_score"
      },
      {
        title: "Email Communication",
        description: "Write professional emails for different scenarios",
        objective: "Compose effective business emails",
        required: ["clear subject", "proper tone", "call to action"],
        forbidden: ["slang", "excessive jargon"],
        optional: ["personalization", "professional formatting"],
        modelName: "meta-llama/Llama-3.1-8B-Instruct",
        timeLimit: 150,
        maxTurns: 1,
        scoringMode: "constraint_based"
      }
    ],
    advanced: [
      {
        title: "Technical Documentation",
        description: "Write comprehensive technical documentation",
        objective: "Create clear and detailed technical guides",
        required: ["step-by-step instructions", "code examples", "troubleshooting"],
        forbidden: ["ambiguous language", "assumptions about user knowledge"],
        optional: ["visual aids description", "best practices"],
        modelName: "meta-llama/Llama-3.1-8B-Instruct",
        timeLimit: 300,
        maxTurns: 1,
        scoringMode: "quality_score"
      },
      {
        title: "Creative Storytelling",
        description: "Write engaging stories with specific themes and constraints",
        objective: "Create original narratives with literary elements",
        required: ["character development", "plot arc", "theme"],
        forbidden: ["clichés", "inconsistent tone"],
        optional: ["dialogue", "sensory details"],
        modelName: "meta-llama/Llama-3.1-8B-Instruct",
        timeLimit: 240,
        maxTurns: 1,
        scoringMode: "quality_score"
      }
    ]
  },
  transformation: {
    beginner: [
      {
        title: "Text to Bullet Points",
        description: "Convert paragraphs into structured bullet points",
        objective: "Extract key information and format as bullet points",
        required: ["all main points", "proper hierarchy"],
        forbidden: ["missing information", "incorrect formatting"],
        optional: ["sub-bullets", "emphasis"],
        modelName: "meta-llama/Llama-3.1-8B-Instruct",
        timeLimit: 120,
        maxTurns: 1,
        scoringMode: "constraint_based"
      },
      {
        title: "Simple JSON Conversion",
        description: "Convert basic information to JSON format",
        objective: "Structure simple data as JSON",
        required: ["valid JSON syntax", "all data included"],
        forbidden: ["syntax errors", "missing fields"],
        optional: ["nested objects", "arrays"],
        modelName: "meta-llama/Llama-3.1-8B-Instruct",
        timeLimit: 90,
        maxTurns: 1,
        scoringMode: "constraint_based"
      }
    ],
    intermediate: [
      {
        title: "API Documentation Generator",
        description: "Convert API specifications to documentation",
        objective: "Generate comprehensive API documentation",
        required: ["endpoint descriptions", "parameter details", "response formats"],
        forbidden: ["incomplete examples", "incorrect syntax"],
        optional: ["error handling", "usage examples"],
        modelName: "meta-llama/Llama-3.1-8B-Instruct",
        timeLimit: 240,
        maxTurns: 1,
        scoringMode: "constraint_based"
      },
      {
        title: "Data Structure Converter",
        description: "Transform data between different formats",
        objective: "Convert complex data structures accurately",
        required: ["data integrity", "proper nesting", "type conversion"],
        forbidden: ["data loss", "structural errors"],
        optional: ["validation", "optimization"],
        modelName: "meta-llama/Llama-3.1-8B-Instruct",
        timeLimit: 180,
        maxTurns: 1,
        scoringMode: "constraint_based"
      }
    ],
    advanced: [
      {
        title: "Code Refactoring Assistant",
        description: "Transform and optimize code structures",
        objective: "Improve code quality and maintainability",
        required: ["functional equivalence", "improved structure", "documentation"],
        forbidden: ["breaking changes", "performance degradation"],
        optional: ["design patterns", "optimization"],
        modelName: "meta-llama/Llama-3.1-8B-Instruct",
        timeLimit: 300,
        maxTurns: 1,
        scoringMode: "constraint_based"
      },
      {
        title: "Schema Migration Generator",
        description: "Create database migration scripts",
        objective: "Generate safe database schema changes",
        required: ["backward compatibility", "data preservation", "rollback plan"],
        forbidden: ["data loss", "destructive changes"],
        optional: ["performance optimization", "validation"],
        modelName: "meta-llama/Llama-3.1-8B-Instruct",
        timeLimit: 360,
        maxTurns: 1,
        scoringMode: "constraint_based"
      }
    ]
  },
  refinement: {
    beginner: [
      {
        title: "Sentence Improvement",
        description: "Refine awkward sentences for clarity and style",
        objective: "Improve sentence structure and readability",
        required: ["improved clarity", "maintained meaning"],
        forbidden: ["changed meaning", "introduced errors"],
        optional: ["better word choice", "improved flow"],
        modelName: "meta-llama/Llama-3.1-8B-Instruct",
        timeLimit: 180,
        maxTurns: 3,
        scoringMode: "refinement_score"
      },
      {
        title: "Paragraph Condensation",
        description: "Make verbose paragraphs more concise",
        objective: "Reduce word count while preserving meaning",
        required: ["reduced length", "same meaning"],
        forbidden: ["loss of information", "grammatical errors"],
        optional: ["better structure", "improved impact"],
        modelName: "meta-llama/Llama-3.1-8B-Instruct",
        timeLimit: 150,
        maxTurns: 3,
        scoringMode: "refinement_score"
      }
    ],
    intermediate: [
      {
        title: "Email Tone Adjustment",
        description: "Refine email tone for different audiences",
        objective: "Adjust communication style appropriately",
        required: ["appropriate tone", "clear message", "professional"],
        forbidden: ["offensive language", "unclear intent"],
        optional: ["personalization", "cultural sensitivity"],
        modelName: "meta-llama/Llama-3.1-8B-Instruct",
        timeLimit: 200,
        maxTurns: 3,
        scoringMode: "refinement_score"
      },
      {
        title: "Technical Explanation Simplification",
        description: "Make complex topics accessible to non-experts",
        objective: "Simplify technical content without losing accuracy",
        required: ["simplified language", "maintained accuracy", "clear examples"],
        forbidden: ["oversimplification", "incorrect information"],
        optional: ["analogies", "visual descriptions"],
        modelName: "meta-llama/Llama-3.1-8B-Instruct",
        timeLimit: 240,
        maxTurns: 3,
        scoringMode: "refinement_score"
      }
    ],
    advanced: [
      {
        title: "Legal Document Clarification",
        description: "Refine legal language for better comprehension",
        objective: "Make legal documents more readable while maintaining precision",
        required: ["legal accuracy", "improved readability", "clear terminology"],
        forbidden: ["legal ambiguity", "loss of protection"],
        optional: ["plain language sections", "examples"],
        modelName: "meta-llama/Llama-3.1-8B-Instruct",
        timeLimit: 300,
        maxTurns: 3,
        scoringMode: "refinement_score"
      },
      {
        title: "Research Paper Enhancement",
        description: "Improve academic writing clarity and impact",
        objective: "Enhance research paper quality and readability",
        required: ["academic rigor", "clear methodology", "strong conclusions"],
        forbidden: ["plagiarism", "methodological flaws"],
        optional: ["better citations", "improved structure"],
        modelName: "meta-llama/Llama-3.1-8B-Instruct",
        timeLimit: 360,
        maxTurns: 3,
        scoringMode: "refinement_score"
      }
    ]
  },
  evaluation: {
    beginner: [
      {
        title: "Simple Response Ranking",
        description: "Rank AI responses by quality and accuracy",
        objective: "Evaluate and order responses from best to worst",
        required: ["ranking", "reasoning", "identification of best"],
        forbidden: ["ignoring responses", "unjustified rankings"],
        optional: ["specific feedback", "improvement suggestions"],
        modelName: "meta-llama/Llama-3.1-8B-Instruct",
        timeLimit: 180,
        maxTurns: 1,
        scoringMode: "ranking"
      },
      {
        title: "Fact-Checking Assistant",
        description: "Evaluate statements for accuracy",
        objective: "Identify correct and incorrect information",
        required: ["accuracy assessment", "error identification"],
        forbidden: ["unverified claims", "personal bias"],
        optional: ["sources", "confidence levels"],
        modelName: "meta-llama/Llama-3.1-8B-Instruct",
        timeLimit: 150,
        maxTurns: 1,
        scoringMode: "ranking"
      }
    ],
    intermediate: [
      {
        title: "Content Quality Assessment",
        description: "Evaluate content across multiple dimensions",
        objective: "Assess writing quality comprehensively",
        required: ["quality metrics", "specific feedback", "improvement areas"],
        forbidden: ["vague feedback", "personal preference"],
        optional: ["scoring rubric", "comparative analysis"],
        modelName: "meta-llama/Llama-3.1-8B-Instruct",
        timeLimit: 240,
        maxTurns: 1,
        scoringMode: "ranking"
      },
      {
        title: "Code Review Evaluation",
        description: "Assess code quality and suggest improvements",
        objective: "Evaluate code for best practices and maintainability",
        required: ["bug identification", "style assessment", "security review"],
        forbidden: ["missing critical issues", "unfair criticism"],
        optional: ["optimization suggestions", "alternative approaches"],
        modelName: "meta-llama/Llama-3.1-8B-Instruct",
        timeLimit: 200,
        maxTurns: 1,
        scoringMode: "ranking"
      }
    ],
    advanced: [
      {
        title: "Multi-Model Comparison",
        description: "Compare outputs from different AI models",
        objective: "Evaluate and rank responses from multiple AI systems",
        required: ["comparative analysis", "model-specific insights", "ranking justification"],
        forbidden: ["bias toward specific models", "incomplete comparison"],
        optional: ["use case recommendations", "strength/weakness analysis"],
        modelName: "meta-llama/Llama-3.1-8B-Instruct",
        timeLimit: 300,
        maxTurns: 1,
        scoringMode: "ranking"
      },
      {
        title: "Research Methodology Review",
        description: "Evaluate research methods and experimental design",
        objective: "Assess scientific rigor and validity",
        required: ["methodology assessment", "bias identification", "validity evaluation"],
        forbidden: ["methodological errors", "statistical misinterpretation"],
        optional: ["improvement suggestions", "alternative approaches"],
        modelName: "meta-llama/Llama-3.1-8B-Instruct",
        timeLimit: 360,
        maxTurns: 1,
        scoringMode: "ranking"
      }
    ]
  }
};

// Scoring configurations
const scoringConfigs = {
  constraint_based: {
    totalScore: 100,
    breakdown: {
      constraint_accuracy: 60,
      clarity: 20,
      creativity: 10,
      brevity: 10
    }
  },
  quality_score: {
    totalScore: 100,
    breakdown: {
      constraint_accuracy: 40,
      clarity: 30,
      creativity: 20,
      brevity: 10
    }
  },
  refinement_score: {
    totalScore: 100,
    breakdown: {
      improvement_per_turn: 70,
      brevity: 30
    }
  },
  ranking: {
    totalScore: 100,
    breakdown: {
      correctness: 50,
      explanation_quality: 30,
      creativity: 20
    }
  }
};

// Reward configurations
const rewardConfigs = {
  beginner: { xp: 20, coins: 2 },
  intermediate: { xp: 40, coins: 5 },
  advanced: { xp: 60, coins: 10 }
};

// Challenge prize configurations
const challengePrizeConfigs = [
  { position: 1, amount: 100.00 },  // 1st place: $100
  { position: 2, amount: 50.00 },   // 2nd place: $50
  { position: 3, amount: 25.00 },   // 3rd place: $25
  { position: 4, amount: 10.00 },   // 4th place: $10
  { position: 5, amount: 5.00 },    // 5th place: $5
  { position: 10, amount: 1.00 },  // 10th place: $1
  { position: 20, amount: 0.50 },  // 20th place: $0.50
  { position: 50, amount: 0.25 },  // 50th place: $0.25
  { position: 100, amount: 0.10 }  // 100th place: $0.10
];

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing challenges and prizes
  await prisma.challenge.deleteMany();
  await prisma.challengePrizes.deleteMany();
  console.log('🗑️  Cleared existing challenges and prizes');

  const gameTypes: Array<'image' | 'text' | 'transformation' | 'refinement' | 'evaluation'> = 
    ['image', 'text', 'transformation', 'refinement', 'evaluation'];
  
  const difficulties: Array<'beginner' | 'intermediate' | 'advanced'> = 
    ['beginner', 'intermediate', 'advanced'];

  let totalChallenges = 0;
  let totalPrizes = 0;

  // Generate challenges for all combinations
  for (const gameType of gameTypes) {
    for (const difficulty of difficulties) {
      const templates = challengeTemplates[gameType][difficulty];
      
      for (let i = 0; i < templates.length; i++) {
        const template = templates[i];
        const modelType = gameType === 'image' ? 'image_generation' : 'text_generation';
        
        const challenge = await prisma.challenge.create({
          data: {
            id: `${gameType}-${difficulty}-${i + 1}`,
            title: template.title,
            description: template.description,
            gameType,
            difficulty,
            modelType,
            modelName: template.modelName,
            task: {
              objective: template.objective,
              constraints: {
                required: template.required,
                forbidden: template.forbidden,
                optional: template.optional
              }
            },
            gameplay: {
              turnBased: gameType === 'refinement',
              maxTurns: template.maxTurns,
              timeLimitSeconds: template.timeLimit,
              scoringMode: template.scoringMode
            },
            scoring: scoringConfigs[template.scoringMode as keyof typeof scoringConfigs],
            rewards: rewardConfigs[difficulty],
            minScore: difficulty === 'beginner' ? 30 : difficulty === 'intermediate' ? 50 : 70,
            maxXpPerTurn: difficulty === 'beginner' ? 20 : difficulty === 'intermediate' ? 40 : 60
          }
        });

        totalChallenges++;
        console.log(`✅ Created challenge: ${challenge.title} (${gameType} - ${difficulty})`);
        console.log(`   📋 ID: ${challenge.id}`);
        console.log(`   🎮 Game Type: ${gameType}`);
        console.log(`   📈 Difficulty: ${difficulty}`);
        console.log(`   🤖 Model: ${template.modelName}`);
        console.log(`   ⏱️  Time Limit: ${template.timeLimit}s`);
        console.log(`   🔄 Turn-based: ${gameType === 'refinement' ? 'Yes' : 'No'}`);
        console.log(`   🏆 XP Reward: ${rewardConfigs[difficulty].xp}`);
        console.log(`   🎯 Min Score: ${difficulty === 'beginner' ? 30 : difficulty === 'intermediate' ? 50 : 70}`);
        console.log(`   ⭐ Max XP/turn: ${difficulty === 'beginner' ? 20 : difficulty === 'intermediate' ? 40 : 60}`);
        console.log('');

        // Create prizes for this challenge
        for (const prizeConfig of challengePrizeConfigs) {
          await prisma.challengePrizes.create({
            data: {
              challengeId: challenge.id,
              position: prizeConfig.position,
              amount: prizeConfig.amount
            }
          });
          
          totalPrizes++;
          console.log(`💵 Created prize for ${challenge.id}: Position ${prizeConfig.position} - $${prizeConfig.amount.toFixed(2)}`);
        }
      }
    }
  }

  console.log(`💰 Successfully seeded ${totalPrizes} challenge prizes!`);
  console.log(`🎉 Successfully seeded ${totalChallenges} challenges!`);
  console.log('\n📊 Summary:');
  
  for (const gameType of gameTypes) {
    const count = await prisma.challenge.count({
      where: { gameType }
    });
    console.log(`   ${gameType}: ${count} challenges`);
  }

  console.log('\n🎯 Challenge Breakdown by Difficulty:');
  for (const difficulty of difficulties) {
    const count = await prisma.challenge.count({
      where: { difficulty }
    });
    console.log(`   ${difficulty}: ${count} challenges`);
  }

  console.log('\n🔢 Total Database Stats:');
  const totalChallengeCount = await prisma.challenge.count();
  console.log(`   Total Challenges: ${totalChallengeCount}`);
  console.log(`   Total Possible Combinations: ${gameTypes.length * difficulties.length * 2}`); // 2 templates per combination
  
  // Show some example challenges for each game type
  console.log('\n📋 Example Challenges:');
  for (const gameType of gameTypes) {
    const example = await prisma.challenge.findFirst({
      where: { gameType },
      select: {
        id: true,
        title: true,
        difficulty: true,
        modelName: true
      }
    });
    if (example) {
      console.log(`   ${gameType}: "${example.title}" (${example.difficulty}) - ${example.modelName}`);
    }
  }

  console.log('\n✨ Seeder completed successfully!');
  console.log('🚀 You can now start testing challenges with the new Chat/Message structure!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
