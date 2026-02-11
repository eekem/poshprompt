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

const challenges = [
  {
    id: 'creative-constraint',
    title: 'Creative Constraint',
    description: 'Write a haiku about cybersecurity without using the words "code", "hack", or "wall".',
    forbiddenWords: ['code', 'hack', 'wall'],
    expectedFormat: 'haiku'
  },
  {
    id: 'technical-explanation',
    title: 'Technical Explanation',
    description: 'Explain machine learning to a 10-year-old using only analogies from cooking.',
    forbiddenWords: ['algorithm', 'neural', 'network', 'data'],
    expectedFormat: 'simple explanation'
  },
  {
    id: 'creative-writing',
    title: 'Creative Writing',
    description: 'Write a short story about time travel where the time machine is a musical instrument.',
    forbiddenWords: ['time', 'travel', 'machine', 'future'],
    expectedFormat: 'short story'
  }
];

export default function Home() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(challenges[0]);
  const [metrics, setMetrics] = useState({
    constraints_met: 100,
    creativity: 92,
    efficiency: 85
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

    // Update metrics
    setMetrics({
      constraints_met: evaluation.constraints_met,
      creativity: evaluation.creativity,
      efficiency: evaluation.efficiency
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
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Season 4 is Live</span>
          </div>
          <h1 className="text-white text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight max-w-3xl sm:max-w-4xl" style={{ textShadow: '0 0 20px rgba(245, 159, 10, 0.2)' }}>
            Compete. Craft. <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-amber-200">Win with Prompts.</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-lg sm:max-w-2xl mx-auto px-2">
            The premier arena for prompt engineers. Test your skills in real-time chat challenges, climb the global leaderboard, and earn cash prizes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 w-full max-w-sm sm:max-w-none justify-center">
            <button className="flex cursor-pointer items-center justify-center rounded-lg h-11 sm:h-12 px-6 sm:px-8 bg-primary hover:bg-amber-400 transition-all text-[#231c10] text-sm sm:text-base font-bold tracking-wide shadow-[0_0_20px_rgba(245,159,10,0.4)] hover:shadow-[0_0_30px_rgba(245,159,10,0.6)] w-full sm:w-auto" onClick={() => router.push('/arena')}>
              Enter the Arena
            </button>
            <button className="flex cursor-pointer items-center justify-center rounded-lg h-11 sm:h-12 px-6 sm:px-8 bg-panel-dark border border-border-dark hover:border-primary/50 text-white text-sm sm:text-base font-medium transition-all group w-full sm:w-auto" onClick={() => router.push('/demo')}>
              <span className="material-symbols-outlined mr-2 group-hover:text-primary transition-colors text-lg sm:text-xl">play_circle</span>
              Watch Demo
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
            <p className="text-center sm:text-left">Join 5,000+ Prompt Engineers competing daily</p>
          </div>
        </div>
      </section>

      {/* Interactive Demo / Chat UI */}
      <section id="demo" className="px-4 sm:px-6 pb-16 sm:pb-20 max-w-6xl mx-auto w-full">
        <div className="relative rounded-xl border border-border-dark bg-panel-dark overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 border-b border-border-dark bg-background-dark px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex gap-1.5">
              <div className="size-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
              <div className="size-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
              <div className="size-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
            </div>
            <div className="ml-2 sm:ml-4 text-xs font-mono text-slate-500 truncate">{currentChallenge.id}.ts</div>
            <div className="ml-auto flex gap-2">
              {challenges.map((challenge) => (
                <button
                  key={challenge.id}
                  onClick={() => setCurrentChallenge(challenge)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    currentChallenge.id === challenge.id
                      ? 'bg-primary text-black'
                      : 'bg-background-dark text-slate-400 hover:text-primary'
                  }`}
                >
                  {challenge.title}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 min-h-[400px] sm:min-h-[500px]">
            {/* Chat Area */}
            <div className="md:col-span-2 flex flex-col border-r border-border-dark bg-[#0f0e0c] overflow-y-scroll max-h-[400px] sm:max-h-[600px]">
              <div className="flex-1 p-3 sm:p-6 flex flex-col gap-4 sm:gap-6 overflow-y-auto">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-3 sm:gap-4 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`size-6 sm:size-8 shrink-0 rounded flex items-center justify-center ${
                      message.type === 'system' || message.type === 'ai' 
                        ? 'bg-primary/10 text-primary border border-primary/20' 
                        : 'bg-slate-700 text-white'
                    }`}>
                      <span className="material-symbols-outlined text-sm sm:text-lg">
                        {message.type === 'system' || message.type === 'ai' ? 'smart_toy' : 'person'}
                      </span>
                    </div>
                    <div className={`flex flex-col gap-1 ${message.type === 'user' ? 'items-end' : ''}`}>
                      <span className="text-xs font-bold text-slate-400">
                        {message.type === 'system' ? 'System' : message.type === 'user' ? 'You' : 'Model Output'}
                      </span>
                      <div className={`${
                        message.type === 'user' 
                          ? 'bg-panel-dark border border-border-dark rounded-lg p-2 sm:p-3 text-xs sm:text-sm text-slate-200 max-w-[85%] sm:max-w-none' 
                          : 'text-slate-300 text-xs sm:text-sm leading-relaxed'
                      }`}>
                        {message.content}
                      </div>
                      {message.type === 'ai' && message.evaluation && (
                        <div className={`bg-primary/5 border border-primary/20 rounded-lg p-3 sm:p-4 relative ${
                          message.evaluation.passed ? 'border-green-500/30' : 'border-red-500/30'
                        }`}>
                          <p className="text-white italic text-sm sm:text-lg font-display mb-2">
                            "{message.content}"
                          </p>
                          <div className={`absolute -right-2 -top-2 ${
                            message.evaluation.passed ? 'bg-green-500' : 'bg-red-500'
                          } text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg border ${
                            message.evaluation.passed ? 'border-green-400' : 'border-red-400'
                          }`}>
                            {message.evaluation.passed ? 'PASSED' : 'FAILED'}
                          </div>
                          <div className="text-xs text-slate-400 mt-2">
                            Score: {message.evaluation.score}/100
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 sm:gap-4">
                    <div className="size-6 sm:size-8 shrink-0 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      <span className="material-symbols-outlined text-sm sm:text-lg animate-pulse">smart_toy</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-slate-400">Model Output</span>
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 sm:p-4">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              {/* Input Area */}
              <div className="p-3 sm:p-4 border-t border-border-dark bg-background-dark">
                <div className="relative">
                  <input 
                    className="w-full bg-panel-dark border border-border-dark rounded-lg pl-3 sm:pl-4 pr-10 sm:pr-12 py-2 sm:py-3 text-xs sm:text-sm text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none placeholder-slate-600 transition-all" 
                    placeholder="Type your prompt here..." 
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                  />
                  <button 
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 sm:p-1.5 text-slate-400 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim()}
                  >
                    <span className="material-symbols-outlined text-lg sm:text-xl">send</span>
                  </button>
                </div>
              </div>
            </div>
            {/* Side Panel / Stats */}
            <div className="hidden md:flex flex-col bg-panel-dark p-6 gap-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Evaluation Metrics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">Constraints Met</span>
                      <span className="text-primary font-mono">{metrics.constraints_met}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-background-dark rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-500" style={{width: `${metrics.constraints_met}%`}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">Creativity Score</span>
                      <span className="text-primary font-mono">{metrics.creativity}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-background-dark rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-500" style={{width: `${metrics.creativity}%`}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">Token Efficiency</span>
                      <span className="text-primary font-mono">{metrics.efficiency}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-background-dark rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-500" style={{width: `${metrics.efficiency}%`}}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-border-dark pt-6 mt-auto">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Challenge Info</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-primary mb-1">{currentChallenge.title}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{currentChallenge.description}</p>
                  </div>
                  {currentChallenge.forbiddenWords.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-slate-300 mb-2">Forbidden Words:</p>
                      <div className="flex flex-wrap gap-1">
                        {currentChallenge.forbiddenWords.map((word) => (
                          <span key={word} className="px-2 py-1 bg-red-500/20 border border-red-500/30 text-red-400 text-xs rounded">
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="border-t border-border-dark pt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Live Leaderboard</h3>
                <ul className="space-y-3">
                  <li className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500 font-bold w-4">1</span>
                      <div className="size-6 rounded-full bg-slate-700 bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCBBP7NTyrzRvupSZWjOP7a0hSZMzIbrLbgnMHoYimCREW8zgBMIhalPriOAecmQlw9cj3t3O82PdE_8NeY7xbjJC6gdJ5vk_100o_6_75ZpaSMZLsSrijP3za0sM4G_uqQc6evMHoBZHPViTmKG8ubKHlVYrlm8QxovqUThCWgnIUokRWeb4SIa9_2BMSukTL_Rr_qLGpHVTNmklmvscgOYnAPhS3E-sQiIQUjvRwF3Cosha1-umE3UGkiyElFtx1KilES1qee_ybr")'}}></div>
                      <span className="text-slate-200">prompt_wizard</span>
                    </div>
                    <span className="font-mono text-primary">98.5</span>
                  </li>
                  <li className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-bold w-4">2</span>
                      <div className="size-6 rounded-full bg-slate-700 bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA4K32BZ2__oa5mVx30waT2JUPf7deNaH9QyAkmPkORtEAxZWf7C6uOpU-O45kYjKhqZ_OCeUg5wUGEtVP6yjMxZnm2wn65I9I3BMs3_14c05Wpy9gkqayOCCpmeCpmnXBvJzPcApwWRF8kmSehYCdiiZpdCcusSiovXxtgiTlPEQ1Ujeur8Ei0fTGqPQEQeyRjoyz-uGzlYvkH6Q1HYK6Napoks8nWk5Lr2nkSTdXo-SR1_5YmvlZ7c6RNxTSrwogSqtgpacsj7qBW")'}}></div>
                      <span className="text-slate-200">ai_whisperer</span>
                    </div>
                    <span className="font-mono text-slate-400">97.2</span>
                  </li>
                  <li className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-bold w-4">3</span>
                      <div className="size-6 rounded-full bg-slate-700 bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDsfqYNvYMwF6zPKdV1N4fZFtrG_0AtUP2GhzBLoqdt0BHVPZ7Ovk-UNoqOewU6WKXVDd67Hc4e4BsXeKtqOSXvzcnh03rOKOcZ4yMhrZEiuAmpKGhEIJ6fVl2wYqiUGwfS6F8LFlB4GX7VdmK2LjEyHxeZ4PmQdr73qvuIjGBVY7GO_59PUBv-IwegMCDKnVgM52gbKCF-e13Q1iKXfD9WfxsEOTtZysi6aPm0QtohCPkdldQwoSAdGaxwVe98x7AoMlR3T-dck62W")'}}></div>
                      <span className="text-slate-200">neural_net</span>
                    </div>
                    <span className="font-mono text-slate-400">96.8</span>
                  </li>
                </ul>
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
            <p className="text-slate-400 max-w-lg sm:max-w-2xl text-base sm:text-lg">Experience the future of prompt engineering with our premium, developer-focused platform.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Feature 1 */}
            <div className="group flex flex-col gap-3 sm:gap-4 rounded-xl border border-border-dark bg-panel-dark p-6 sm:p-8 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
              <div className="size-10 sm:size-12 rounded-lg bg-background-dark border border-border-dark flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background-dark transition-colors">
                <span className="material-symbols-outlined text-xl sm:text-2xl">chat</span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Native Chat Interface</h3>
                <p className="text-slate-400 leading-relaxed text-sm sm:text-base">Use your natural language skills in a familiar, IDE-like environment designed for rapid iteration and testing.</p>
              </div>
            </div>
            {/* Feature 2 */}
            <div className="group flex flex-col gap-3 sm:gap-4 rounded-xl border border-border-dark bg-panel-dark p-6 sm:p-8 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
              <div className="size-10 sm:size-12 rounded-lg bg-background-dark border border-border-dark flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background-dark transition-colors">
                <span className="material-symbols-outlined text-xl sm:text-2xl">bolt</span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Instant Evaluation</h3>
                <p className="text-slate-400 leading-relaxed text-sm sm:text-base">Our proprietary AI scoring engine evaluates your outputs in milliseconds for accuracy, creativity, and safety.</p>
              </div>
            </div>
            {/* Feature 3 */}
            <div className="group flex flex-col gap-3 sm:gap-4 rounded-xl border border-border-dark bg-panel-dark p-6 sm:p-8 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
              <div className="size-10 sm:size-12 rounded-lg bg-background-dark border border-border-dark flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background-dark transition-colors">
                <span className="material-symbols-outlined text-xl sm:text-2xl">trophy</span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Cash Pools</h3>
                <p className="text-slate-400 leading-relaxed text-sm sm:text-base">Top the daily and weekly leaderboards to win real cash rewards from our sponsored prize pools.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 bg-background-dark">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Choose Your Plan</h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
              Unlock your full potential with our flexible pricing plans. Start free and scale as you grow.
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
                    ${pkg.pricePerPrompt.toFixed(3)} per prompt
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-lg mt-0.5">check_circle</span>
                    <span className="text-slate-300 text-sm">{pkg.prompts} prompts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-lg mt-0.5">check_circle</span>
                    <span className="text-slate-300 text-sm">All challenges</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-lg mt-0.5">check_circle</span>
                    <span className="text-slate-300 text-sm">Priority support</span>
                  </li>
                </ul>
                
                <button className={`w-full py-3 px-6 rounded-lg transition-colors font-bold shadow-lg ${
                  pkg.popular 
                    ? 'bg-primary hover:bg-amber-400 text-black shadow-primary/20' 
                    : 'border border-border-dark bg-background-dark text-white hover:bg-slate-700'
                }`}>
                  Choose {pkg.name.replace(' Pack', '')}
                </button>
              </div>
            ))}
          </div>

          {/* Prompt Refill Section */}
          <div className="mt-16 text-center">
            <div className="bg-panel-dark border border-border-dark rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Need More Prompts?</h3>
              <p className="text-slate-400 text-base mb-6">
                Refill your prompt balance anytime. Perfect for power users who need extra flexibility.
              </p>
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-3xl font-bold text-white">${PACKAGES[0].pricePerPrompt.toFixed(3)}</span>
                <span className="text-slate-400 text-lg">per prompt (starting price)</span>
              </div>
              <button className="py-3 px-8 bg-panel-dark border border-primary hover:bg-primary hover:text-black rounded-lg transition-colors font-medium">
                Buy Prompts
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
                New users get <span className="text-primary font-bold">5 free prompts</span> to start their journey!
              </p>
              <p className="text-slate-400 text-sm mb-6">
                No credit card required. Try before you buy.
              </p>
              <button className="py-3 px-8 bg-primary hover:bg-amber-400 text-black rounded-lg transition-colors font-bold shadow-lg shadow-primary/20" onClick={() => router.push('/register')}>
                Claim Free Prompts
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 sm:py-20 md:py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 sm:mb-6">Ready to prove your skills?</h2>
          <p className="text-slate-400 text-base sm:text-lg mb-8 sm:mb-10">Join the elite community of prompt engineers and start winning today.</p>
          <button className="flex mx-auto cursor-pointer items-center justify-center rounded-lg h-12 sm:h-14 px-8 sm:px-10 bg-white text-background-dark hover:bg-slate-200 transition-all text-base sm:text-lg font-bold tracking-wide w-full sm:w-auto max-w-sm" onClick={() => router.push('/register')}>
            Get Started for Free
          </button>
        </div>
      </section>
    </Layout>
  );
}
