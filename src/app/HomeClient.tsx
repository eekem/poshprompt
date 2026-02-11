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

export default function HomeClient() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(challenges[0]);
  const [showPackages, setShowPackages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response and evaluation
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Great attempt! I can see you've put thought into this ${currentChallenge.expectedFormat}. Let me evaluate your response...`,
        timestamp: new Date(),
        evaluation: {
          passed: Math.random() > 0.3,
          score: Math.floor(Math.random() * 40) + 60,
          constraints_met: Math.floor(Math.random() * 30) + 70,
          creativity: Math.floor(Math.random() * 30) + 70,
          efficiency: Math.floor(Math.random() * 30) + 70,
        }
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectChallenge = (challenge: typeof challenges[0]) => {
    setCurrentChallenge(challenge);
    setMessages([{
      id: 'system',
      type: 'system',
      content: `New challenge selected: ${challenge.title}. ${challenge.description}`,
      timestamp: new Date(),
    }]);
  };

  const purchasePackage = (pkg: Package) => {
    // Handle package purchase logic here
    console.log('Purchasing package:', pkg);
    router.push('/register');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              PoshPrompt Arena
            </h1>
            <p className="text-xl text-gray-300">
              The Premier Competitive Arena for Prompt Engineers
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Challenge Selection */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h2 className="text-2xl font-semibold mb-4">Challenges</h2>
                <div className="space-y-3">
                  {challenges.map((challenge) => (
                    <button
                      key={challenge.id}
                      onClick={() => selectChallenge(challenge)}
                      className={`w-full text-left p-4 rounded-lg transition-all ${
                        currentChallenge.id === challenge.id
                          ? 'bg-purple-600 border-purple-400'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <h3 className="font-semibold">{challenge.title}</h3>
                      <p className="text-sm text-gray-300 mt-1">{challenge.description}</p>
                    </button>
                  ))}
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => setShowPackages(!showPackages)}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all"
                  >
                    {showPackages ? 'Hide' : 'Show'} Premium Packages
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 h-[600px] flex flex-col">
                <div className="p-4 border-b border-white/20">
                  <h2 className="text-xl font-semibold">{currentChallenge.title}</h2>
                  <p className="text-sm text-gray-300">{currentChallenge.description}</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-purple-600 text-white'
                            : message.type === 'ai'
                            ? 'bg-white/20 text-white'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        <p>{message.content}</p>
                        {message.evaluation && (
                          <div className="mt-3 p-3 bg-black/20 rounded-lg">
                            <h4 className="font-semibold mb-2">Evaluation:</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>Score: {message.evaluation.score}/100</div>
                              <div>Passed: {message.evaluation.passed ? '✅' : '❌'}</div>
                              <div>Constraints: {message.evaluation.constraints_met}%</div>
                              <div>Creativity: {message.evaluation.creativity}%</div>
                              <div>Efficiency: {message.evaluation.efficiency}%</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white/20 p-3 rounded-lg">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-white/20">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter your prompt..."
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputValue.trim()}
                      className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Packages Modal */}
          {showPackages && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto border border-white/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold">Premium Packages</h2>
                  <button
                    onClick={() => setShowPackages(false)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {PACKAGES.map((pkg) => (
                    <div
                      key={pkg.name}
                      className={`bg-white/10 backdrop-blur-md rounded-xl p-6 border ${
                        pkg.popular ? 'border-yellow-400' : 'border-white/20'
                      }`}
                    >
                      {pkg.popular && (
                        <div className="bg-yellow-400 text-black text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                          MOST POPULAR
                        </div>
                      )}
                      <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                      <div className="text-3xl font-bold mb-4">
                        ${pkg.price}
                        <span className="text-sm text-gray-400">/{pkg.billing}</span>
                      </div>
                      <ul className="space-y-2 mb-6">
                        {pkg.features?.map((feature: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-400 mr-2">✓</span>
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => purchasePackage(pkg)}
                        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                          pkg.popular
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                            : 'bg-purple-600 hover:bg-purple-700'
                        } text-white`}
                      >
                        Get Started
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
