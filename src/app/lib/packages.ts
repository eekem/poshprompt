export interface Package {
  id: string
  name: string
  prompts: number
  price: number
  currency: string
  popular?: boolean
  description?: string
  pricePerPrompt: number
}

export const PACKAGES: Package[] = [
  { 
    id: 'starter', 
    name: 'Starter Pack', 
    prompts: 20, 
    price: 3.00, 
    currency: 'USD',
    description: 'Perfect for getting started',
    pricePerPrompt: 0.15
  },
  { 
    id: 'pro', 
    name: 'Pro Pack', 
    prompts: 40, 
    price: 5.00, 
    currency: 'USD', 
    popular: true,
    description: 'Most popular choice',
    pricePerPrompt: 0.125
  },
  { 
    id: 'master', 
    name: 'Master Pack', 
    prompts: 90, 
    price: 10.00, 
    currency: 'USD',
    description: 'Great for regular users',
    pricePerPrompt: 0.111
  },
  { 
    id: 'ultimate', 
    name: 'Ultimate Pack', 
    prompts: 200, 
    price: 20.00, 
    currency: 'USD',
    description: 'Best value for power users',
    pricePerPrompt: 0.10
  },
]