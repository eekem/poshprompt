# PoshPrompt API Documentation

## Overview

The PoshPrompt API provides a comprehensive system for running AI-powered challenges across 5 different game types: image, text, transformation, refinement, and evaluation. This API handles chat interactions, scoring, and database persistence.

## API Endpoint

**POST** `/api/run_challenge`

## Authentication

The API expects a valid user session. Ensure the user is authenticated before making requests.

## Request Body

```typescript
interface ChatRequest {
  userId: string;           // User ID from your auth system
  challengeId: string;       // Challenge ID from the database
  prompt: string;           // User's input prompt
  turnNumber?: number;      // Current turn number (for refinement challenges)
  previousOutputs?: string[]; // Array of previous outputs (for refinement challenges)
}
```

## Response Body

```typescript
interface ChatResponse {
  chatId: string;           // Unique ID for this chat interaction
  output: string;           // AI-generated output
  score_text: string;       // Human-readable score explanation
  breakdown: ScoreBreakdown; // Detailed score breakdown
  turnNumber: number;       // Current turn number
}

interface ScoreBreakdown {
  constraint_accuracy: number;  // How well required/forbidden constraints were met
  clarity: number;             // Readability and sentence structure
  creativity: number;          // Vocabulary diversity and originality
  brevity: number;             // Conciseness and efficiency
  improvement_per_turn?: number; // For refinement challenges only
  correctness?: number;         // For evaluation challenges only
  explanation_quality?: number; // For evaluation challenges only
}
```

## Game Types

### 1. Image Generation
- **Purpose**: Generate images based on text prompts
- **Scoring**: Based on constraint adherence, clarity, creativity, and brevity
- **Output**: Base64-encoded image data

### 2. Text Generation
- **Purpose**: Generate text responses to prompts
- **Scoring**: Based on constraint adherence, clarity, creativity, and brevity
- **Output**: Generated text

### 3. Transformation
- **Purpose**: Transform input from one format to another (e.g., text to JSON)
- **Scoring**: Emphasis on constraint accuracy and correctness
- **Output**: Transformed content

### 4. Refinement (Turn-based)
- **Purpose**: Iteratively improve AI outputs across multiple turns
- **Scoring**: Based on improvement per turn, constraint accuracy, and brevity
- **Features**: 
  - Supports multiple turns (configurable max turns)
  - Each turn builds upon previous outputs
  - Scoring considers improvement over previous attempts

### 5. Evaluation
- **Purpose**: Act as a judge to rank and score multiple AI outputs
- **Scoring**: Based on correctness of ranking and explanation quality
- **Output**: Ranked evaluation with explanations

## Database Schema

### Challenge Model
```typescript
interface Challenge {
  id: string;
  title: string;
  description: string;
  gameType: 'image' | 'text' | 'transformation' | 'refinement' | 'evaluation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  modelType: 'image_generation' | 'text_generation';
  modelName: string;
  task: {
    objective: string;
    constraints: {
      required: string[];
      forbidden: string[];
      optional: string[];
    };
  };
  gameplay: {
    turnBased: boolean;
    maxTurns?: number;
    timeLimitSeconds: number;
    scoringMode: 'constraint_based' | 'quality_score' | 'refinement_score' | 'ranking';
  };
  scoring: {
    totalScore: number;
    breakdown: ScoreBreakdown;
  };
  rewards: {
    xp: number;
    coins: number;
  };
}
```

### Chat Model
```typescript
interface Chat {
  id: string;
  userId: string;
  challengeId: string;
  prompt: string;
  output: string;
  score: number;
  breakdown: ScoreBreakdown;
  turnNumber: number;
  createdAt: Date;
}
```

## Usage Examples

### Basic Text Challenge
```javascript
const response = await fetch('/api/run_challenge', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userId: 'user_123',
    challengeId: 'text-001',
    prompt: 'Create a 5-tweet thread about climate change'
  })
});

const result = await response.json();
console.log(result.output); // AI-generated tweet thread
console.log(result.score_text); // "Score: 85/100. All required constraints met..."
```

### Refinement Challenge (Multi-turn)
```javascript
// Turn 1
const turn1Response = await fetch('/api/run_challenge', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user_123',
    challengeId: 'refine-001',
    prompt: 'Write a product description',
    turnNumber: 1
  })
});

const turn1Result = await turn1Response.json();

// Turn 2 (with previous output)
const turn2Response = await fetch('/api/run_challenge', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user_123',
    challengeId: 'refine-001',
    prompt: 'Make it more concise and professional',
    turnNumber: 2,
    previousOutputs: [turn1Result.output]
  })
});
```

### Image Generation Challenge
```javascript
const response = await fetch('/api/run_challenge', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user_123',
    challengeId: 'img-001',
    prompt: 'African founder with studio lighting and warm amber tones'
  })
});

const result = await response.json();
console.log(result.output); // Base64 image data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- **400**: Bad Request - Missing required fields or invalid input
- **404**: Not Found - Challenge not found
- **500**: Internal Server Error - Database or AI generation errors

```typescript
interface ErrorResponse {
  error: string; // Human-readable error message
}
```

## Environment Variables

Required environment variables:

```env
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
DATABASE_URL=your_postgresql_database_url_here
```

## Dependencies

The API requires the following packages:

- `@huggingface/inference` - For AI model inference
- `@prisma/client` - For database operations
- `next` - Next.js framework

## Scoring Algorithm

The scoring system evaluates outputs based on multiple dimensions:

1. **Constraint Accuracy** (40-60% of total score)
   - Required constraints must be present
   - Forbidden constraints must be absent
   - Penalizes violations

2. **Clarity** (20-30% of total score)
   - Sentence structure and readability
   - Optimal sentence length (15-25 words)

3. **Creativity** (10-20% of total score)
   - Vocabulary diversity
   - Originality of expression

4. **Brevity** (10-30% of total score)
   - Conciseness and efficiency
   - Optimal length for the task type

5. **Special Scoring** (Game-specific)
   - **Refinement**: Improvement over previous turns
   - **Evaluation**: Correctness of rankings and explanation quality

## GET Endpoint

**GET** `/api/run_challenge?userId=USER_ID&challengeId=CHALLENGE_ID`

Retrieves all chat history for a specific user and challenge, ordered by turn number.

```typescript
interface ChatHistoryResponse {
  chats: Chat[];
}
```

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install @huggingface/inference
   ```

2. Set up environment variables:
   ```bash
   echo "HUGGINGFACE_API_KEY=your_key_here" >> .env.local
   ```

3. Run database migrations:
   ```bash
   npm run prisma:migrate
   ```

4. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Production Considerations

- Ensure proper rate limiting for Hugging Face API calls
- Implement caching for frequently accessed challenges
- Monitor API usage and costs
- Set up proper error logging and monitoring
- Consider implementing request timeouts for long-running AI generations
