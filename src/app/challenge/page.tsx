'use client';

import { useAuth } from '@/app/lib/use-auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
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
    xp: number;
    coins: number;
  };
}

export default function ChallengeListPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const itemsPerPage = 6;
  const [userStats, setUserStats] = useState({
    totalXP: 0,
    totalChallenges: 0,
    ongoingChallenges: 0,
    totalPrompts: 0,
    earnedBalance: 0.0,
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

  // Fetch challenges from database
  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      
      try {
        // Fetch challenges
        const challengesResponse = await fetch('/api/challenges');
        if (challengesResponse.ok) {
          const data = await challengesResponse.json();
          setChallenges(data.challenges || []);
        }

        // Fetch user stats
        const statsResponse = await fetch(`/api/user/stats?userId=${user.id}`);
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setUserStats({
            totalXP: statsData.totalXP || 0,
            totalChallenges: statsData.totalChallenges || 0,
            ongoingChallenges: statsData.ongoingChallenges || 0,
            totalPrompts: statsData.totalPrompts || 0,
            earnedBalance: statsData.earnedBalance || 0.0,
          });
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
  
        setUserStats({
          totalXP: 0,
          totalChallenges: 0,
          ongoingChallenges: 0,
          totalPrompts: 0,
          earnedBalance: 0,
        });
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchData();
    }
  }, [user]);

  // Filter and paginate challenges
  const filteredChallenges = useMemo(() => {
    return challenges.filter(challenge => 
      challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [challenges, searchTerm]);

  const totalPages = Math.ceil(filteredChallenges.length / itemsPerPage);
  const paginatedChallenges = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredChallenges.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredChallenges, currentPage]);

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
        xp={userStats.totalXP}
        earnedXP={Math.floor(userStats.earnedBalance * 0.1)} // Calculate from earned balance
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
                <p className="text-sm text-gray-400">Total XP</p>
                <p className="text-2xl font-bold text-primary">{userStats.totalXP.toLocaleString()}</p>
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
                <p className="text-sm text-gray-400">Challenges</p>
                <p className="text-lg font-bold text-green-400">{userStats.totalChallenges} Total</p>
                <p className="text-sm text-green-300">{userStats.ongoingChallenges} Ongoing</p>
              </div>
            </div>
          </div>
        </div>

        {/* Challenges Section */}
        <div>
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Available Challenges</h2>
              <p className="text-sm text-gray-400">
                {filteredChallenges.length === challenges.length 
                  ? `${challenges.length} challenges available` 
                  : `${filteredChallenges.length} of ${challenges.length} challenges found`}
              </p>
            </div>
            {/* Search Bar */}
            <div className="relative w-full sm:max-w-md">
              <input
                type="text"
                placeholder="Search challenges..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-surface-dark border border-[#332a1e] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary/50 transition-colors"
              />
              <span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                search
              </span>
            </div>
          </div>

          {/* Challenges List */}
        {filteredChallenges.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12 sm:py-16">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#493b22] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-primary text-3xl sm:text-4xl">smart_toy</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
              {searchTerm ? 'No Challenges Found' : 'No Challenges Available'}
            </h3>
            <p className="text-gray-400 mb-6 sm:mb-8 max-w-sm sm:max-w-md mx-auto px-4">
              {searchTerm ? 'Try adjusting your search terms to find what you\'re looking for.' : 'Challenge engineers are working hard to create new AI challenges for you. Check back soon!'}
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
              {paginatedChallenges.map((challenge) => (
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
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-2 sm:line-clamp-1">
                      {challenge.description}
                    </p>
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
                      <span className="font-mono font-semibold">{challenge.rewards.xp}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gold-accent">
                      <span className="material-symbols-outlined text-sm sm:text-base">monetization_on</span>
                      <span className="font-mono font-semibold">{challenge.rewards.coins}</span>
                    </div>
                  </div>
                </Link>
              ))}
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
