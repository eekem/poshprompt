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

// Challenge templates for the new system
const challengeTemplates = [
  {
    id: 'ai-email-copy-generator-001',
    title: 'AI Email Copy Generator',
    description: 'Build a mini-model capable of generating high-converting marketing emails that drive engagement and sales.',
    gameType: 'tool_building',
    difficulty: 'intermediate',
    modelType: 'text_generation',
    modelName: 'meta-llama/Llama-3.1-8B-Instruct',
    isActive: true,
    isFeatured: true,
    week: '2026-W07'
  },
  {
    id: 'social-media-content-creator-001',
    title: 'Social Media Content Creator',
    description: 'Train an AI assistant that creates engaging, platform-specific social media content that grows audiences.',
    gameType: 'tool_building',
    difficulty: 'beginner',
    modelType: 'text_generation',
    modelName: 'meta-llama/Llama-3.1-8B-Instruct',
    isActive: true,
    isFeatured: false,
    week: '2026-W07'
  },
  {
    id: 'data-analysis-insights-001',
    title: 'Data Analysis Insights Generator',
    description: 'Build a mini-model that transforms raw data into actionable business insights and recommendations.',
    gameType: 'tool_building',
    difficulty: 'advanced',
    modelType: 'text_generation',
    modelName: 'meta-llama/Llama-3.1-8B-Instruct',
    isActive: true,
    isFeatured: false,
    week: '2026-W07'
  },
  {
    id: 'customer-support-chatbot-001',
    title: 'Customer Support Chatbot',
    description: 'Create an AI assistant that handles customer inquiries with empathy and problem-solving skills.',
    gameType: 'tool_building',
    difficulty: 'intermediate',
    modelType: 'text_generation',
    modelName: 'meta-llama/Llama-3.1-8B-Instruct',
    isActive: true,
    isFeatured: true,
    week: '2026-W07'
  },
  {
    id: 'creative-writing-assistant-001',
    title: 'Creative Writing Assistant',
    description: 'Train an AI that helps authors overcome writer\'s block and enhances creative storytelling.',
    gameType: 'tool_building',
    difficulty: 'beginner',
    modelType: 'text_generation',
    modelName: 'meta-llama/Llama-3.1-8B-Instruct',
    isActive: true,
    isFeatured: false,
    week: '2026-W07'
  },
  {
    id: 'code-review-automation-001',
    title: 'Code Review Automation',
    description: 'Build an AI that performs automated code reviews with actionable feedback and best practice recommendations.',
    gameType: 'tool_building',
    difficulty: 'advanced',
    modelType: 'text_generation',
    modelName: 'meta-llama/Llama-3.1-8B-Instruct',
    isActive: true,
    isFeatured: true,
    week: '2026-W07'
  },
  {
    id: 'product-description-writer-001',
    title: 'Product Description Writer',
    description: 'Create an AI that writes compelling product descriptions that increase conversion rates.',
    gameType: 'tool_building',
    difficulty: 'intermediate',
    modelType: 'text_generation',
    modelName: 'meta-llama/Llama-3.1-8B-Instruct',
    isActive: true,
    isFeatured: false,
    week: '2026-W07'
  },
  {
    id: 'meeting-summary-generator-001',
    title: 'Meeting Summary Generator',
    description: 'Train an AI that automatically generates comprehensive meeting summaries and action items.',
    gameType: 'tool_building',
    difficulty: 'beginner',
    modelType: 'text_generation',
    modelName: 'meta-llama/Llama-3.1-8B-Instruct',
    isActive: true,
    isFeatured: false,
    week: '2026-W07'
  },
  {
    id: 'seo-content-optimizer-001',
    title: 'SEO Content Optimizer',
    description: 'Build an AI that optimizes content for search engines while maintaining readability.',
    gameType: 'tool_building',
    difficulty: 'intermediate',
    modelType: 'text_generation',
    modelName: 'meta-llama/Llama-3.1-8B-Instruct',
    isActive: true,
    isFeatured: true,
    week: '2026-W07'
  },
  {
    id: 'sentiment-analysis-tool-001',
    title: 'Sentiment Analysis Tool',
    description: 'Create an AI that accurately analyzes sentiment in text and provides emotional insights.',
    gameType: 'tool_building',
    difficulty: 'advanced',
    modelType: 'text_generation',
    modelName: 'meta-llama/Llama-3.1-8B-Instruct',
    isActive: true,
    isFeatured: false,
    week: '2026-W07'
  }
];

// Default legacy scoring and rewards (for backward compatibility)
const defaultScoring = {
  totalScore: 100,
  passingScore: 70,
  breakdown: {
    consistency: 30,
    output_quality: 25,
    robustness: 25,
    creativity: 10,
    brevity: 10
  }
};

const defaultRewards = {
  base_xp: 50,
  base_coins: 10,
  completion_bonus: {
    high_robustness: 15,
    perfect_run: 25
  }
};

async function main() {
  console.log('🌱 Starting database seeding for new challenge system...');

  try {
    // Clear existing data
    await prisma.build.deleteMany();
    await prisma.sessionPointMap.deleteMany();
    await prisma.sessionTool.deleteMany();
    await prisma.sessionCategory.deleteMany();
    await prisma.buildingSession.deleteMany();
    await prisma.challenge.deleteMany();
    await prisma.challengePrizes.deleteMany();
    console.log('🗑️  Cleared existing challenge data');

    let totalChallenges = 0;

    // Create challenges
    for (const template of challengeTemplates) {
      const challenge = await prisma.challenge.create({
        data: {
          id: template.id,
          title: template.title,
          description: template.description,
          gameType: template.gameType,
          difficulty: template.difficulty,
          modelType: template.modelType,
          modelName: template.modelName,
          task: {
            objective: `Build a mini-model: ${template.title}`,
            constraints: {
              required: ['Select tools strategically', 'Consider synergies between tools'],
              forbidden: ['Exceed prompt credit limit', 'Select duplicate tools'],
              optional: ['Maximize strength through combinations']
            },
            learningObjectives: ['Strategic thinking', 'Resource management', 'Pattern recognition']
          },
          gameplay: {
            turnBased: false,
            toolSelection: true,
            strengthBuilding: true,
            scoringMode: 'strength_based'
          },
          scoring: defaultScoring,
          rewards: defaultRewards,
          minScore: template.difficulty === 'beginner' ? 50 : template.difficulty === 'intermediate' ? 60 : 70,
          maxXpPerTurn: 100,
          isActive: template.isActive,
          isFeatured: template.isFeatured,
          week: template.week,
          rewardZoneType: 'top_n',
          rewardZoneValue: 3,
          totalPrizePool: 80.0
        }
      });

      totalChallenges++;
      console.log(`✅ Created challenge: ${challenge.title}`);
      console.log(`   📋 ID: ${challenge.id}`);
      console.log(`   🎮 Game Type: ${template.gameType}`);
      console.log(`   📈 Difficulty: ${template.difficulty}`);
      console.log(`   🤖 Model: ${template.modelName}`);
      console.log(`   ⭐ Featured: ${template.isFeatured ? 'Yes' : 'No'}`);
      console.log('');
    }

    console.log(`🎉 Successfully seeded ${totalChallenges} challenges!`);
    console.log('\n📊 Summary:');
    
    const totalChallengeCount = await prisma.challenge.count();
    console.log(`   Total Challenges: ${totalChallengeCount}`);
    
    const featuredCount = await prisma.challenge.count({
      where: { isFeatured: true }
    });
    console.log(`   Featured Challenges: ${featuredCount}`);

    console.log('\n🎯 Challenge Breakdown by Difficulty:');
    const difficulties = ['beginner', 'intermediate', 'advanced'];
    for (const difficulty of difficulties) {
      const count = await prisma.challenge.count({
        where: { difficulty }
      });
      console.log(`   ${difficulty}: ${count} challenges`);
    }

    console.log('\n🔧 Next Steps:');
    console.log('   1. Use the session start endpoint to create building sessions');
    console.log('   2. The AI will generate 15-25 tools per session based on challenge context');
    console.log('   3. Each session gets 3-5 categories with synergy rules');
    console.log('   4. Point maps will include base multipliers and bonuses');
    console.log('   5. Sessions are closed after each build and can be recreated');

    console.log('\n✨ Seeder completed successfully!');
    console.log('🚀 Challenges are ready for the new session-based tool-building system!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
