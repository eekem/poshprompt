"use client";

import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { PACKAGES, Package } from "@/app/lib/packages";

interface Message {
  id: string;
  type: 'system' | 'user' | 'ai';
  content: string;
  timestamp: Date;
  evaluation?: {
    passed: boolean;
    score: number;
    constraints_met: number;
    creativity: number;
    efficiency: number;
  };
}

const modelBuildingChallenges = [
  {
    id: 'savage-reviewer',
    title: 'Savage Code Reviewer',
    description: 'Build a mini-AI that delivers funny, technically accurate, and actionable code reviews without being toxic.',
    tools: ['Code Analysis', 'Humor Engine', 'Professional Tone'],
    difficulty: 'Intermediate',
    estimatedTime: '25 min',
    maxPrompts: 40
  },
  {
    id: 'breakup-advisor',
    title: 'Emotional Breakup Advisor',
    description: 'Train a mini-AI that helps users write kind, clear, and emotionally intelligent breakup messages.',
    tools: ['Empathy Module', 'Communication Coach', 'Ethics Guard'],
    difficulty: 'Intermediate', 
    estimatedTime: '20 min',
    maxPrompts: 30
  },
  {
    id: 'spec-writer',
    title: 'Chaos Ticket → Bulletproof Spec',
    description: 'Transform vague, messy tickets into clean, complete product specifications.',
    tools: ['Requirements Parser', 'Stakeholder Manager', 'Technical Writer'],
    difficulty: 'Advanced',
    estimatedTime: '35 min',
    maxPrompts: 45
  }
];

export default function Home() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(modelBuildingChallenges[0]);
  const [modelStrength, setModelStrength] = useState({
    baseScore: 25,
    diversityBonus: 15,
    synergyBonus: 10,
    totalStrength: 50,
    remainingPrompts: 35
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize with system message
    const systemMessage: Message = {
      id: 'system-1',
      type: 'system',
      content: `Welcome to the "${currentChallenge.title}" challenge. ${currentChallenge.description}`,
      timestamp: new Date()
    };
    setMessages([systemMessage]);
  }, [currentChallenge]);

  const simulateAIResponse = (userPrompt: string): Message => {
    // Simulate AI response based on the challenge
    const responses = {
      'creative-constraint': [
        'Silent river flows,\nWatching eyes in shadows deep,\nSafe beneath the stone.',
        'Digital garden grows,\nIron fences guard the blooms,\nNight brings gentle rain.',
        'Ocean waves protect,\nPearls of wisdom hide within,\nShells guard treasures well.'
      ],
      'technical-explanation': [
        'Machine learning is like baking a cake. You show the chef many examples of good cakes, and eventually they learn to make new ones that taste just as good, even if they\'ve never seen the recipe before.',
        'Think of it like teaching someone to cook. You let them taste many different soups, and soon they can tell what ingredients are in a new soup just by smelling it.',
        'It\'s like making pizza dough. The more you work with it, the better you understand how it should feel and behave, even when you try new toppings.'
      ],
      'creative-writing': [
        'The old violin hummed a strange melody when Sarah drew the bow across its strings. Suddenly the room shimmered, and she found herself in a Victorian ballroom where dancers moved in reverse, their steps retracing yesterday\'s waltz.',
        'Marcus struck a chord on his guitar, and the air rippled like water. He saw himself as a child, reaching for a toy that had fallen behind the sofa. The note sustained, and the moment stretched, allowing him to pluck the toy from the past.',
        'The piano keys danced beneath Eleanor\'s fingers, playing a jazz standard she\'d never learned. With each verse, the parlor transformed - first into a speakeasy from the 1920s, then a future café where patrons ordered memories instead of coffee.'
      ]
    };

    const challengeResponses = responses[currentChallenge.id as keyof typeof responses] || responses['creative-constraint'];
    const randomResponse = challengeResponses[Math.floor(Math.random() * challengeResponses.length)];

    // Simulate evaluation
    const passed = Math.random() > 0.3; // 70% success rate
    const evaluation = {
      passed,
      score: passed ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 30) + 50,
      constraints_met: Math.floor(Math.random() * 30) + 70,
      creativity: Math.floor(Math.random() * 40) + 60,
      efficiency: Math.floor(Math.random() * 35) + 65
    };

    // Update model strength
    setModelStrength({
      baseScore: Math.floor(Math.random() * 30) + 40,
      diversityBonus: Math.floor(Math.random() * 20) + 10,
      synergyBonus: Math.floor(Math.random() * 15) + 5,
      totalStrength: Math.floor(Math.random() * 40) + 60,
      remainingPrompts: Math.max(0, modelStrength.remainingPrompts - 1)
    });

    return {
      id: `ai-${Date.now()}`,
      type: 'ai' as const,
      content: randomResponse,
      timestamp: new Date(),
      evaluation
    };
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = simulateAIResponse(inputValue);
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return (
    <Layout>
      {/* Hero Section */}
      <section id="hero" className="relative pt-16 pb-12 md:pt-32 md:pb-24 px-4 sm:px-6 overflow-hidden">
        {/* Background Gradient Effect */}
        <div className="absolute inset-0 pointer-events-none hero-gradient"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-4 sm:gap-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-xs font-medium text-primary uppercase tracking-wider">New Game Mode</span>
          </div>
          <h1 className="text-white text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight max-w-3xl sm:max-w-4xl" style={{ textShadow: '0 0 20px rgba(245, 159, 10, 0.2)' }}>
            Build. Strategize. <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-amber-200">Outsmart the AI.</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-lg sm:max-w-2xl mx-auto px-2">
            A competitive AI-building game where you strategically combine mini-model tools to create the strongest possible AI solution for each challenge.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 w-full max-w-sm sm:max-w-none justify-center">
            <button className="flex cursor-pointer items-center justify-center rounded-lg h-11 sm:h-12 px-6 sm:px-8 bg-primary hover:bg-amber-400 transition-all text-[#231c10] text-sm sm:text-base font-bold tracking-wide shadow-[0_0_20px_rgba(245,159,10,0.4)] hover:shadow-[0_0_30px_rgba(245,159,10,0.6)] w-full sm:w-auto" onClick={() => router.push('/challenges')}>
              Start Building
            </button>
            <button className="flex cursor-pointer items-center justify-center rounded-lg h-11 sm:h-12 px-6 sm:px-8 bg-panel-dark border border-border-dark hover:border-primary/50 text-white text-sm sm:text-base font-medium transition-all group w-full sm:w-auto" onClick={() => router.push('/how-it-works')}>
              <span className="material-symbols-outlined mr-2 group-hover:text-primary transition-colors text-lg sm:text-xl">play_circle</span>
              Learn Strategy
            </button>
          </div>
          {/* Social Proof */}
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-sm text-slate-500">
            <div className="flex -space-x-2 sm:-space-x-3">
              <div className="size-6 sm:size-8 rounded-full border-2 border-background-dark bg-slate-700 bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDo1thSsr3_anXX2lk4NKnfMi1GvFAc3TpqF6Gin2XIc_VTjlRAcbjPhK7G3TvZTaD2NCCqMv5WpWYxe9o9V2-HPvFhtBYZbpQeJBe2yIRHuM8rTqeOqJK7WM0RgfUhMrdzJZrnZL2ELtjLI0-zJ50vpiyaqofIBsz32zySBnh0Xhrx4qI8ALxl7sAtGHhMFl7lP-LhB3kzfeGC_qQ6icu1EHlSPMXMlEU22cqajQBdxzEj8MpJ2BmENkfGbBz2pxTrJij0364mwGo_")'}}></div>
              <div className="size-6 sm:size-8 rounded-full border-2 border-background-dark bg-slate-600 bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAibaPDwDsmAlv6TRq1q_kD_ULvpVc2thENO8wyBD0LIfwLKO24T_gVUF_6KphPgXC2eTd8EySM4Jw7FYJfHJsqz41eOwHKh0F1HHKYvYwFFVRLd_v2kV_aJ7AbRDCVU7OeBR9M_Rglv1b92z34I0va_2VMS04-GlT2cTI5-RRKFIJlAT2O_ekUx4JmSINB1RwUTTlwPXKgeWLDAOI3wXQF95V9HQZhcBXmZuDEpWbP4W3G3lM7wYzO_YG68revU51QKX8yjRiqza68")'}}></div>
              <div className="size-6 sm:size-8 rounded-full border-2 border-background-dark bg-slate-500 bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCh3ejb1vgsGAhEDq_ld78TpWl1TAXhwO2zT1YU7lmgzmJY0x32jkaUB0LswJ5YMJJuxOUTdzljPLMkpPh8DMJay_uF37k1rtJYHW3_DoicY1uyzgXR2I2cAxrXc6WYWeRIxRKboJ7o4t0_L3q_Z837BFGTIg2APq0dMgTE9ArNq_pkjVEhNeW-fnCgkKhkagMxfXep0DhmLh0izbiI9jB0HDwZf6DbrIuExQVkhbkPK8Rr_Yg-WfNXGhoitaJ4qPg_WXovxrFsiPr0")'}}></div>
              <div className="size-6 sm:size-8 rounded-full border-2 border-background-dark bg-panel-dark text-xs flex items-center justify-center font-medium text-white">+2k</div>
            </div>
            <p className="text-center sm:text-left">Join 5,000+ Strategic Builders competing daily</p>
          </div>
        </div>
      </section>

      {/* Interactive Model Building Demo */}
      <section id="demo" className="px-4 sm:px-6 pb-16 sm:pb-20 max-w-6xl mx-auto w-full">
        <div className="relative rounded-xl border border-border-dark bg-panel-dark overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 border-b border-border-dark bg-background-dark px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex gap-1.5">
              <div className="size-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
              <div className="size-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
              <div className="size-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
            </div>
            <div className="ml-2 sm:ml-4 text-xs font-mono text-slate-500 truncate">{currentChallenge.id}-builder.ts</div>
            <div className="ml-auto flex gap-1 sm:gap-2 overflow-x-auto">
              {modelBuildingChallenges.map((challenge) => (
                <button
                  key={challenge.id}
                  onClick={() => setCurrentChallenge(challenge)}
                  className={`px-2 py-1 text-xs rounded transition-colors whitespace-nowrap shrink-0 ${
                    currentChallenge.id === challenge.id
                      ? 'bg-primary text-black'
                      : 'bg-background-dark text-slate-400 hover:text-primary'
                  }`}
                >
                  <span className="hidden sm:inline">{challenge.title}</span>
                  <span className="sm:hidden">{challenge.id === 'savage-reviewer' ? 'Savage' : challenge.id === 'breakup-advisor' ? 'Breakup' : 'Spec'}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 min-h-[500px] sm:min-h-[600px]">
            {/* Model Building Interface */}
            <div className="xl:col-span-2 flex flex-col bg-[#0f0e0c]">
              {/* Challenge Header */}
              <div className="border-b border-border-dark bg-background-dark p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-white mb-2">{currentChallenge.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{currentChallenge.description}</p>
                  </div>
                  <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500">Difficulty:</span>
                      <span className={`px-2 py-1 rounded font-medium text-xs ${
                        currentChallenge.difficulty === 'Advanced' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        currentChallenge.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}>
                        {currentChallenge.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500">Time:</span>
                      <span className="text-slate-300">{currentChallenge.estimatedTime}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tools Selection Area */}
              <div className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto">
                <div className="mb-4 sm:mb-6">
                  <h4 className="text-sm font-bold text-white mb-2 sm:mb-3">Available Tools</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2 sm:gap-3">
                    {currentChallenge.tools.map((tool: string, index: number) => (
                      <div key={tool} className="group relative">
                        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-border-dark bg-panel-dark hover:border-primary/40 transition-all cursor-pointer">
                          <div className="size-6 sm:size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-xs sm:text-sm text-primary">build</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs sm:text-sm font-semibold text-white truncate">{tool}</h5>
                            <p className="text-xs text-slate-400">Cost: {Math.floor(Math.random() * 5) + 3} prompts</p>
                          </div>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 text-xs bg-primary text-black rounded font-medium flex-shrink-0">
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Selected Tools */}
                <div className="mb-4 sm:mb-6">
                  <h4 className="text-sm font-bold text-white mb-2 sm:mb-3">Your Model Configuration</h4>
                  <div className="p-3 sm:p-4 rounded-lg border border-primary/30 bg-primary/5">
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
                      <span className="px-2 sm:px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs rounded-full">
                        Code Analysis (4 prompts)
                      </span>
                      <span className="px-2 sm:px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs rounded-full">
                        Humor Engine (3 prompts)
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Total Cost:</span>
                      <span className="text-primary font-bold">7 prompts</span>
                    </div>
                  </div>
                </div>
                
                {/* Build Button */}
                <button className="w-full py-2 sm:py-3 bg-primary hover:bg-amber-400 text-black rounded-lg font-bold transition-colors shadow-lg shadow-primary/20 text-sm sm:text-base">
                  Build Model (7 prompts)
                </button>
              </div>
            </div>
            {/* Side Panel / Resources & Strategy */}
            <div className="hidden lg:flex flex-col bg-panel-dark p-4 lg:p-6 gap-4 lg:gap-6">
              {/* Resource Status */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 lg:mb-4">Your Resources</h3>
                <div className="space-y-2 lg:space-y-3">
                  <div className="p-2 lg:p-3 rounded-lg border border-border-dark bg-background-dark">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm text-slate-300">Available Prompts</span>
                      <span className="text-base lg:text-lg font-bold text-primary">{modelStrength.remainingPrompts}</span>
                    </div>
                    <div className="h-1.5 lg:h-2 w-full bg-background-dark rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-500" style={{width: `${(modelStrength.remainingPrompts / 40) * 100}%`}}></div>
                    </div>
                  </div>
                  <div className="p-2 lg:p-3 rounded-lg border border-border-dark bg-background-dark">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-slate-300">Current Build Cost</span>
                      <span className="text-base lg:text-lg font-bold text-amber-400">7</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Model Strength Preview */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 lg:mb-4">Model Strength Preview</h3>
                <div className="space-y-2 lg:space-y-3">
                  <div>
                    <div className="flex justify-between text-xs sm:text-sm mb-1">
                      <span className="text-slate-300">Base Score</span>
                      <span className="text-primary font-mono text-xs sm:text-sm">{modelStrength.baseScore}</span>
                    </div>
                    <div className="h-1 lg:h-1.5 w-full bg-background-dark rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-500" style={{width: `${modelStrength.baseScore}%`}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs sm:text-sm mb-1">
                      <span className="text-slate-300">Diversity Bonus</span>
                      <span className="text-primary font-mono text-xs sm:text-sm">+{modelStrength.diversityBonus}</span>
                    </div>
                    <div className="h-1 lg:h-1.5 w-full bg-background-dark rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 transition-all duration-500" style={{width: `${modelStrength.diversityBonus}%`}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs sm:text-sm mb-1">
                      <span className="text-slate-300">Synergy Bonus</span>
                      <span className="text-primary font-mono text-xs sm:text-sm">+{modelStrength.synergyBonus}</span>
                    </div>
                    <div className="h-1 lg:h-1.5 w-full bg-background-dark rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 transition-all duration-500" style={{width: `${modelStrength.synergyBonus}%`}}></div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border-dark">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-white font-bold">Total Strength</span>
                      <span className="text-base lg:text-lg font-bold text-primary">{modelStrength.totalStrength}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Strategy Tips */}
              <div className="border-t border-border-dark pt-4 lg:pt-6 mt-auto">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 lg:mb-3">Strategy Tips</h3>
                <div className="space-y-1 lg:space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-primary text-xs mt-0.5">•</span>
                    <p className="text-xs text-slate-400">Diverse tools give better bonuses</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary text-xs mt-0.5">•</span>
                    <p className="text-xs text-slate-400">Save prompts for harder challenges</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary text-xs mt-0.5">•</span>
                    <p className="text-xs text-slate-400">Some tools synergize well together</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile Resources Bar */}
            <div className="lg:hidden border-t border-border-dark bg-panel-dark p-3 sm:p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Prompts:</span>
                  <span className="text-sm font-bold text-primary">{modelStrength.remainingPrompts}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Cost:</span>
                  <span className="text-sm font-bold text-amber-400">7</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Strength:</span>
                <span className="text-sm font-bold text-primary">{modelStrength.totalStrength}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-10 bg-[#0d0c0a] border-y border-border-dark/50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">Why PoshPrompt?</h2>
            <p className="text-slate-400 max-w-lg sm:max-w-2xl text-base sm:text-lg">Experience the future of AI construction with our strategic resource management gameplay.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Feature 1 */}
            <div className="group flex flex-col gap-3 sm:gap-4 rounded-xl border border-border-dark bg-panel-dark p-6 sm:p-8 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
              <div className="size-10 sm:size-12 rounded-lg bg-background-dark border border-border-dark flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background-dark transition-colors">
                <span className="material-symbols-outlined text-xl sm:text-2xl">construction</span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Strategic Tool Combination</h3>
                <p className="text-slate-400 leading-relaxed text-sm sm:text-base">Combine mini-model tools intelligently to create powerful AI solutions. Each tool costs prompts, so choose wisely.</p>
              </div>
            </div>
            {/* Feature 2 */}
            <div className="group flex flex-col gap-3 sm:gap-4 rounded-xl border border-border-dark bg-panel-dark p-6 sm:p-8 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
              <div className="size-10 sm:size-12 rounded-lg bg-background-dark border border-border-dark flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background-dark transition-colors">
                <span className="material-symbols-outlined text-xl sm:text-2xl">psychology</span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Resource Management</h3>
                <p className="text-slate-400 leading-relaxed text-sm sm:text-base">Every build costs prompts. Manage your limited resources carefully to maximize your model's strength and score.</p>
              </div>
            </div>
            {/* Feature 3 */}
            <div className="group flex flex-col gap-3 sm:gap-4 rounded-xl border border-border-dark bg-panel-dark p-6 sm:p-8 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
              <div className="size-10 sm:size-12 rounded-lg bg-background-dark border border-border-dark flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background-dark transition-colors">
                <span className="material-symbols-outlined text-xl sm:text-2xl">leaderboard</span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Skill-Based Scoring</h3>
                <p className="text-slate-400 leading-relaxed text-sm sm:text-base">Compete based on strategy and intelligence, not grinding. Your model's strength determines your ranking.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What PoshPrompt Is/Is Not Section */}
      <section id="what-is-poshprompt" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 bg-[#0d0c0a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">What PoshPrompt Is</h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
              Understanding the difference between our strategic AI-building game and other AI platforms.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {/* What it IS */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-primary mb-6">PoshPrompt IS:</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 text-green-500 text-2xl">✅</span>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">A strategic AI construction game</h4>
                    <p className="text-slate-400 text-sm">Build AI models using limited tools and compete based on how intelligently you combine them.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 text-green-500 text-2xl">✅</span>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">A resource management challenge</h4>
                    <p className="text-slate-400 text-sm">Each build costs prompts. Each session is unpredictable. Each model is scored for strength.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 text-green-500 text-2xl">✅</span>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">A replayable AI meta-layer</h4>
                    <p className="text-slate-400 text-sm">The smarter your strategy, the stronger your model. Every session offers new challenges.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 text-green-500 text-2xl">✅</span>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">Skill-based scoring</h4>
                    <p className="text-slate-400 text-sm">Compete based on strategy and intelligence, not grinding or farming leaderboards.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* What it IS NOT */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-red-500 mb-6">PoshPrompt is NOT:</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 text-red-500 text-2xl">❌</span>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">A chatbot</h4>
                    <p className="text-slate-400 text-sm">We're not another conversational AI or virtual assistant.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 text-red-500 text-2xl">❌</span>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">A GPT wrapper</h4>
                    <p className="text-slate-400 text-sm">We're not just a frontend for existing language models.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 text-red-500 text-2xl">❌</span>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">A prompt playground</h4>
                    <p className="text-slate-400 text-sm">We're not a simple tool for testing prompts without purpose.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 text-red-500 text-2xl">❌</span>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">A leaderboard farming app</h4>
                    <p className="text-slate-400 text-sm">Success comes from strategic thinking, not from grinding or exploiting mechanics.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 bg-background-dark">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Choose Your Prompts</h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
              Every model build costs prompts. Choose the right package for your strategic gameplay style.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {PACKAGES.map((pkg) => (
              <div key={pkg.id} className={`relative rounded-2xl border bg-panel-dark p-6 sm:p-8 hover:border-primary/40 transition-all duration-300 ${
                pkg.popular ? 'border-primary/50 transform hover:-translate-y-1' : 'border-border-dark'
              }`}>
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-black text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-bold text-white">{pkg.currency === 'USD' ? '$' : ''}{pkg.price}</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">{pkg.description}</p>
                  <div className="text-xs text-primary font-medium">
                    {pkg.prompts} prompts for building models
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-lg mt-0.5">check_circle</span>
                    <span className="text-slate-300 text-sm">{pkg.prompts} building prompts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-lg mt-0.5">check_circle</span>
                    <span className="text-slate-300 text-sm">All model challenges</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-lg mt-0.5">check_circle</span>
                    <span className="text-slate-300 text-sm">Strategy support</span>
                  </li>
                </ul>
                
                <button className={`w-full py-3 px-6 rounded-lg transition-colors font-bold shadow-lg ${
                  pkg.popular 
                    ? 'bg-primary hover:bg-amber-400 text-black shadow-primary/20' 
                    : 'border border-border-dark bg-background-dark text-white hover:bg-slate-700'
                }`}>
                  Choose {pkg.name.replace(' Pack', '')} Prompts
                </button>
              </div>
            ))}
          </div>

          {/* Prompt Refill Section */}
          <div className="mt-16 text-center">
            <div className="bg-panel-dark border border-border-dark rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Need More Building Prompts?</h3>
              <p className="text-slate-400 text-base mb-6">
                Refill your prompt balance anytime. Perfect for strategic builders who need extra flexibility for complex models.
              </p>
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-3xl font-bold text-white">${PACKAGES[0].pricePerPrompt.toFixed(3)}</span>
                <span className="text-slate-400 text-lg">per building prompt (starting price)</span>
              </div>
              <button className="py-3 px-8 bg-panel-dark border border-primary hover:bg-primary hover:text-black rounded-lg transition-colors font-medium">
                Buy Building Prompts
              </button>
            </div>
          </div>

          {/* Special Offer */}
          <div className="mt-12 text-center">
            <div className="bg-linear-to-r from-primary/20 to-amber-500/20 border border-primary/30 rounded-2xl p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary text-2xl">celebration</span>
                <h3 className="text-xl font-bold text-white">Special Welcome Offer</h3>
              </div>
              <p className="text-slate-300 text-base mb-4">
                New users get <span className="text-primary font-bold">5 free building prompts</span> to start their strategic journey!
              </p>
              <p className="text-slate-400 text-sm mb-6">
                No credit card required. Try before you buy.
              </p>
              <button className="py-3 px-8 bg-primary hover:bg-amber-400 text-black rounded-lg transition-colors font-bold shadow-lg shadow-primary/20" onClick={() => router.push('/register')}>
                Claim Free Building Prompts
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 sm:py-20 md:py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 sm:mb-6">Ready to build your strategy?</h2>
          <p className="text-slate-400 text-base sm:text-lg mb-8 sm:mb-10">Join the elite community of strategic AI builders and start outsmarting the competition today.</p>
          <button className="flex mx-auto cursor-pointer items-center justify-center rounded-lg h-12 sm:h-14 px-8 sm:px-10 bg-white text-background-dark hover:bg-slate-200 transition-all text-base sm:text-lg font-bold tracking-wide w-full sm:w-auto max-w-sm" onClick={() => router.push('/register')}>
            Start Building Strategically
          </button>
        </div>
      </section>
    </Layout>
  );
}
