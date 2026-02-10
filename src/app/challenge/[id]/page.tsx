"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/app/lib/use-auth";
import Modal from "@/components/Modal";
import BottomSheet from "@/components/BottomSheet";
import TopUpModal from "@/components/TopUpModal";
import Leaderboard from "@/components/Leaderboard";
import "./globals.css";

interface Message {
  id: string;
  type: "system" | "user" | "ai";
  content: string;
  timestamp: string;
  score?: number;
  breakdown?: {
    constraint_accuracy: number;
    clarity: number;
    creativity: number;
    brevity: number;
    improvement_per_turn?: number;
    correctness?: number;
    explanation_quality?: number;
  };
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  gameType: "image" | "text" | "transformation" | "refinement" | "evaluation";
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
    breakdown: any;
  };
}

interface ChatResponse {
  chatId: string;
  messageId: string;
  output: string;
  score_text: string;
  breakdown: {
    constraint_accuracy: number;
    clarity: number;
    creativity: number;
    brevity: number;
    improvement_per_turn?: number;
    correctness?: number;
    explanation_quality?: number;
  };
  turnNumber: number;
  totalScore: number;
  earnedXp: number;
  remainingPrompts: number;
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
  const [timeRemaining, setTimeRemaining] = useState(299); // 4:59 in seconds
  const [currentTurn, setCurrentTurn] = useState(1);
  const [previousOutputs, setPreviousOutputs] = useState<string[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const [chatId, setChatId] = useState<string | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);
  const [remainingPrompts, setRemainingPrompts] = useState(0);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [userPrize, setUserPrize] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

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

      // Mock challenge data - in real app, fetch from API
      const mockChallenge: Challenge = {
        id: challengeId,
        title: "Tweet Storm Generator",
        description: "Generate a thread of 5 tweets about the future of crypto",
        gameType: "text",
        difficulty: "intermediate",
        task: {
          objective: "Generate a 5-tweet thread from a paragraph",
          constraints: {
            required: ["all main points covered", "5 tweets exactly"],
            forbidden: ["blockchain", "grammar errors"],
            optional: ["humor or emojis"],
          },
        },
        gameplay: {
          turnBased: false,
          timeLimitSeconds: 300,
          scoringMode: "quality_score",
        },
        scoring: {
          totalScore: 100,
          breakdown: {
            constraint_accuracy: 40,
            clarity: 30,
            creativity: 20,
            brevity: 10,
          },
        },
      };

      setChallenge(mockChallenge);

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
      const systemMessage: Message = {
        id: "system-1",
        type: "system",
        content: `Welcome to the arena. Your goal: ${mockChallenge.task.objective}.\n\nConstraints:\n${mockChallenge.task.constraints.required.map((c) => `• ${c}`).join("\n")}\n${mockChallenge.task.constraints.forbidden.length > 0 ? `\nForbidden:\n${mockChallenge.task.constraints.forbidden.map((c) => `• ${c}`).join("\n")}` : ""}`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages([systemMessage]);
    };

    if (user && challengeId) {
      loadChallengeAndChatHistory();
    }
  }, [challengeId, user]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0 && !isLoading) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeRemaining, isLoading]);

  // Auto-scroll to bottom
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
          chatId: chatId || undefined, // Send chatId if it exists
          turnNumber: currentTurn,
          previousOutputs: previousOutputs,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit prompt");
      }

      const result: ChatResponse = await response.json();

      // Update chat state
      if (!chatId) {
        setChatId(result.chatId); // Set chatId for first interaction
      }

      const aiMessage: Message = {
        id: result.messageId,
        type: "ai",
        content: result.output,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        score: result.score_text
          ? parseInt(result.score_text.match(/(\d+)\/\d+/)?.[1] || "0")
          : undefined,
        breakdown: result.breakdown,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setPreviousOutputs((prev) => [...prev, result.output]);
      setTotalScore(result.totalScore);
      setEarnedXp(result.earnedXp);
      setRemainingPrompts(result.remainingPrompts);

      if (challenge.gameplay.turnBased) {
        setCurrentTurn(result.turnNumber + 1);
      }
    } catch (error) {
      console.error("Error submitting prompt:", error);
      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: "system",
        content:
          "Sorry, there was an error processing your request. Please try again.",
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTopUpComplete = (additionalPrompts: number) => {
    setRemainingPrompts(prev => prev + additionalPrompts);
  };

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
                terminal
              </span>
            </div>
            <div>
              <h1 className="text-white text-lg font-bold tracking-tight">
                POSHPROMPT
              </h1>
              <p className="text-gold-accent text-xs tracking-wider uppercase opacity-80">
                Challenge Arena
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
                Rank: Prompt Engineer
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
        {/* Floating Leaderboard Button */}
        <button
          onClick={() => setIsLeaderboardOpen(!isLeaderboardOpen)}
          className="fixed right-4 top-24 z-30 bg-primary hover:bg-yellow-500 text-black p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
          title="Toggle Leaderboard"
        >
          <span className="material-symbols-outlined text-xl">
            emoji_events
          </span>
          {userRank && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-background-dark">
              {userRank}
            </span>
          )}
        </button>
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
                  Total Score
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
                  XP Earned
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
              {userRank && (
                <>
                  <div className="h-6 w-px bg-[#332a1e]"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                      Rank
                    </span>
                    <div className="flex items-center gap-2 text-yellow-400 font-mono text-lg font-bold">
                      <span className="material-symbols-outlined text-base">
                        emoji_events
                      </span>
                      #{userRank}
                    </div>
                  </div>
                </>
              )}
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
              <span>Top Up</span>
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
              <span>Top Up</span>
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
            {/* Input Container */}
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

      {/* Right Leaderboard Offcanvas */}
      <div
        className={`
          fixed inset-y-0 right-0 w-80 bg-sidebar-dark border-l border-[#332a1e] shadow-2xl z-40 transform transition-transform duration-300 ease-in-out
          ${isLeaderboardOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Offcanvas Header */}
        <div className="p-6 border-b border-[#332a1e] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-xl">
              emoji_events
            </span>
            <h3 className="text-white text-lg font-bold tracking-tight">
              Leaderboard
            </h3>
          </div>
          <button
            onClick={() => setIsLeaderboardOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Leaderboard Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <Leaderboard challengeId={challengeId} userId={user?.id} />
        </div>
      </div>

      {/* Overlay for mobile */}
      {isLeaderboardOpen && (
        <div
          onClick={() => setIsLeaderboardOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}
    </div>
  );
}
