'use client';

import { useState } from 'react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'challenge',
      title: 'New Challenge Available',
      message: 'Recreation Challenge #1248 is now live. Test your architectural prompting skills!',
      time: '5 minutes ago',
      read: false,
      icon: 'psychology'
    },
    {
      id: 2,
      type: 'reward',
      title: 'Round Ending Soon',
      message: 'Season 4 - Round 3 ends in 4h 22m. Your pending rewards: 2,450 coins and $24.50.',
      time: '1 hour ago',
      read: false,
      icon: 'card_giftcard'
    },
    {
      id: 3,
      type: 'achievement',
      title: 'XP Milestone Reached',
      message: 'Congratulations! You\'ve earned 8,750 total XP and reached Grandmaster tier.',
      time: '3 hours ago',
      read: true,
      icon: 'military_tech'
    },
    {
      id: 4,
      type: 'challenge',
      title: 'Challenge Completed',
      message: 'Problem-Solving Challenge #892 completed successfully. +320 XP earned.',
      time: '5 hours ago',
      read: true,
      icon: 'check_circle'
    },
    {
      id: 5,
      type: 'system',
      title: 'Target Refresh Available',
      message: 'Your XP target has been refreshed. New target: 1,250 XP for next rank up.',
      time: '1 day ago',
      read: true,
      icon: 'refresh'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  return (
    <div className="p-4 sm:p-8 lg:p-12 flex flex-col items-center">
      <div className="max-w-[1200px] w-full flex flex-col gap-12">
        {/* Header */}
        <div className="text-center">
          <p className="text-[#f59e0b] text-sm font-bold uppercase tracking-[0.5em] mb-4 shadow-[0_0_10px_rgba(245,158,11,0.5)]">Notifications</p>
          <h1 className="text-white text-3xl sm:text-4xl lg:text-6xl font-black leading-tight tracking-[-0.05em]">Your Updates</h1>
          <p className="text-[#a8906e] text-xl font-light mt-4">Stay informed about your progress and opportunities.</p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <h3 className="text-white text-lg font-bold flex items-center">
              {unreadCount > 0 && (
                <span className="bg-[#f59e0b] text-black text-xs font-bold px-2 py-1 rounded-full mr-2">
                  {unreadCount}
                </span>
              )}
              Recent Notifications
            </h3>
          </div>
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="text-[#f59e0b] text-sm font-bold uppercase tracking-wider hover:text-white transition-colors"
            >
              Mark All as Read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="bg-[rgba(22,17,10,0.6)] backdrop-blur-md border border-[rgba(245,158,11,0.1)] rounded-2xl sm:rounded-3xl p-6 sm:p-8">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-6xl text-[#a8906e] mb-4">notifications_none</span>
              <p className="text-[#a8906e] text-lg">No notifications yet</p>
              <p className="text-[#a8906e]/60 text-sm mt-2">We'll notify you about important updates here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-4 rounded-xl border transition-all ${
                    !notification.read 
                      ? 'bg-[#f59e0b]/10 border-[#f59e0b]/30' 
                      : 'bg-[#211b11]/30 border-[#f59e0b]/10'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        !notification.read ? 'bg-[#f59e0b]/20' : 'bg-[#211b11]/50'
                      }`}>
                        <span className={`material-symbols-outlined text-lg ${
                          !notification.read ? 'text-[#f59e0b]' : 'text-[#a8906e]'
                        }`}>
                          {notification.icon}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className={`font-bold ${
                          !notification.read ? 'text-white' : 'text-[#a8906e]'
                        }`}>
                          {notification.title}
                        </h4>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <span className="text-[#a8906e] text-xs whitespace-nowrap order-2 sm:order-1">
                            {notification.time}
                          </span>
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-[#a8906e]/50 hover:text-[#a8906e] transition-colors order-1 sm:order-2"
                          >
                            <span className="material-symbols-outlined text-[16px]">close</span>
                          </button>
                        </div>
                      </div>
                      <p className="text-[#a8906e] text-sm leading-relaxed">
                        {notification.message}
                      </p>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="mt-2 text-[#f59e0b] text-xs font-bold uppercase tracking-wider hover:text-white transition-colors"
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notification Settings */}
        <div className="bg-[rgba(22,17,10,0.6)] backdrop-blur-md border border-[rgba(245,158,11,0.1)] rounded-2xl sm:rounded-3xl p-6 sm:p-8">
          <h3 className="text-white text-xl font-bold mb-6">Notification Preferences</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-[#211b11]/50 rounded-xl border border-[#f59e0b]/10">
              <div>
                <p className="text-white font-bold">Challenge Updates</p>
                <p className="text-[#a8906e] text-sm">New challenges and challenge completions</p>
              </div>
              <button className="w-12 h-6 rounded-full bg-[#f59e0b] relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </button>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-[#211b11]/50 rounded-xl border border-[#f59e0b]/10">
              <div>
                <p className="text-white font-bold">Reward Notifications</p>
                <p className="text-[#a8906e] text-sm">Round endings and reward finalizations</p>
              </div>
              <button className="w-12 h-6 rounded-full bg-[#f59e0b] relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </button>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-[#211b11]/50 rounded-xl border border-[#f59e0b]/10">
              <div>
                <p className="text-white font-bold">Achievement Milestones</p>
                <p className="text-[#a8906e] text-sm">XP milestones and tier advancements</p>
              </div>
              <button className="w-12 h-6 rounded-full bg-[#f59e0b] relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </button>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-[#211b11]/50 rounded-xl border border-[#f59e0b]/10">
              <div>
                <p className="text-white font-bold">Target Refreshes</p>
                <p className="text-[#a8906e] text-sm">New XP targets available</p>
              </div>
              <button className="w-12 h-6 rounded-full bg-[#a8906e]/30 relative">
                <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-[#a8906e]/40 text-sm italic py-8">
          "Stay informed, stay motivated - every notification is a step toward mastery."
        </p>
      </div>
    </div>
  );
}
