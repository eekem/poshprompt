'use client';

import { useState } from 'react';

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'subscription'>('profile');
  const [notifications, setNotifications] = useState({
    challengeUpdates: true,
    rewardNotifications: true,
    roundEndings: true,
    targetRefresh: false,
  });

  return (
    <div className="p-4 sm:p-8 lg:p-12 flex flex-col items-center">
      <div className="max-w-[1200px] w-full flex flex-col gap-12">
        {/* Header */}
        <div className="text-center">
          <p className="text-[#f59e0b] text-sm font-bold uppercase tracking-[0.5em] mb-4 shadow-[0_0_10px_rgba(245,158,11,0.5)]">Profile Settings</p>
          <h1 className="text-white text-3xl sm:text-4xl lg:text-6xl font-black leading-tight tracking-[-0.05em]">Your Account</h1>
          <p className="text-[#a8906e] text-xl font-light mt-4">Manage your profile and preferences.</p>
        </div>

        {/* Profile Summary Card */}
        <div className="bg-[rgba(22,17,10,0.6)] backdrop-blur-md border border-[rgba(245,158,11,0.1)] rounded-2xl sm:rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-full flex items-center justify-center">
              <span className="text-white text-2xl sm:text-3xl font-black">PA</span>
            </div>
            <div className="flex-1">
              <h2 className="text-white text-2xl font-bold">Prompt Alchemist</h2>
              <p className="text-[#a8906e] text-lg mb-4">Member since October 2024</p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div>
                  <p className="text-white text-xl font-bold">8,750</p>
                  <p className="text-[#a8906e] text-sm">Total XP</p>
                </div>
                <div>
                  <p className="text-white text-xl font-bold">Grandmaster</p>
                  <p className="text-[#a8906e] text-sm">Current Tier</p>
                </div>
                <div>
                  <p className="text-white text-xl font-bold">127</p>
                  <p className="text-[#a8906e] text-sm">Challenges</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-[rgba(22,17,10,0.6)] backdrop-blur-md border border-[rgba(245,158,11,0.1)] rounded-2xl sm:rounded-3xl p-2 flex gap-2 flex-col sm:flex-row">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 px-4 sm:px-6 py-3 rounded-xl font-bold uppercase tracking-wider transition-all ${
              activeTab === 'profile' 
                ? 'bg-[#f59e0b] text-black' 
                : 'text-[#a8906e] hover:text-white'
            }`}
          >
            Profile Info
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 px-4 sm:px-6 py-3 rounded-xl font-bold uppercase tracking-wider transition-all ${
              activeTab === 'settings' 
                ? 'bg-[#f59e0b] text-black' 
                : 'text-[#a8906e] hover:text-white'
            }`}
          >
            Preferences
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            className={`flex-1 px-4 sm:px-6 py-3 rounded-xl font-bold uppercase tracking-wider transition-all ${
              activeTab === 'subscription' 
                ? 'bg-[#f59e0b] text-black' 
                : 'text-[#a8906e] hover:text-white'
            }`}
          >
            Subscription
          </button>
        </div>

        {/* Content */}
        <div className="bg-[rgba(22,17,10,0.6)] backdrop-blur-md border border-[rgba(245,158,11,0.1)] rounded-2xl sm:rounded-3xl p-6 sm:p-8">
          {activeTab === 'profile' && (
            <div className="flex flex-col gap-6">
              <h3 className="text-white text-xl font-bold mb-4">Profile Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[#a8906e] text-sm font-bold uppercase tracking-wider">Display Name</label>
                  <input
                    type="text"
                    defaultValue="Prompt Alchemist"
                    className="bg-[#211b11]/50 border border-[#f59e0b]/20 rounded-xl px-4 py-3 text-white placeholder-[#a8906e]/50 focus:outline-none focus:border-[#f59e0b]/50"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#a8906e] text-sm font-bold uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    defaultValue="user@example.com"
                    className="bg-[#211b11]/50 border border-[#f59e0b]/20 rounded-xl px-4 py-3 text-white placeholder-[#a8906e]/50 focus:outline-none focus:border-[#f59e0b]/50"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[#a8906e] text-sm font-bold uppercase tracking-wider">Bio</label>
                <textarea
                  defaultValue="Passionate about AI prompting and competitive problem-solving. Always pushing the boundaries of what's possible with language models."
                  rows={4}
                  className="bg-[#211b11]/50 border border-[#f59e0b]/20 rounded-xl px-4 py-3 text-white placeholder-[#a8906e]/50 focus:outline-none focus:border-[#f59e0b]/50 resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-4">
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-[#f59e0b] text-black font-bold rounded-xl hover:scale-105 transition-transform">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="flex flex-col gap-6">
              <h3 className="text-white text-xl font-bold mb-4">Notification Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-[#211b11]/50 rounded-xl border border-[#f59e0b]/10">
                  <div>
                    <p className="text-white font-bold">Challenge Updates</p>
                    <p className="text-[#a8906e] text-sm">Get notified about new challenges and updates</p>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({...prev, challengeUpdates: !prev.challengeUpdates}))}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      notifications.challengeUpdates ? 'bg-[#f59e0b]' : 'bg-[#a8906e]/30'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      notifications.challengeUpdates ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                <div className="flex justify-between items-center p-4 bg-[#211b11]/50 rounded-xl border border-[#f59e0b]/10">
                  <div>
                    <p className="text-white font-bold">Reward Notifications</p>
                    <p className="text-[#a8906e] text-sm">Receive alerts when rewards are finalized</p>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({...prev, rewardNotifications: !prev.rewardNotifications}))}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      notifications.rewardNotifications ? 'bg-[#f59e0b]' : 'bg-[#a8906e]/30'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      notifications.rewardNotifications ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                <div className="flex justify-between items-center p-4 bg-[#211b11]/50 rounded-xl border border-[#f59e0b]/10">
                  <div>
                    <p className="text-white font-bold">Round Endings</p>
                    <p className="text-[#a8906e] text-sm">Get notified before challenge rounds end</p>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({...prev, roundEndings: !prev.roundEndings}))}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      notifications.roundEndings ? 'bg-[#f59e0b]' : 'bg-[#a8906e]/30'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      notifications.roundEndings ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                <div className="flex justify-between items-center p-4 bg-[#211b11]/50 rounded-xl border border-[#f59e0b]/10">
                  <div>
                    <p className="text-white font-bold">Target Refresh</p>
                    <p className="text-[#a8906e] text-sm">Alert when new XP targets are available</p>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({...prev, targetRefresh: !prev.targetRefresh}))}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      notifications.targetRefresh ? 'bg-[#f59e0b]' : 'bg-[#a8906e]/30'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      notifications.targetRefresh ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="flex flex-col gap-6">
              <h3 className="text-white text-xl font-bold mb-4">Subscription Details</h3>
              
              <div className="bg-[#211b11]/50 rounded-xl p-6 border border-[#f59e0b]/10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-white text-lg font-bold">Early Adopter Plan</h4>
                    <p className="text-[#a8906e] text-sm">Introductory pricing for early users</p>
                  </div>
                  <span className="px-3 py-1 bg-green-500/20 text-green-500 text-xs font-bold uppercase rounded-full border border-green-500/30">
                    Active
                  </span>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-[#a8906e]">Monthly Price</span>
                    <span className="text-white font-bold">$19.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#a8906e]">Next Billing Date</span>
                    <span className="text-white font-bold">March 1, 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#a8906e]">Member Since</span>
                    <span className="text-white font-bold">October 15, 2024</span>
                  </div>
                </div>

                <div className="border-t border-[#f59e0b]/20 pt-4">
                  <p className="text-[#a8906e] text-sm mb-3">Benefits:</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-white text-sm">
                      <span className="material-symbols-outlined text-[#f59e0b] text-lg">check_circle</span>
                      Unlimited challenge participation
                    </li>
                    <li className="flex items-center gap-2 text-white text-sm">
                      <span className="material-symbols-outlined text-[#f59e0b] text-lg">check_circle</span>
                      Access to all challenge types
                    </li>
                    <li className="flex items-center gap-2 text-white text-sm">
                      <span className="material-symbols-outlined text-[#f59e0b] text-lg">check_circle</span>
                      Priority reward processing
                    </li>
                    <li className="flex items-center gap-2 text-white text-sm">
                      <span className="material-symbols-outlined text-[#f59e0b] text-lg">check_circle</span>
                      Early access to new features
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-[#f59e0b] text-black font-bold rounded-xl hover:scale-105 transition-transform">
                  Manage Subscription
                </button>
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3 border border-[#f59e0b]/30 text-[#f59e0b] font-bold rounded-xl hover:bg-[#f59e0b]/10 transition-colors">
                  View Billing History
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-[#a8906e]/40 text-sm italic py-8">
          "Your profile is your digital signature in the world of AI prompting."
        </p>
      </div>
    </div>
  );
}
