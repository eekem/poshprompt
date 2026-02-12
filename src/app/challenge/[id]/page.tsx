"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/app/lib/use-auth";
import Modal from "@/components/Modal";
import BottomSheet from "@/components/BottomSheet";
import TopUpModal from "@/components/TopUpModal";
import "./globals.css";

interface Message {
  id: string;
  type: "system" | "user" | "ai";
  content: string;
  timestamp: string;
  score?: number;
  breakdown?: {
    consistency: number;
    output_quality: number;
    robustness: number;
    creativity: number;
    brevity: number;
    methodical_approach?: number;
    voice_preservation?: number;
    empathy?: number;
    completeness?: number;
  };
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  gameType: "mini_model_training" | "image" | "text" | "transformation" | "refinement" | "evaluation";
  difficulty: "beginner" | "intermediate" | "advanced";
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
    scoringMode: string;
  };
  scoring: {
    totalScore: number;
    passingScore: number;
    breakdown: any;
  };
  rewards: {
    base_xp: number;
    base_coins: number;
    completion_bonus?: any;
  };
  isFeatured: boolean;
  estimatedTime?: number;
  prerequisites?: string[];
  learningObjectives?: string[];
}

interface ChatResponse {
  chatId: string;
  messageId: string;
  output: string;
  score_text: string;
  breakdown: {
    consistency: number;
    output_quality: number;
    robustness: number;
    creativity: number;
    brevity: number;
  };
  turnNumber: number;
  totalScore: number;
  earnedXp: number;
  remainingPrompts: number;
  phase?: 'training' | 'stress_test' | 'results';
  canProceedToStressTest?: boolean;
  trainingComplete?: boolean;
}

interface StressTestResponse {
  chatId: string;
  miniModelId: string;
  overallScore: number;
  robustnessScore: number;
  grade: string; // S/A/B/C/D/F
  tier: string; // Platinum, Gold, Silver, Bronze
  percentile: number; // 0.0 - 1.0
  isRewardEligible: boolean;
  rewardZoneMessage: string;
  results: Array<{
    testCaseId: string;
    input: string;
    output: string;
    score: number;
    passed: boolean;
    breakdown: any;
    explanation: string;
  }>;
  totalXp: number;
  coinsEarned: number;
  achievements: string[];
  canPublish: boolean;
}

export default function ChallengePage() {
  const params = useParams();
  const challengeId = params.id as string;
  const { user, loading: authLoading } = useAuth();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [allChallenges, setAllChallenges] = useState<Challenge[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentTurn, setCurrentTurn] = useState(1);
  const [previousOutputs, setPreviousOutputs] = useState<string[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const [chatId, setChatId] = useState<string | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);
  const [remainingPrompts, setRemainingPrompts] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'training' | 'stress_test' | 'results'>('training');
  const [trainingComplete, setTrainingComplete] = useState(false);
  const [canProceedToStressTest, setCanProceedToStressTest] = useState(false);
  const [stressTestResults, setStressTestResults] = useState<StressTestResponse | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = "/login";
    }
  }, [user, authLoading]);

  // Load challenge data and fetch previous chat messages
  useEffect(() => {
    const loadChallengeAndChatHistory = async () => {
      // Fetch user's current prompt count
      try {
        const userResponse = await fetch(`/api/user/stats?userId=${user!.id}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setRemainingPrompts(userData.user?.prompts || 0);
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }

      // Fetch all challenges for sidebar
      try {
        const challengesResponse = await fetch("/api/challenges");
        if (challengesResponse.ok) {
          const challengesData = await challengesResponse.json();
          if (challengesData.success) {
            setAllChallenges(challengesData.challenges);
          }
        }
      } catch (error) {
        console.error("Error fetching challenges:", error);
      }

      // Fetch challenge data from API
      try {
        const challengeResponse = await fetch(`/api/challenges/${challengeId}`);
        if (challengeResponse.ok) {
          const challengeData = await challengeResponse.json();
          if (challengeData.success) {
            setChallenge(challengeData.challenge);
            
            // Initialize timer for training challenges
            if (challengeData.challenge.gameplay.turnBased) {
              setTimeRemaining(challengeData.challenge.gameplay.timeLimitSeconds);
            }
          } else {
            throw new Error(challengeData.error || "Failed to load challenge");
          }
        } else {
          throw new Error("Failed to fetch challenge");
        }
      } catch (error) {
        console.error("Error fetching challenge:", error);
        // Set error state
        const errorMessage: Message = {
          id: "error-challenge-load",
          type: "system",
          content: "Failed to load challenge. Please refresh the page.",
          timestamp: new Date().toISOString()
        };
        setMessages([errorMessage]);
        return;
      }

      // Try to fetch previous chat messages for this user and challenge
      try {
        const response = await fetch(
          `/api/chat/session?userId=${user!.id}&challengeId=${challengeId}`,
        );
        if (response.ok) {
          const data = await response.json();

          if (data.messages && data.messages.length > 0) {
            // Convert database messages to frontend Message format
            const formattedMessages: Message[] = data.messages.map(
              (msg: any) => ({
                id: msg.id,
                type: msg.type,
                content: msg.content,
                timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                score: msg.score,
                breakdown: msg.breakdown,
              }),
            );

            setMessages(formattedMessages);
            setChatId(data.chatId);
            setTotalScore(data.totalScore);
            setEarnedXp(data.earnedXp);
            setCurrentTurn(data.currentTurn);

            // Set previous outputs from AI messages for context
            const aiOutputs = data.messages
              .filter((msg: any) => msg.type === "ai" && msg.content)
              .map((msg: any) => msg.content);
            setPreviousOutputs(aiOutputs);

            return; // Exit early if we found previous messages
          }
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }

      // If no previous messages or error, create initial system message
      if (challenge) {
        const systemMessage: Message = {
          id: "system-1",
          type: "system",
          content: `Welcome to ${challenge.title} training session!\n\n**Your Role:** AI Trainer\n**AI's Role:** Your Trainee\n\n**Training Objective:** ${challenge.task.objective}\n\n**Training Guidelines:**\n${challenge.task.constraints.required.map((c) => `• ${c}`).join("\n")}\n${challenge.task.constraints.forbidden.length > 0 ? `\n**Avoid These Behaviors:**\n${challenge.task.constraints.forbidden.map((c) => `• ${c}`).join("\n")}` : ""}\n${challenge.task.constraints.optional.length > 0 ? `\n**Optional Enhancements:**\n${challenge.task.constraints.optional.map((c) => `• ${c}`).join("\n")}` : ""}\n\n${challenge.gameplay.turnBased ? `You have ${Math.floor(challenge.gameplay.timeLimitSeconds / 60)}:${(challenge.gameplay.timeLimitSeconds % 60).toString().padStart(2, '0')} to complete this training round. Each round builds on previous context to create a consistent AI persona.` : ""}\n\n**Remember:** You're teaching through prompt engineering. Each response helps build the AI's context for consistent behavior.`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setMessages([systemMessage]);
      }
    };

    if (user && challengeId) {
      loadChallengeAndChatHistory();
    }
  }, [challengeId, user]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0 && !isLoading && currentPhase === 'training') {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && currentPhase === 'training') {
      handleSubmit(); // Auto-submit when time runs out
    }
  }, [timeRemaining, isLoading, currentPhase]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Word count
  useEffect(() => {
    const words = input
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    setWordCount(words);
  }, [input]);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background-dark">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-900 text-green-300";
      case "intermediate":
        return "bg-yellow-900 text-yellow-300";
      case "advanced":
        return "bg-red-900 text-red-300";
      default:
        return "bg-gray-900 text-gray-300";
    }
  };

  const getGameIcon = (gameType: string) => {
    switch (gameType) {
      case "image":
        return "palette";
      case "text":
        return "edit_note";
      case "transformation":
        return "transform";
      case "refinement":
        return "auto_fix_high";
      case "evaluation":
        return "grading";
      default:
        return "smart_toy";
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Platinum":
        return "text-purple-400 bg-purple-900/30 border-purple-700";
      case "Gold":
        return "text-yellow-400 bg-yellow-900/30 border-yellow-700";
      case "Silver":
        return "text-gray-300 bg-gray-700/30 border-gray-600";
      case "Bronze":
        return "text-orange-400 bg-orange-900/30 border-orange-700";
      default:
        return "text-gray-400 bg-gray-800/30 border-gray-600";
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "S":
        return "text-purple-400";
      case "A":
        return "text-green-400";
      case "B":
        return "text-blue-400";
      case "C":
        return "text-yellow-400";
      case "D":
        return "text-orange-400";
      case "F":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const handleSubmit = async () => {
    if (!input.trim() || isLoading || !challenge) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/run_challenge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          challengeId,
          prompt: input,
          chatId: chatId || undefined,
          turnNumber: currentTurn,
          previousOutputs,
          phase: currentPhase
        }),
      });

      const data: ChatResponse | { error: string } = await response.json();

      if (!response.ok) {
        throw new Error((data as { error: string }).error || "Failed to submit prompt");
      }

      const chatData = data as ChatResponse;

      // Update chat state
      if (!chatId) {
        setChatId(chatData.chatId);
      }

      const aiMessage: Message = {
        id: chatData.messageId,
        type: "ai",
        content: chatData.output,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        score: chatData.turnNumber > 0 ? Math.round((chatData.breakdown.consistency + chatData.breakdown.output_quality + chatData.breakdown.robustness + chatData.breakdown.creativity + chatData.breakdown.brevity) / 5) : undefined,
        breakdown: chatData.breakdown,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setPreviousOutputs((prev) => [...prev, chatData.output]);
      setTotalScore(chatData.totalScore);
      setEarnedXp(chatData.earnedXp);
      setRemainingPrompts(chatData.remainingPrompts);

      if (challenge.gameplay.turnBased) {
        setCurrentTurn(chatData.turnNumber + 1);
      }

      // Handle phase transitions
      setTrainingComplete(chatData.trainingComplete || false);
      setCanProceedToStressTest(chatData.canProceedToStressTest || false);
      setCurrentPhase(chatData.phase || 'training');

      // Reset timer for next turn if still in training
      if (chatData.phase === 'training' && !chatData.trainingComplete) {
        setTimeRemaining(challenge.gameplay.timeLimitSeconds);
      }

    } catch (error) {
      console.error("Error submitting prompt:", error);
      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: "system",
        content: `Error: ${error instanceof Error ? error.message : "Failed to submit prompt"}`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopUpComplete = (additionalPrompts: number) => {
    setRemainingPrompts(prev => prev + additionalPrompts);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const startStressTest = async () => {
    if (!challenge || !chatId) return;

    setIsLoading(true);
    setCurrentPhase('stress_test');

    try {
      // Collect all training context
      const trainingContext = messages
        .filter(msg => msg.type === 'user' || msg.type === 'ai')
        .map(msg => `${msg.type.toUpperCase()}: ${msg.content}`);

      const systemPrompt = `You are ${challenge.task.objective}. Follow these constraints:\nRequired: ${challenge.task.constraints.required.join(', ')}\nForbidden: ${challenge.task.constraints.forbidden.join(', ')}`;

      const response = await fetch("/api/run_challenge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          chatId: chatId,
          phase: 'stress_test',
          systemPrompt,
          finalContext: trainingContext
        }),
      });

      const data: StressTestResponse | { error: string } = await response.json();

      if (!response.ok) {
        throw new Error((data as { error: string }).error || "Failed to run stress test");
      }

      const stressData = data as StressTestResponse;

      setStressTestResults(stressData);
      setCurrentPhase('results');
      setEarnedXp(prev => prev + stressData.totalXp);

      // Add results message
      const resultsMessage: Message = {
        id: Date.now().toString(),
        type: "system",
        content: `## 🎓 Training Evaluation Complete!\n\n**Your AI Trainee Performance:**\n• Overall Score: ${stressData.overallScore}/100\n• Grade: ${stressData.grade}\n• Tier Placement: ${stressData.tier}\n• Percentile: ${Math.round(stressData.percentile * 100)}th percentile\n• Robustness Score: ${stressData.robustnessScore}/100\n\n**Reward Zone Status:** ${stressData.rewardZoneMessage}\n\n**Achievements Unlocked:**\n${stressData.achievements.length > 0 ? stressData.achievements.map(a => `• ${a}`).join('\n') : '• None yet. Keep training!'}\n\n**Training Rewards Earned:**\n• Certification Points: ${stressData.totalXp}\n• Performance Tokens: ${stressData.coinsEarned}\n\n${stressData.canPublish ? '🎉 Excellent! Your trained AI is ready to share with the community!' : '💪 Continue training to improve your AI\'s consistency and robustness.'}\n\n**What Happened:** Your accumulated training context was tested against adversarial scenarios. The AI maintained its trained behavior based on how well you taught it through prompt engineering.`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, resultsMessage]);

    } catch (error) {
      console.error("Error running stress test:", error);
      setCurrentPhase('training');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background-dark">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  if (!challenge) {
    return (
      <div className="flex items-center justify-center h-screen bg-background-dark">
        <div className="text-white">Loading challenge...</div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-white overflow-hidden h-screen flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-primary p-2 rounded-lg shadow-lg"
      >
        <span className="material-symbols-outlined text-black text-xl">
          menu
        </span>
      </button>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}

      {/* Left Sidebar - Desktop & Mobile Drawer */}
      <aside
        className={`
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 fixed lg:relative w-80 h-full flex flex-col bg-sidebar-dark border-r border-[#332a1e] shrink-0 
        z-40 transition-transform duration-300 ease-in-out lg:transition-none
      `}
      >
        {/* Logo Header */}
        <div className="p-6 border-b border-[#332a1e] flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-black text-xl font-bold">
                school
              </span>
            </div>
            <div>
              <h1 className="text-white text-lg font-bold tracking-tight">
                POSHPROMPT
              </h1>
              <p className="text-gold-accent text-xs tracking-wider uppercase opacity-80">
                AI Training Arena
              </p>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Navigation / Challenges List */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-6 pb-2 text-xs font-medium text-gray-500 uppercase tracking-widest">
            Active Challenges
          </div>
          <nav className="flex flex-col gap-1 px-3">
            {[...allChallenges]
              .sort((a, b) => {
                // Put current challenge first, then sort by creation date
                if (a.id === challengeId) return -1;
                if (b.id === challengeId) return 1;
                return 0; // Keep original order for others
              })
              .map((challengeItem) => (
                <a
                  key={challengeItem.id}
                  className={`group flex flex-col gap-1 p-3 rounded-lg border relative overflow-hidden transition-colors ${
                    challengeItem.id === challengeId
                      ? "bg-surface-dark border-[#493b22]"
                      : "bg-sidebar-dark/50 border-transparent hover:bg-surface-dark/30 hover:border-[#332a1e]"
                  }`}
                  href={`/challenge/${challengeItem.id}`}
                >
                  {challengeItem.id === challengeId && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                  )}
                  <div className="flex justify-between items-start mb-1">
                    <span
                      className={`font-medium text-sm ${
                        challengeItem.id === challengeId
                          ? "text-white"
                          : "text-gray-300 group-hover:text-white"
                      }`}
                    >
                      {challengeItem.title}
                    </span>
                    <span
                      className={`material-symbols-outlined text-[18px] ${
                        challengeItem.id === challengeId
                          ? "text-primary"
                          : "text-gray-500 group-hover:text-gray-300"
                      }`}
                    >
                      {getGameIcon(challengeItem.gameType)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getDifficultyColor(challengeItem.difficulty)}`}
                      >
                        {challengeItem.difficulty}
                      </span>
                      <span
                        className={`text-[10px] font-medium uppercase tracking-wider ${
                          challengeItem.id === challengeId
                            ? "text-gold-accent"
                            : "text-gray-600 group-hover:text-gold-accent/80"
                        }`}
                      >
                        {challengeItem.gameType}
                      </span>
                    </div>
                    <span
                      className={`text-xs ${
                        challengeItem.id === challengeId
                          ? "text-gray-400"
                          : "text-gray-500 group-hover:text-gray-400"
                      }`}
                    >
                      {challengeItem.id === challengeId
                        ? "In Progress"
                        : "Start Challenge"}
                    </span>
                  </div>
                </a>
              ))}
          </nav>
        </div>


        {/* User Profile Footer */}
        <div className="p-4 border-t border-[#332a1e] bg-[#15120e]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gray-600 border border-[#493b22] flex items-center justify-center">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-white">
                    person
                  </span>
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#15120e]"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">
                {user.name || "Anonymous User"}
              </span>
              <span className="text-xs text-gold-accent">
                Elite Trainer
              </span>
            </div>
            <button className="ml-auto text-gray-400 hover:text-white">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Arena */}
      <main className="flex-1 flex flex-col h-full bg-background-dark relative lg:ml-0">
        {/* Main Header */}
        <header className="h-16 border-b border-[#332a1e] flex items-center justify-between px-4 lg:px-8 bg-sidebar-dark/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-2 lg:gap-4 min-w-0 pl-15">
            <h2 className="text-lg lg:text-xl font-bold text-white tracking-tight truncate">
              {challenge.title}
            </h2>
            <span
              className={`px-1 py-0.5 rounded text-xs font-bold ${getDifficultyColor(challenge.difficulty)} uppercase tracking-wider border border-[#695430] whitespace-nowrap`}
            >
              {challenge.difficulty}
            </span>
          </div>

          {/* Desktop Stats - Show on Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                  Model Performance
                </span>
                <div className="flex items-center gap-2 text-primary font-mono text-lg font-bold">
                  <span className="material-symbols-outlined text-base">
                    stars
                  </span>
                  {totalScore}
                </div>
              </div>
              <div className="h-6 w-px bg-[#332a1e]"></div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                  Certification
                </span>
                <div className="flex items-center gap-2 text-gold-accent font-mono text-lg font-bold">
                  <span className="material-symbols-outlined text-base">
                    workspace_premium
                  </span>
                  {earnedXp}
                </div>
              </div>
              <div className="h-6 w-px bg-[#332a1e]"></div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                  Prompts Left
                </span>
                <div className="flex items-center gap-2 text-white font-mono text-lg font-bold">
                  <span className="material-symbols-outlined text-base text-gold-accent">
                    send
                  </span>
                  {remainingPrompts}
                </div>
              </div>
            </div>
            <div className="h-8 w-px bg-[#332a1e]"></div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                Time Remaining
              </span>
              <div className="flex items-center gap-2 text-primary font-mono text-xl font-bold">
                <span className="material-symbols-outlined text-lg animate-pulse">
                  timer
                </span>
                {formatTime(timeRemaining)}
              </div>
            </div>
            <div className="h-8 w-px bg-[#332a1e]"></div>
            <button
              onClick={() => setIsTopUpModalOpen(true)}
              className="bg-primary hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-transform active:scale-95 shadow-[0_0_15px_rgba(245,159,10,0.3)]"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span>Add Tokens</span>
            </button>
          </div>
        </header>

        {/* Mobile Stats Sub-Navbar */}
        <div className="sm:hidden border-b border-[#332a1e] bg-sidebar-dark/30 px-4 py-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-primary font-mono text-sm font-bold">
                <span className="material-symbols-outlined text-sm">stars</span>
                {totalScore}
              </div>
              <div className="flex items-center gap-1 text-gold-accent font-mono text-sm font-bold">
                <span className="material-symbols-outlined text-sm">
                  workspace_premium
                </span>
                {earnedXp}
              </div>

              <div className="flex items-center gap-1 text-gold-accent font-mono text-sm font-bold">
                <span className="material-symbols-outlined text-sm">send</span>
                {remainingPrompts}
              </div>
            </div>
            <button
              onClick={() => setIsTopUpModalOpen(true)}
              className="bg-primary hover:bg-yellow-500 text-black font-bold py-1 px-3 rounded-lg flex items-center gap-1 transition-transform active:scale-95 shadow-[0_0_15px_rgba(245,159,10,0.3)]"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Add Tokens</span>
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 scroll-smooth pb-72">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 max-w-3xl ${message.type === "user" ? "ml-auto flex-row-reverse" : ""}`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                  message.type === "system"
                    ? "bg-[#493b22] border-[#695430]"
                    : message.type === "user"
                      ? "bg-gray-700 border-gray-600"
                      : "bg-[#493b22] border-[#695430]"
                }`}
              >
                <span
                  className={`material-symbols-outlined ${
                    message.type === "system"
                      ? "text-primary"
                      : message.type === "user"
                        ? "text-white"
                        : "text-primary"
                  }`}
                >
                  {message.type === "system"
                    ? "smart_toy"
                    : message.type === "user"
                      ? "person"
                      : "smart_toy"}
                </span>
              </div>

              <div
                className={`flex flex-col gap-2 ${message.type === "user" ? "items-end" : ""}`}
              >
                <div
                  className={`flex items-center gap-2 ${message.type === "user" ? "flex-row-reverse" : ""}`}
                >
                  {message.type !== "user" && (
                    <span className="text-gold-accent text-xs font-bold uppercase tracking-wider">
                      {message.type === "system"
                        ? "System Host"
                        : "AI Assistant"}
                    </span>
                  )}
                  <span className="text-gray-600 text-[10px]">
                    {message.timestamp}
                  </span>
                  {message.type === "user" && (
                    <span className="text-white text-xs font-bold uppercase tracking-wider">
                      You
                    </span>
                  )}
                </div>

                <div
                  className={`p-4 rounded-xl leading-relaxed shadow-sm border border-[#332a1e] ${
                    message.type === "user"
                      ? "bg-[#2a2620] rounded-tr-none text-right"
                      : "bg-surface-dark rounded-tl-none text-gray-200"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>

                  {message.score && (
                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex flex-col gap-1 w-full max-w-[200px]">
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Context Score</span>
                          <span className="text-primary">
                            {message.score}/100
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${message.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4 max-w-3xl">
              <div className="w-10 h-10 rounded-lg bg-[#493b22] flex items-center justify-center shrink-0 border border-[#695430]">
                <span className="material-symbols-outlined text-primary animate-spin">
                  refresh
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-gold-accent text-xs font-bold uppercase tracking-wider">
                    AI Assistant
                  </span>
                  <span className="text-gray-600 text-[10px]">
                    Generating...
                  </span>
                </div>
                <div className="p-4 bg-surface-dark rounded-xl rounded-tl-none border border-[#332a1e] text-gray-400">
                  Thinking...
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area (Sticky Bottom) */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-8 bg-linear-to-t from-background-dark via-background-dark to-transparent">
          <div className="max-w-4xl lg:max-w-4xl mx-auto w-full relative">
            {/* Training Complete - Stress Test Prompt */}
            {trainingComplete && currentPhase === 'training' && (
              <div className="bg-surface-dark border border-[#493b22] rounded-xl shadow-2xl shadow-black/50 overflow-hidden p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">Training Complete!</h3>
                  <p className="text-gray-300 mb-4">
                    Your final score: {totalScore}/100 • Earned: {earnedXp} XP
                  </p>
                  {canProceedToStressTest ? (
                    <button
                      onClick={startStressTest}
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 transition-colors"
                    >
                      {isLoading ? "Running Tests..." : "Start Stress Test"}
                    </button>
                  ) : (
                    <p className="text-red-400">Score too low to proceed to stress test. Minimum: {challenge.scoring.passingScore}</p>
                  )}
                </div>
              </div>
            )}

            {/* Stress Test Running */}
            {currentPhase === 'stress_test' && (
              <div className="bg-surface-dark border border-[#493b22] rounded-xl shadow-2xl shadow-black/50 overflow-hidden p-6">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-blue-400">Running stress tests...</p>
                  <p className="text-gray-400 text-sm">Testing your mini-model with hidden adversarial cases</p>
                </div>
              </div>
            )}

            {/* Stress Test Results */}
            {currentPhase === 'results' && stressTestResults && (
              <div className="bg-surface-dark border border-[#493b22] rounded-xl shadow-2xl shadow-black/50 overflow-hidden p-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-4">
                    <span className={getGradeColor(stressTestResults.grade)}>
                      Grade: {stressTestResults.grade}
                    </span>
                  </h3>
                  <div className="flex justify-center gap-8 mb-4">
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-white">
                        {stressTestResults.overallScore}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Overall Score</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-white">
                        {stressTestResults.robustnessScore}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Robustness Score</div>
                    </div>
                  </div>
                  <div className="flex justify-center gap-8 mb-4">
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        +{stressTestResults.totalXp}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">XP Earned</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-amber-400">
                        +{stressTestResults.coinsEarned}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Coins Earned</div>
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                {stressTestResults.achievements.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3">Achievements</h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {stressTestResults.achievements.map((achievement, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-900 text-purple-300 text-xs font-medium rounded-full"
                        >
                          🏆 {achievement}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg"
                  >
                    Try Again
                  </button>
                  {stressTestResults.canPublish && (
                    <button
                      className="px-6 py-3 bg-primary hover:bg-yellow-500 text-white font-medium rounded-lg"
                    >
                      Publish Mini-Model
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Regular Input Area - Only show during training */}
            {currentPhase === 'training' && !trainingComplete && (
              <>
                <div className="bg-surface-dark border border-[#493b22] rounded-xl shadow-2xl shadow-black/50 overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all duration-300">
                  {/* Text Area */}
                  <textarea
                    ref={textareaRef}
                    className="w-full bg-transparent text-white p-2 sm:p-3 lg:p-4 h-16 sm:h-20 lg:h-24 resize-none border-none focus:ring-0 placeholder-gray-600 font-display text-sm sm:text-base lg:text-lg leading-relaxed outline-0"
                    placeholder="Enter your prompt draft here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    maxLength={200}
                  />

                  {/* Toolbar & Footer - Mobile Responsive */}
                  <div className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 lg:py-3 bg-[#1e1912] border-t border-[#332a1e] flex justify-between items-center">
                    {/* Tools/Counter - Mobile Responsive */}
                    <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
                      <span className="text-[10px] sm:text-xs font-mono text-gray-400 flex items-center gap-1 sm:gap-2">
                        <span className="material-symbols-outlined text-sm sm:text-base lg:text-base">
                          text_fields
                        </span>
                        <span className="text-[10px] sm:text-xs">
                          {wordCount} <span className="text-gray-600">/ 200</span>
                        </span>
                      </span>

                      {/* Desktop Tools - Hidden on Small Mobile */}
                      <div className="hidden sm:flex h-3 sm:h-4 lg:h-4 w-px bg-[#332a1e]"></div>
                      <button
                        className="hidden sm:flex text-gray-500 hover:text-primary transition-colors"
                        title="Optimize"
                      >
                        <span className="material-symbols-outlined text-base sm:text-lg lg:text-xl">
                          auto_fix_high
                        </span>
                      </button>
                      <div className="hidden sm:flex h-3 sm:h-4 lg:h-4 w-px bg-[#332a1e]"></div>
                      <button
                        className="hidden sm:flex text-gray-500 hover:text-white transition-colors"
                        title="History"
                      >
                        <span className="material-symbols-outlined text-base sm:text-lg lg:text-xl">
                          history
                        </span>
                      </button>
                    </div>

                    {/* Submit Action - Mobile Responsive */}
                    <button
                      onClick={handleSubmit}
                      disabled={!input.trim() || isLoading}
                      className="bg-primary hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold py-1 sm:py-2 lg:py-2 px-2 sm:px-3 lg:px-6 rounded-lg flex items-center gap-1 sm:gap-2 transition-transform active:scale-95 shadow-[0_0_15px_rgba(245,159,10,0.3)] text-xs sm:text-sm lg:text-base"
                    >
                      <span className="text-xs sm:text-sm">
                        {isLoading ? "Processing..." : "Submit"}
                      </span>
                      <span className="material-symbols-outlined text-sm sm:text-base lg:text-lg">
                        send
                      </span>
                    </button>
                  </div>
                </div>

                {/* Helper Text - Mobile Responsive */}
                <div className="text-center mt-1 sm:mt-2 lg:mt-3">
                  <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                    Press{" "}
                    <span className="text-gray-400 font-bold">Cmd + Enter</span> to
                    submit
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Desktop Modal - Hidden on Mobile */}
      <div className="hidden lg:block">
        <Modal
          isOpen={isTopUpModalOpen}
          onClose={() => setIsTopUpModalOpen(false)}
          title="Top Up Prompts"
        >
          <TopUpModal
            isOpen={isTopUpModalOpen}
            onClose={() => setIsTopUpModalOpen(false)}
            onTopUpComplete={handleTopUpComplete}
          />
        </Modal>
      </div>

      {/* Mobile Bottom Sheet - Hidden on Desktop */}
      <div className="lg:hidden">
        <BottomSheet
          isOpen={isTopUpModalOpen}
          onClose={() => setIsTopUpModalOpen(false)}
          title="Top Up Prompts"
        >
          <TopUpModal
            isOpen={isTopUpModalOpen}
            onClose={() => setIsTopUpModalOpen(false)}
            onTopUpComplete={handleTopUpComplete}
          />
        </BottomSheet>
      </div>
    </div>
  );
}
