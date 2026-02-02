'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  performance?: {
    score: number;
    xpEarned: number;
    coinsPending: number;
    accuracy: number;
    feedback: string;
    targetMet: boolean;
    tokensUsed: number;
  };
}

export default function ChallengeArena() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tokens, setTokens] = useState(0);
  const [showInfo, setShowInfo] = useState(true);
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or loading state changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      setTimeout(() => {
        scrollContainerRef.current?.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [messages, isLoading]);

  const handleSubmit = async () => {
    if (!currentPrompt.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentPrompt,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentPrompt('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const mockResponse = `I've generated a photorealistic cyberpunk streetscape in 1920s noir style based on your prompt. The image features:

• Neon signage in vibrant blues and pinks reflecting off wet pavement
• Vintage 1920s automobiles with classic silhouettes
• Heavy atmospheric shadows creating dramatic contrast
• Rain-slicked streets with mirror-like surfaces
• Art deco architecture blended with futuristic elements
• Film noir lighting with strong chiaroscuro effects
• Period-appropriate clothing on pedestrians
• Steam rising from manholes and vents

The composition emphasizes the juxtaposition of retro aesthetics with cyberpunk technology, creating a unique visual narrative that bridges two distinct eras.`;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: mockResponse,
        timestamp: new Date(),
        performance: {
          score: 87,
          xpEarned: 42,
          coinsPending: 4,
          accuracy: 87,
          feedback: "Excellent recreation of the cyberpunk noir aesthetic. The neon lighting and atmospheric effects closely match the target. Consider refining the vintage car details for even higher accuracy.",
          targetMet: true,
          tokensUsed: 142
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const handleRefresh = () => {
    // Handle refresh target logic here
    console.log('Refreshing target');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] sm:h-[calc(100vh-6rem)] lg:h-[calc(100vh-8rem)] relative">
      {/* Mission Brief Header - Absolutely Positioned */}
      <div className="absolute top-0 left-0 right-0 z-10 p-3 sm:p-4 lg:p-6 bg-[#0f0b07]/95 backdrop-blur-sm border-b border-[#2d2417]">
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center justify-between w-full p-2 sm:p-3 bg-[#211b11]/30 rounded-lg border border-[#2d2417]/50 hover:bg-[#211b11]/50 transition-colors"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="material-symbols-outlined text-[#f59e0b] text-xs sm:text-sm">visibility</span>
              <span className="text-[10px] sm:text-xs font-bold text-[#f59e0b] uppercase tracking-wider">Mission Brief</span>
            </div>
            <span className={`material-symbols-outlined text-[#a8906e] text-xs sm:text-sm transition-transform ${showInfo ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>
          
          {showInfo && (
            <div className="space-y-3">
              <div className="@container">
                <div className="bg-cover bg-center flex flex-col justify-end overflow-hidden border-2 border-[#2d2417] rounded-xl min-h-[100px] xs:min-h-[120px] sm:min-h-[140px] lg:min-h-[160px] relative group" style={{backgroundImage: 'linear-gradient(180deg, rgba(15, 11, 7, 0.1) 0%, rgba(15, 11, 7, 0.9) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuABJXAPEeewUOln_50Dq3igUcL5szPQdEgGzNzZncwj2cWJDlv-xMWRpW11lCWQPjlu_yy9kYgeOni1zClDRie827ScTpKtNBcmfG6lUpIrGU6P35a_g48Li0tgkLc-NQOZ2JcVgdSLohngGwhONm2uphRTsMUgg6rz4-isywwV4YqTCX-UNCsijA0qcK3V5yvFTDrDKakBpz8GEPuzKjbfKBd0l8L3hHolv-zIVtslUOpOXIJuJCD_tErFmJZzCFiZHxKbEWuprSNo")'}}>
                  <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 bg-[#f59e0b] px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[7px] sm:text-[10px] font-bold uppercase tracking-widest text-[#0f0b07]">Recreation Challenge</div>
                  <div className="flex flex-col p-2 sm:p-3 lg:p-4">
                    <h2 className="text-white text-xs sm:text-sm lg:text-base font-bold leading-tight drop-shadow-lg">Generate a photorealistic cyberpunk streetscape in 1920s noir style</h2>
                    <p className="text-white/60 text-[10px] sm:text-xs lg:text-sm mt-1">Required elements: Neon signage, vintage cars, raining pavement, heavy shadows.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 p-2 sm:p-3 bg-[#211b11]/20 rounded-lg border border-[#2d2417]/30">
                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-1.5 sm:gap-2">
                    <p className="text-[#a8906e] text-[10px] sm:text-xs font-bold uppercase tracking-wider">Your XP Target</p>
                    <span className="text-[#f59e0b] text-lg sm:text-xl lg:text-2xl font-black shadow-[0_0_10px_rgba(245,158,11,0.4)]">48 XP</span>
                  </div>
                  <p className="text-white/40 text-[10px] sm:text-xs font-normal">Personalized target • <span className="text-[#f59e0b]/80 font-medium">+5 Coins pending</span></p>
                </div>
                
                <button 
                  onClick={handleRefresh}
                  className="flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer rounded-lg h-7 sm:h-8 px-2 sm:px-3 bg-white/5 hover:bg-white/10 text-white text-[10px] sm:text-xs font-bold border border-white/10 transition-all"
                >
                  <span className="material-symbols-outlined text-xs sm:text-sm text-[#f59e0b]">refresh</span>
                  <span className="hidden xs:inline">New Target</span>
                  <span className="xs:hidden">New</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Messages - Full height with top padding for absolute header */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 pt-20 sm:pt-24 lg:pt-28">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#211b11]/50 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <span className="material-symbols-outlined text-xl sm:text-2xl text-[#f59e0b]">chat</span>
            </div>
            <h3 className="text-white text-base sm:text-lg font-bold mb-2">Start Your Challenge</h3>
            <p className="text-[#a8906e] text-xs sm:text-sm max-w-sm sm:max-w-md">
              Write a prompt to recreate the target image. Your response will be evaluated for accuracy and you'll earn XP based on performance.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} px-1`}>
              <div className={`max-w-[85%] xs:max-w-[90%] sm:max-w-3xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`rounded-xl p-2.5 sm:p-3 lg:p-4 ${
                  message.type === 'user' 
                    ? 'bg-[#f59e0b] text-[#0f0b07]' 
                    : 'bg-[#211b11]/50 border border-[#2d2417] text-white'
                }`}>
                  <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
                
                {/* Performance Metrics for Assistant Messages */}
                {message.type === 'assistant' && message.performance && (
                  <div className="mt-2 sm:mt-3 bg-[#0f0b07]/30 rounded-lg p-2 sm:p-3 border border-[#2d2417]/50">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
                      <span className="material-symbols-outlined text-[#f59e0b] text-xs sm:text-sm">analytics</span>
                      <span className="text-[10px] sm:text-xs font-bold text-[#f59e0b] uppercase tracking-wider">Performance</span>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div className="text-center">
                        <p className={`text-base sm:text-lg font-bold ${
                          message.performance.score >= 80 ? 'text-green-500' : 
                          message.performance.score >= 60 ? 'text-[#f59e0b]' : 'text-red-500'
                        }`}>
                          {message.performance.score}%
                        </p>
                        <p className="text-[8px] sm:text-[10px] text-[#a8906e] uppercase">Score</p>
                      </div>
                      <div className="text-center">
                        <p className="text-base sm:text-lg font-bold text-[#f59e0b]">+{message.performance.xpEarned}</p>
                        <p className="text-[8px] sm:text-[10px] text-[#a8906e] uppercase">XP Earned</p>
                      </div>
                      <div className="text-center">
                        <p className="text-base sm:text-lg font-bold text-[#f59e0b]/80">+{message.performance.coinsPending}</p>
                        <p className="text-[8px] sm:text-[10px] text-[#a8906e] uppercase">Pending</p>
                      </div>
                      <div className="text-center">
                        <p className="text-base sm:text-lg font-bold text-white">{message.performance.tokensUsed}</p>
                        <p className="text-[8px] sm:text-[10px] text-[#a8906e] uppercase">Tokens</p>
                      </div>
                    </div>
                    
                    <div className="bg-[#211b11]/50 rounded p-1.5 sm:p-2">
                      <p className="text-[10px] sm:text-xs text-white/80 leading-relaxed">{message.performance.feedback}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start px-1">
            <div className="bg-[#211b11]/50 border border-[#2d2417] rounded-xl p-2.5 sm:p-3 lg:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-4 h-4 sm:w-6 sm:h-6 border-2 border-[#f59e0b]/30 border-t-[#f59e0b] rounded-full animate-spin"></div>
                <span className="text-white/80 text-xs sm:text-sm">Generating response...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="flex-shrink-0 border-t border-[#2d2417] p-3 sm:p-4 bg-[#0f0b07]">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-2 sm:gap-3">
            <div className="flex items-center justify-between">
              <div className="text-[9px] sm:text-[10px] text-[#a8906e] font-mono">
                {tokens} / 2048
              </div>
              <p className="text-[10px] sm:text-xs text-[#a8906e]">
                <span className="material-symbols-outlined text-[10px] sm:text-xs text-[#f59e0b] align-middle">info</span>
                <span className="hidden xs:inline ml-1">Submission costs 5 Credits • XP awarded immediately</span>
                <span className="xs:inline ml-1">5 Credits • XP awarded</span>
              </p>
            </div>
            <textarea 
              className="w-full bg-[#211b11]/50 border border-[#2d2417] rounded-xl text-white focus:ring-0 focus:outline-none focus:border-[#f59e0b]/50 p-2.5 sm:p-3 pr-12 font-mono text-xs sm:text-sm resize-none placeholder:text-[#a8906e] leading-relaxed"
              placeholder="Enter your prompt to recreate the target image..."
              value={currentPrompt}
              onChange={(e) => {
                setCurrentPrompt(e.target.value);
                setTokens(e.target.value.length);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              rows={2}
              style={{minHeight: '60px', maxHeight: '120px'}}
            />
            
            <button 
              onClick={handleSubmit}
              disabled={!currentPrompt.trim() || isLoading}
              className="w-full bg-[#f59e0b] hover:bg-[#d97706] disabled:bg-[#2d2417] disabled:text-[#a8906e] text-[#0f0b07] font-black rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transform active:scale-[0.98] disabled:scale-100 disabled:shadow-none text-xs sm:text-sm"
            >
              <span className="material-symbols-outlined text-sm sm:text-base">send</span>
              <span className="uppercase tracking-wider hidden xs:inline">Submit Prompt</span>
              <span className="uppercase tracking-wider xs:hidden">Submit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
