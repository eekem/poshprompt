'use client'

import React, { useState } from 'react'

interface Plan {
  id: string
  name: string
  level: string
  price: number
  coins: number
  features: string[]
  popular?: boolean
  custom?: boolean
}

interface PlanSelectionProps {
  onPlanSelect: (plan: Plan) => void
  selectedPlan?: Plan | null
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    level: 'Entry Level',
    price: 5,
    coins: 50,
    features: [
      'Access to basic prompts',
      'Entry to 2 competitions'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Creator',
    level: 'Professional',
    price: 20,
    coins: 250,
    features: [
      'Priority prompt access',
      'Entry to 12 competitions',
      'Bonus participation points'
    ],
    popular: true
  },
  {
    id: 'grandmaster',
    name: 'Grandmaster',
    level: 'Mastery',
    price: 75,
    coins: 1000,
    features: [
      'Exclusive NFT badges',
      'Entry to 50 competitions',
      '10% extra reward multiplier'
    ]
  },
  {
    id: 'custom',
    name: 'Custom Bundle',
    level: '',
    price: 0,
    coins: 0,
    features: [],
    custom: true
  }
]

export default function PlanSelection({ onPlanSelect, selectedPlan }: PlanSelectionProps) {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)

  return (
    <div className="mb-8 sm:mb-12 lg:mb-14">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="h-6 w-1 bg-primary rounded-full"></div>
        <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider">Select a Coin Bundle</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`group relative flex flex-col gap-4 sm:gap-6 rounded-xl border ${
              plan.popular 
                ? 'border-2 border-primary shadow-2xl shadow-primary/10 transform lg:-translate-y-4' 
                : plan.custom
                ? 'border-dashed border-[#544c3b] bg-[#27231b]/50'
                : 'border-solid border-[#544c3b] bg-surface-dark/40'
            } p-4 sm:p-6 lg:p-8 transition-all hover:border-primary/50 cursor-pointer ${
              selectedPlan?.id === plan.id ? 'border-primary ring-1 ring-primary' : ''
            }`}
            onMouseEnter={() => setHoveredPlan(plan.id)}
            onMouseLeave={() => setHoveredPlan(null)}
            onClick={() => !plan.custom && onPlanSelect(plan)}
          >
            {plan.popular && (
              <div className="absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2 bg-primary text-slate-900 text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-3 sm:px-4 py-1 rounded-full">
                Most Popular
              </div>
            )}
            
            {plan.custom ? (
              <>
                <div className="bg-primary/10 p-3 sm:p-4 rounded-full mb-2">
                  <span className="material-symbols-outlined text-primary text-[28px] sm:text-[32px]">settings_input_component</span>
                </div>
                <div className="text-center">
                  <h3 className="text-white text-base sm:text-lg font-bold">{plan.name}</h3>
                  <p className="text-[#bab09c] text-sm mt-1">Need a specific amount? Configure your own pack.</p>
                </div>
                <button className="text-primary font-bold text-sm underline underline-offset-4">Contact Sales</button>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <span className="text-[#bab09c] text-xs font-bold uppercase tracking-widest">{plan.level}</span>
                  <h3 className="text-white text-lg sm:text-xl font-bold leading-tight">{plan.name}</h3>
                  <p className="flex items-baseline gap-2 mt-2">
                    <span className="text-white text-4xl sm:text-5xl font-black leading-tight tracking-tight">${plan.price}</span>
                    <span className="text-primary text-sm sm:text-base font-bold">{plan.coins} Coins</span>
                  </p>
                </div>
                
                <button className={`flex items-center justify-center w-full rounded-lg h-10 sm:h-12 text-sm font-bold transition-colors ${
                  selectedPlan?.id === plan.id
                    ? 'bg-primary text-slate-900 shadow-lg shadow-primary/30'
                    : plan.popular
                    ? 'bg-primary text-slate-900 shadow-lg shadow-primary/30'
                    : 'bg-[#27231b] text-white hover:bg-primary hover:text-white'
                }`}>
                  {selectedPlan?.id === plan.id ? 'Selected' : plan.popular ? 'Selected' : 'Select Bundle'}
                </button>
                
                <div className="flex flex-col gap-2 sm:gap-3 pt-2 border-t border-[#393328]">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 sm:gap-3 text-[#bab09c] text-sm">
                      <span className="material-symbols-outlined text-primary text-[18px] sm:text-[20px] shrink-0">
                        {plan.popular && index === 0 ? 'verified' : plan.id === 'grandmaster' && index === 0 ? 'star' : 'check_circle'}
                      </span>
                      <span className="text-xs sm:text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
