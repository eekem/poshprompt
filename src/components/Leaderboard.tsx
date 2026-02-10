"use client";

import { useState, useEffect } from "react";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  userImage?: string;
  totalScore: number;
  earnedXp: number;
  turns: number;
  prize: number;
  completedAt: string;
}

interface LeaderboardProps {
  challengeId: string;
  userId?: string;
}

export default function Leaderboard({ challengeId, userId }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [userPrize, setUserPrize] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [totalParticipants, setTotalParticipants] = useState(0);

  useEffect(() => {
    fetchLeaderboard();
  }, [challengeId, userId]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        challengeId,
        ...(userId && { userId }),
      });

      const response = await fetch(`/api/leaderboard?${params}`);
      const data = await response.json();

      setLeaderboard(data.leaderboard || []);
      setUserRank(data.userRank);
      setUserPrize(data.userPrize);
      setTotalParticipants(data.totalParticipants);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-400";
    if (rank === 2) return "text-gray-300";
    if (rank === 3) return "text-orange-600";
    return "text-gray-400";
  };

  if (loading) {
    return (
      <div className="bg-surface-dark border border-[#332a1e] rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-[#332a1e] rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-[#332a1e] rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-dark border border-[#332a1e] rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Leaderboard</h3>
        <span className="text-sm text-gray-400">
          {totalParticipants} participants
        </span>
      </div>

      {/* User's Rank */}
      {userRank && (
        <div className="bg-gradient-to-r from-[#f59e0b]/20 to-[#d97706]/20 border border-[#f59e0b]/30 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`text-2xl font-bold ${getRankColor(userRank)}`}>
                {getRankDisplay(userRank)}
              </span>
              <div>
                <p className="text-sm text-gray-400">Your Rank</p>
                <p className="text-lg font-semibold text-white">#{userRank}</p>
              </div>
            </div>
            {userPrize > 0 && (
              <div className="text-right">
                <p className="text-sm text-gray-400">Prize</p>
                <p className="text-lg font-bold text-green-400">
                  ${userPrize.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Leaderboard List */}
      <div className="space-y-2 sm:space-y-3">
        {leaderboard.map((entry) => (
          <div
            key={entry.userId}
            className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border ${
              entry.userId === userId
                ? "bg-[#f59e0b]/10 border-[#f59e0b]/30"
                : "bg-[#211b11] border-[#332a1e]"
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-2 min-w-0 flex-1">
              {/* Rank */}
              <div
                className={`text-sm sm:text-lg font-bold ${getRankColor(entry.rank)}`}
              >
                {getRankDisplay(entry.rank)}
              </div>

              {/* User Avatar */}
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-600 border border-[#493b22] flex items-center justify-center overflow-hidden shrink-0">
                {entry.userImage ? (
                  <img
                    src={entry.userImage}
                    alt={entry.userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-white text-xs sm:text-sm">
                    person
                  </span>
                )}
              </div>

              {/* User Info */}
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-white truncate">
                  {entry.userName}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-400">
                  {entry.earnedXp} XP • {entry.turns} turns
                </p>
              </div>
            </div>

            {/* Score and Prize */}
            <div className="text-right shrink-0 ml-2">
              <p className="text-sm sm:text-lg font-bold text-white">
                {entry.totalScore}
              </p>
              {entry.prize > 0 ? (
                <p className="text-[10px] sm:text-xs font-bold text-green-400">
                  ${entry.prize.toFixed(2)}
                </p>
              ) : (
                <p className="text-[10px] sm:text-xs text-gray-500">$0.00</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {leaderboard.length === 0 && (
        <div className="text-center py-8">
          <span className="material-symbols-outlined text-4xl text-gray-500 mb-2">
            leaderboard
          </span>
          <p className="text-gray-400">No participants yet</p>
          <p className="text-sm text-gray-500">
            Be the first to complete this challenge!
          </p>
        </div>
      )}
    </div>
  );
}
