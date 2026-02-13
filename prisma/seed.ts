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

// V2 Challenge templates with complete v2 data structure
const challengeTemplates = [
  {
    id: 'ai-email-copy-generator-001',
    title: 'AI Email Copy Generator',
    description: 'Build a mini-model capable of generating high-converting marketing emails that drive engagement and sales.',
    goal: 'Maximize conversion rates while maintaining brand voice and personalization',
    difficulty: 'Intermediate' as const,
    isActive: true,
    isFeatured: true,
    totalPrizePool: 100.0,
    minimumBuildPower: 25.0
  },
  {
    id: 'social-media-content-creator-001',
    title: 'Social Media Content Creator',
    description: 'Train an AI assistant that creates engaging, platform-specific social media content that grows audiences.',
    goal: 'Create viral-worthy content while maintaining platform guidelines and engagement',
    difficulty: 'Beginner' as const,
    isActive: true,
    isFeatured: false,
    totalPrizePool: 50.0,
    minimumBuildPower: 15.0
  },
  {
    id: 'data-analysis-insights-001',
    title: 'Data Analysis Insights Generator',
    description: 'Build a mini-model that transforms raw data into actionable business insights and recommendations.',
    goal: 'Maximize analytical accuracy and insight depth while minimizing data misinterpretation',
    difficulty: 'Advanced' as const,
    isActive: true,
    isFeatured: false,
    totalPrizePool: 150.0,
    minimumBuildPower: 40.0
  },
  {
    id: 'customer-support-chatbot-001',
    title: 'Customer Support Chatbot',
    description: 'Create an AI assistant that handles customer inquiries with empathy and problem-solving skills.',
    goal: 'Achieve high customer satisfaction with accurate, empathetic responses',
    difficulty: 'Intermediate' as const,
    isActive: true,
    isFeatured: true,
    totalPrizePool: 80.0,
    minimumBuildPower: 30.0
  },
  {
    id: 'medical-safety-assistant-001',
    title: 'Medical Safety Assistant',
    description: 'Design a highly accurate and safe AI assistant for answering medical questions.',
    goal: 'Maximize factual accuracy and robustness while minimizing hallucination risk',
    difficulty: 'Advanced' as const,
    isActive: true,
    isFeatured: true,
    totalPrizePool: 200.0,
    minimumBuildPower: 50.0
  },
  {
    id: 'creative-writing-assistant-001',
    title: 'Creative Writing Assistant',
    description: 'Train an AI that helps authors overcome writer\'s block and enhances creative storytelling.',
    goal: 'Generate creative content while maintaining coherence and originality',
    difficulty: 'Beginner' as const,
    isActive: true,
    isFeatured: false,
    totalPrizePool: 40.0,
    minimumBuildPower: 10.0
  },
  {
    id: 'code-review-automation-001',
    title: 'Code Review Automation',
    description: 'Build an AI that performs automated code reviews with actionable feedback and best practice recommendations.',
    goal: 'Provide accurate code analysis while maintaining developer productivity',
    difficulty: 'Advanced' as const,
    isActive: true,
    isFeatured: true,
    totalPrizePool: 120.0,
    minimumBuildPower: 45.0
  },
  {
    id: 'product-description-writer-001',
    title: 'Product Description Writer',
    description: 'Create an AI that writes compelling product descriptions that increase conversion rates.',
    goal: 'Generate persuasive content while maintaining factual accuracy',
    difficulty: 'Intermediate' as const,
    isActive: true,
    isFeatured: false,
    totalPrizePool: 60.0,
    minimumBuildPower: 20.0
  },
  {
    id: 'meeting-summary-generator-001',
    title: 'Meeting Summary Generator',
    description: 'Train an AI that automatically generates comprehensive meeting summaries and action items.',
    goal: 'Extract key insights efficiently while maintaining accuracy',
    difficulty: 'Beginner' as const,
    isActive: true,
    isFeatured: false,
    totalPrizePool: 45.0,
    minimumBuildPower: 12.0
  },
  {
    id: 'seo-content-optimizer-001',
    title: 'SEO Content Optimizer',
    description: 'Build an AI that optimizes content for search engines while maintaining readability.',
    goal: 'Balance SEO optimization with user experience and content quality',
    difficulty: 'Intermediate' as const,
    isActive: true,
    isFeatured: true,
    totalPrizePool: 70.0,
    minimumBuildPower: 22.0
  },
  {
    id: 'sentiment-analysis-tool-001',
    title: 'Sentiment Analysis Tool',
    description: 'Create an AI that accurately analyzes sentiment in text and provides emotional insights.',
    goal: 'Achieve high sentiment accuracy while handling nuanced emotional contexts',
    difficulty: 'Advanced' as const,
    isActive: true,
    isFeatured: false,
    totalPrizePool: 90.0,
    minimumBuildPower: 35.0
  }
];

// Challenge prize structure
const getChallengePrizes = (totalPrizePool: number, difficulty: string) => {
  const baseMultiplier = difficulty === 'Beginner' ? 1 : difficulty === 'Intermediate' ? 1.5 : 2;
  const adjustedPool = totalPrizePool * baseMultiplier;
  
  return [
    { position: 1, amount: adjustedPool * 0.5 },   // 50% for 1st place
    { position: 2, amount: adjustedPool * 0.3 },   // 30% for 2nd place
    { position: 3, amount: adjustedPool * 0.2 }    // 20% for 3rd place
  ];
};

// Default task configuration
const defaultTask = {
  constraints: {
    required: ['Professional tone', 'Clear communication'],
    forbidden: ['Offensive language', 'Misleading information'],
    optional: ['Creative flair', 'Personalization']
  },
  context: 'Professional business environment',
  objectives: ['Accuracy', 'Efficiency', 'User satisfaction']
};

// Default gameplay configuration
const defaultGameplay = {
  maxTurns: 5,
  timeLimitSeconds: 300,
  difficulty: 'adaptive',
  features: ['robustness', 'accuracy', 'creativity', 'efficiency']
};

// Default scoring configuration
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

// Default rewards configuration
const defaultRewards = {
  base_xp: 50,
  base_coins: 10,
  completion_bonus: {
    high_robustness: 15,
    perfect_run: 25
  }
};

async function main() {
  console.log('🌱 Starting database seeding for V2 challenge system...');

  try {
    // Clear existing data (excluding user data and better-auth tables)
    await prisma.build.deleteMany();
    await prisma.sessionPointMap.deleteMany();
    await prisma.sessionTool.deleteMany();
    await prisma.sessionCategory.deleteMany();
    await prisma.buildingSession.deleteMany();
    await prisma.buildingToolsSession.deleteMany();
    await prisma.miniModel.deleteMany();
    await prisma.rewardEligibility.deleteMany();
    await prisma.challengePrizes.deleteMany();
    await prisma.challenge.deleteMany();
    console.log('🗑️  Cleared existing challenge data');

    let totalChallenges = 0;
    let totalPrizes = 0;

    // Create challenges with V2 structure and prizes
    for (const template of challengeTemplates) {
      const challenge = await prisma.challenge.create({
        data: {
          id: template.id,
          title: template.title,
          description: template.description,
          goal: template.goal,
          difficulty: template.difficulty,
          version: 2, // Mark as V2
          isActive: template.isActive,
          isFeatured: template.isFeatured,
          task: defaultTask,
          gameplay: defaultGameplay,
          scoring: defaultScoring,
          rewards: defaultRewards,
          rewardZoneType: 'top_n',
          rewardZoneValue: 3,
          totalPrizePool: template.totalPrizePool,
          minimumBuildPower: template.minimumBuildPower
        }
      });

      // Create challenge prizes
      const prizes = getChallengePrizes(template.totalPrizePool, template.difficulty);
      for (const prize of prizes) {
        await prisma.challengePrizes.create({
          data: {
            challengeId: challenge.id,
            position: prize.position,
            amount: prize.amount
          }
        });
        totalPrizes++;
      }

      totalChallenges++;
      console.log(`✅ Created V2 challenge: ${challenge.title}`);
      console.log(`   📋 ID: ${challenge.id}`);
      console.log(`   🎯 Goal: ${template.goal}`);
      console.log(`   📈 Difficulty: ${template.difficulty}`);
      console.log(`   ⭐ Featured: ${template.isFeatured ? 'Yes' : 'No'}`);
      console.log(`   💰 Prize Pool: $${template.totalPrizePool}`);
      console.log(`   ⚡ Minimum Build Power: ${template.minimumBuildPower}`);
      console.log(`   🏆 Prizes: 1st=$${prizes[0].amount}, 2nd=$${prizes[1].amount}, 3rd=$${prizes[2].amount}`);
      console.log('');
    }

    console.log(`🎉 Successfully seeded ${totalChallenges} V2 challenges with ${totalPrizes} prize positions!`);
    console.log('\n📊 Summary:');
    
    const totalChallengeCount = await prisma.challenge.count();
    console.log(`   Total Challenges: ${totalChallengeCount}`);
    
    const featuredCount = await prisma.challenge.count({
      where: { isFeatured: true }
    });
    console.log(`   Featured Challenges: ${featuredCount}`);

    const totalPrizePool = await prisma.challenge.aggregate({
      _sum: { totalPrizePool: true }
    });
    console.log(`   Total Prize Pool: $${totalPrizePool._sum.totalPrizePool || 0}`);

    console.log('\n🎯 Challenge Breakdown by Difficulty:');
    const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
    for (const difficulty of difficulties) {
      const count = await prisma.challenge.count({
        where: { difficulty }
      });
      const poolSum = await prisma.challenge.aggregate({
        where: { difficulty },
        _sum: { totalPrizePool: true }
      });
      console.log(`   ${difficulty}: ${count} challenges ($${poolSum._sum.totalPrizePool || 0} total prizes)`);
    }

    console.log('\n🏆 Prize Distribution:');
    const prizeStats = await prisma.challengePrizes.groupBy({
      by: ['position'],
      _count: { position: true },
      _sum: { amount: true }
    });
    for (const stat of prizeStats) {
      console.log(`   ${stat.position === 1 ? '1st' : stat.position === 2 ? '2nd' : '3rd'} Place: ${stat._count.position} prizes totaling $${stat._sum.amount || 0}`);
    }

    console.log('\n🔧 V2 Features Overview:');
    console.log('   ✅ Session-based building system (replaces Chat/Message)');
    console.log('   ✅ Challenge prizes with tiered rewards');
    console.log('   ✅ Feature-based scoring (robustness, accuracy, stability, creativity, efficiency)');
    console.log('   ✅ Dynamic difficulty curves');
    console.log('   ✅ Penalty system (hallucination risk, over creativity, latency)');
    console.log('   ✅ Feature caps for balanced gameplay');
    console.log('   ✅ Archetype selection system');
    console.log('   ✅ Advanced synergy and order rules');
    console.log('   ✅ Minimum build power requirements for challenge difficulty');

    console.log('\n🔧 Next Steps:');
    console.log('   1. Use session start endpoint to create building sessions');
    console.log('   2. The AI will generate 15-25 tools with feature values per session');
    console.log('   3. Each session gets 3-5 categories with v2 synergy and order rules');
    console.log('   4. Point maps include complete v2 data structure');
    console.log('   5. Users can select archetypes for strategic gameplay');
    console.log('   6. Real-time feature display shows model capabilities');
    console.log('   7. Sessions are closed after each build and can be recreated');
    console.log('   8. Top performers earn challenge prizes based on their ranking');

    console.log('\n✨ V2 Seeder completed successfully!');
    console.log('🚀 Challenges are ready for V2 feature-based tool-building system with prizes!');
    
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
