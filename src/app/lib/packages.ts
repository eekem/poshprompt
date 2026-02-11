export interface Package {
  id: string
  name: string
  prompts: number
  price: number
  currency: string
  popular?: boolean
  description?: string
  pricePerPrompt: number
  billing?: string
  features?: string[]
}

export const PACKAGES: Package[] = [
  { 
    id: 'starter', 
    name: 'Starter Pack', 
    prompts: 20, 
    price: 3.00, 
    currency: 'USD',
    description: 'Perfect for getting started',
    pricePerPrompt: 0.15,
    billing: 'month',
    features: ['20 AI prompts', 'Basic challenges', 'Community access']
  },
  { 
    id: 'pro', 
    name: 'Pro Pack', 
    prompts: 40, 
    price: 5.00, 
    currency: 'USD', 
    popular: true,
    description: 'Most popular choice',
    pricePerPrompt: 0.125,
    billing: 'month',
    features: ['40 AI prompts', 'Advanced challenges', 'Priority support', 'Analytics dashboard']
  },
  { 
    id: 'master', 
    name: 'Master Pack', 
    prompts: 90, 
    price: 10.00, 
    currency: 'USD',
    description: 'Great for regular users',
    pricePerPrompt: 0.111,
    billing: 'month',
    features: ['90 AI prompts', 'All challenges', 'Priority support', 'Advanced analytics', 'Custom themes']
  },
  { 
    id: 'ultimate', 
    name: 'Ultimate Pack', 
    prompts: 200, 
    price: 20.00, 
    currency: 'USD',
    description: 'Best value for power users',
    pricePerPrompt: 0.10,
    billing: 'month',
    features: ['200 AI prompts', 'Unlimited challenges', '24/7 support', 'Full analytics', 'Custom themes', 'API access']
  },
]