'use client';

import { useAuth } from '@/app/lib/use-auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import DashboardNavbar from '@/components/DashboardNavbar';
import Modal from '@/components/Modal';
import TopUpModal from '@/components/TopUpModal';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  gameType: 'image' | 'text' | 'transformation' | 'refinement' | 'evaluation';
  estimatedTime: number;
  rewards: {
    certification: number;
    tokens: number;
  };
  userModel?: {
    id: string;
    title: string;
    description: string;
    finalScore: number;
    robustnessScore: number;
    totalXp: number;
    coinsEarned: number;
    tier?: string;
    percentile?: number;
    createdAt: string;
  };
}

interface UserModel {
  id: string;
  title: string;
  description: string;
  image?: string;
  finalScore: number;
  robustnessScore: number;
  totalXp: number;
  coinsEarned: number;
  isPublic: boolean;
  isPublished: boolean;
  publishedAt?: string;
  tier?: string;
  percentile?: number;
  isRewardEligible: boolean;
  createdAt: string;
  updatedAt: string;
  challenge: {
    id: string;
    title: string;
    difficulty: string;
    gameType: string;
  };
}

function ChallengeListContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userChallenges, setUserChallenges] = useState<Challenge[]>([]);
  const [userModels, setUserModels] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'my-challenges' | 'my-models'>('all');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const itemsPerPage = 6;
  const [userStats, setUserStats] = useState({
    totalCertification: 0,
    totalChallenges: 0,
    ongoingChallenges: 0,
    totalPrompts: 0,
    tokenBalance: 0.0,
  });
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Update URL when search or page changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (currentPage > 1) params.set('page', currentPage.toString());
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [searchTerm, currentPage]);

  // Fetch user stats on initial load
  useEffect(() => {
    async function fetchStats() {
      if (!user) return;
      
      try {
        const statsResponse = await fetch(`/api/user/stats?userId=${user.id}`);
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setUserStats({
            totalCertification: statsData.totalCertification || 0,
            totalChallenges: statsData.totalChallenges || 0,
            ongoingChallenges: statsData.ongoingChallenges || 0,
            totalPrompts: statsData.totalPrompts || 0,
            tokenBalance: statsData.tokenBalance || 0.0,
          });
        }
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
        setUserStats({
          totalCertification: 0,
          totalChallenges: 0,
          ongoingChallenges: 0,
          totalPrompts: 0,
          tokenBalance: 0,
        });
      }
    }

    if (user) {
      fetchStats();
    }
  }, [user]);

  // Fetch challenges from database
  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      
      try {
        // Always fetch challenges for 'all' tab
        if (activeTab === 'all') {
          const challengesResponse = await fetch('/api/challenges');
          if (challengesResponse.ok) {
            const data = await challengesResponse.json();
            setChallenges(data.challenges || []);
          }
        }

        // Always fetch user challenges for 'my-challenges' tab
        if (activeTab === 'my-challenges') {
          const userChallengesResponse = await fetch(`/api/user/challenges?userId=${user.id}`);
          if (userChallengesResponse.ok) {
            const userData = await userChallengesResponse.json();
            setUserChallenges(userData.userChallenges || []);
          }
        }

        // Always fetch user models for 'my-models' tab
        if (activeTab === 'my-models') {
          const userModelsResponse = await fetch(`/api/user/models?userId=${user.id}`);
          if (userModelsResponse.ok) {
            const modelsData = await userModelsResponse.json();
            setUserModels(modelsData.models || []);
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchData();
    }
  }, [user, activeTab]);

  // Filter and paginate challenges
  const filteredChallenges = useMemo(() => {
    const challengesToFilter = activeTab === 'all' ? challenges : 
                            activeTab === 'my-challenges' ? userChallenges : [];
    
    return challengesToFilter.filter(challenge => 
      challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [challenges, userChallenges, searchTerm, activeTab]);

  // Filter models
  const filteredModels = useMemo(() => {
    if (activeTab !== 'my-models') return [];
    
    return userModels.filter(model => 
      model.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [userModels, searchTerm, activeTab]);

  const totalPages = Math.ceil((activeTab === 'my-models' ? filteredModels.length : filteredChallenges.length) / itemsPerPage);
  const paginatedChallenges = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    if (activeTab === 'my-models') {
      return filteredModels.slice(startIndex, startIndex + itemsPerPage);
    }
    return filteredChallenges.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredChallenges, filteredModels, currentPage, activeTab]);

  const handleTabChange = (tab: 'all' | 'my-challenges' | 'my-models') => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when changing tabs
    setSearchTerm(''); // Clear search when changing tabs
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/signout', { method: 'POST' });
      if (response.ok) {
        router.push('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleTopUpComplete = (additionalPrompts: number) => {
    setUserStats(prev => ({
      ...prev,
      totalPrompts: prev.totalPrompts + additionalPrompts
    }));
  };

  // Show loading state while checking authentication or fetching data
  if (authLoading || loading) {
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-900 text-green-300';
      case 'intermediate': return 'bg-yellow-900 text-yellow-300';
      case 'advanced': return 'bg-red-900 text-red-300';
      default: return 'bg-gray-900 text-gray-300';
    }
  };

  const getGameIcon = (gameType: string) => {
    switch (gameType) {
      case 'image': return 'palette';
      case 'text': return 'edit_note';
      case 'transformation': return 'transform';
      case 'refinement': return 'auto_fix_high';
      case 'evaluation': return 'grading';
      default: return 'smart_toy';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-background-dark text-white">
      {/* Enhanced Navbar */}
      <DashboardNavbar 
        pendingCoins={userStats.totalChallenges * 50} // Calculate from completed challenges
        certification={userStats.totalCertification}
        earnedCertification={Math.floor(userStats.tokenBalance * 0.1)} // Calculate from token balance
        promptBalance={userStats.totalPrompts}
        userAvatar={user?.image || undefined}
        onLogout={handleLogout}
        onTopUp={() => setIsTopUpModalOpen(true)}
      />

      {/* Top Up Modal */}
      <Modal isOpen={isTopUpModalOpen} onClose={() => setIsTopUpModalOpen(false)}>
        <TopUpModal 
          isOpen={isTopUpModalOpen} 
          onClose={() => setIsTopUpModalOpen(false)} 
          onTopUpComplete={handleTopUpComplete}
        />
      </Modal>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:pb-8 pt-22">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-surface-dark p-4 sm:p-6 rounded-lg border border-[#332a1e]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-black">emoji_events</span>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Certification</p>
                <p className="text-2xl font-bold text-primary">{userStats.totalCertification.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-surface-dark p-4 sm:p-6 rounded-lg border border-[#332a1e]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white">psychology</span>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Prompts</p>
                <p className="text-2xl font-bold text-blue-400">{userStats.totalPrompts.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-surface-dark p-4 sm:p-6 rounded-lg border border-[#332a1e]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white">assignment</span>
              </div>
              <div>
                <p className="text-sm text-gray-400">Training Sessions</p>
                <p className="text-lg font-bold text-green-400">{userStats.totalChallenges} Total</p>
                <p className="text-sm text-green-300">{userStats.ongoingChallenges} In Progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* Training Sessions Section */}
        <div>
          {/* Tabs */}
          <div className="flex space-x-1 mb-6">
            <button
              onClick={() => handleTabChange('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-primary text-black'
                  : 'bg-surface-dark border border-[#332a1e] text-gray-400 hover:text-white hover:border-primary/50'
              }`}
            >
              All Challenges
            </button>
            <button
              onClick={() => handleTabChange('my-challenges')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'my-challenges'
                  ? 'bg-primary text-black'
                  : 'bg-surface-dark border border-[#332a1e] text-gray-400 hover:text-white hover:border-primary/50'
              }`}
            >
              My Challenges
            </button>
            <button
              onClick={() => handleTabChange('my-models')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'my-models'
                  ? 'bg-primary text-black'
                  : 'bg-surface-dark border border-[#332a1e] text-gray-400 hover:text-white hover:border-primary/50'
              }`}
            >
              My Models
            </button>
          </div>

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                {activeTab === 'all' ? 'Available Training Sessions' :
                 activeTab === 'my-challenges' ? 'My Challenge Submissions' :
                 'My AI Models'}
              </h2>
              <p className="text-sm text-gray-400">
                {activeTab === 'all' ? (
                  filteredChallenges.length === challenges.length 
                    ? `${challenges.length} training sessions available` 
                    : `${filteredChallenges.length} of ${challenges.length} training sessions found`
                ) : activeTab === 'my-challenges' ? (
                  `${userChallenges.length} challenge submissions`
                ) : (
                  `${userModels.length} models created`
                )}
              </p>
            </div>
            {/* Search Bar */}
            <div className="relative w-full sm:max-w-md">
              <input
                type="text"
                placeholder={activeTab === 'my-models' ? "Search models..." : "Search training sessions..."}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-surface-dark border border-[#332a1e] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary/50 transition-colors"
              />
              <span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                search
              </span>
            </div>
          </div>

        {/* List Content */}
        {(activeTab === 'my-models' ? filteredModels.length === 0 : filteredChallenges.length === 0) ? (
          /* Empty State */
          <div className="text-center py-12 sm:py-16">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#493b22] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-primary text-3xl sm:text-4xl">
                {activeTab === 'my-models' ? 'model_training' : 'smart_toy'}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
              {searchTerm ? (activeTab === 'my-models' ? 'No Models Found' : 'No Training Sessions Found') : 
               (activeTab === 'my-models' ? 'No Models Created' : 'No Training Sessions Available')}
            </h3>
            <p className="text-gray-400 mb-6 sm:mb-8 max-w-sm sm:max-w-md mx-auto px-4">
              {searchTerm ? 'Try adjusting your search terms to find what you\'re looking for.' : 
               (activeTab === 'my-models' ? 'You haven\'t created any AI models yet. Start a challenge to build your first model!' :
                'AI training specialists are working hard to create new training sessions for you. Check back soon!')}
            </p>
            {searchTerm && (
              <button
                onClick={() => handleSearch('')}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Vertical List Container */}
            <div className="flex flex-col gap-3 sm:gap-4">
              {paginatedChallenges.map((item) => {
                if (activeTab === 'my-models') {
                  const model = item as UserModel;
                  return (
                    <Link 
                      key={model.id} 
                      href={`/challenge/${model.challenge.id}`}
                      className="group flex flex-col sm:flex-row sm:items-center gap-4 bg-surface-dark border border-[#332a1e] rounded-lg p-4 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                    >
                      {/* Icon */}
                      <div className="w-12 h-12 bg-[#493b22] rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                        <span className="material-symbols-outlined text-primary text-xl">
                          {getGameIcon(model.challenge.gameType)}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-primary transition-colors truncate">
                            {model.title}
                          </h3>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${getDifficultyColor(model.challenge.difficulty)} uppercase tracking-wider shrink-0`}>
                            {model.challenge.difficulty}
                          </span>
                          {model.tier && (
                            <span className={`px-2 py-1 rounded text-xs font-bold bg-purple-900 text-purple-300 uppercase tracking-wider shrink-0`}>
                              {model.tier}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-2 sm:line-clamp-1">
                          {model.description}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          Challenge: {model.challenge.title}
                        </p>
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm shrink-0">
                        <div className="flex items-center gap-1 text-primary">
                          <span className="material-symbols-outlined text-sm sm:text-base">stars</span>
                          <span className="font-mono font-semibold">{model.finalScore.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-blue-400">
                          <span className="material-symbols-outlined text-sm sm:text-base">psychology</span>
                          <span className="font-mono font-semibold">{model.totalXp}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gold-accent">
                          <span className="material-symbols-outlined text-sm sm:text-base">monetization_on</span>
                          <span className="font-mono font-semibold">{model.coinsEarned}</span>
                        </div>
                      </div>
                    </Link>
                  );
                } else {
                  const challenge = item as Challenge;
                  return (
                    <Link 
                      key={challenge.id} 
                      href={`/challenge/${challenge.id}`}
                      className="group flex flex-col sm:flex-row sm:items-center gap-4 bg-surface-dark border border-[#332a1e] rounded-lg p-4 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                    >
                      {/* Icon */}
                      <div className="w-12 h-12 bg-[#493b22] rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                        <span className="material-symbols-outlined text-primary text-xl">
                          {getGameIcon(challenge.gameType)}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-primary transition-colors truncate">
                            {challenge.title}
                          </h3>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${getDifficultyColor(challenge.difficulty)} uppercase tracking-wider shrink-0`}>
                            {challenge.difficulty}
                          </span>
                          {activeTab === 'my-challenges' && challenge.userModel && (
                            <span className="px-2 py-1 rounded text-xs font-bold bg-green-900 text-green-300 uppercase tracking-wider shrink-0">
                              Completed
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-2 sm:line-clamp-1">
                          {challenge.description}
                        </p>
                        {activeTab === 'my-challenges' && challenge.userModel && (
                          <div className="mt-2 p-2 bg-[#493b22] rounded border border-[#332a1e]">
                            <p className="text-xs text-gray-300 mb-1">Your Model: {challenge.userModel.title}</p>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-primary">Score: {challenge.userModel.finalScore.toFixed(1)}</span>
                              <span className="text-blue-400">XP: {challenge.userModel.totalXp}</span>
                              <span className="text-gold-accent">Coins: {challenge.userModel.coinsEarned}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm shrink-0">
                        <div className="flex items-center gap-1 sm:gap-2 text-gray-400">
                          <span className="material-symbols-outlined text-sm sm:text-base">timer</span>
                          <span className="hidden sm:inline">{formatTime(challenge.estimatedTime)}</span>
                          <span className="sm:hidden">{formatTime(challenge.estimatedTime).replace('m', '')}m</span>
                        </div>
                        <div className="flex items-center gap-1 text-primary">
                          <span className="material-symbols-outlined text-sm sm:text-base">stars</span>
                          <span className="font-mono font-semibold">{challenge.rewards.certification}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gold-accent">
                          <span className="material-symbols-outlined text-sm sm:text-base">monetization_on</span>
                          <span className="font-mono font-semibold">{challenge.rewards.tokens}</span>
                        </div>
                      </div>
                    </Link>
                  );
                }
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 sm:gap-2 mt-6 sm:mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-surface-dark border border-[#332a1e] text-gray-400 hover:text-white hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="material-symbols-outlined text-sm sm:text-base">chevron_left</span>
                </button>
                
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                        currentPage === page
                          ? 'bg-primary text-black'
                          : 'bg-surface-dark border border-[#332a1e] text-gray-400 hover:text-white hover:border-primary/50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-surface-dark border border-[#332a1e] text-gray-400 hover:text-white hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="material-symbols-outlined text-sm sm:text-base">chevron_right</span>
                </button>
              </div>
            )}
          </>
        )}
        </div>
      </div>
    </div>
  );
}

export default function ChallengeListPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-background-dark">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <ChallengeListContent />
    </Suspense>
  );
}
