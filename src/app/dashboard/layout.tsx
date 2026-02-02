'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  // Determine active nav from current pathname
  const getActiveNav = () => {
    if (pathname === '/dashboard') return 'dashboard';
    if (pathname === '/dashboard/challenges' || pathname.startsWith('/dashboard/challenges/')) return 'challenges';
    if (pathname === '/dashboard/rewards') return 'rewards';
    if (pathname === '/dashboard/history') return 'history';
    if (pathname === '/dashboard/profile') return 'profile';
    if (pathname === '/dashboard/notifications') return 'notifications';
    return 'dashboard';
  };
  
  const activeNav = getActiveNav();
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', fill: false, href: '/dashboard' },
    { id: 'challenges', label: 'Challenges', icon: 'psychology', fill: false, href: '/dashboard/challenges' },
    { id: 'rewards', label: 'Rewards', icon: 'card_giftcard', fill: false, href: '/dashboard/rewards' },
    { id: 'history', label: 'History', icon: 'history', fill: false, href: '/dashboard/history' },
    { id: 'profile', label: 'Profile', icon: 'account_circle', fill: false, href: '/dashboard/profile' },
  ];

  const pendingCoins = 2400;
  const xp = 14250;
  const notificationCount = 3; // Unread notifications count
  const userAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuDZAzDZETpDLvq6HiTalR_wAiLxtA8IoU_C-ZIrwS8RfwXqMUn67V96w5k6UfGDig70tQfDLlOoPjaOfy4cNuET9v_FQNRN0W3PqFR7z9dbXVQGtnLj4AyUB_DkVc03yLrkjCpQSrwvPlNbDRh8WaqRZxl0DZ1Mii2uucdQK45V3Eyet5G1_wT72NeOJco5HyEKkJxNHuB4ncTiaQh8aBiZ8ZKdr5t8wlziikhczBS7UA3OHASW6zjQb_hqldhXI_TL3G8oRQNURGtj";
  const userName = "Alex Thorne";
  const userRank = "Elite Engineer";
  const currentRank = "TITAN III";

  return (
    <div className="min-h-screen bg-[#0f0b07] text-white flex flex-col">
      {/* Navbar */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#2d2417] px-4 py-3 bg-[#0f0b07]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3 text-white">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden flex items-center justify-center rounded-lg h-9 w-9 bg-[#211b11] text-[#a8906e] border border-[#a8906e]/10"
          >
            <span className="material-symbols-outlined text-[18px]">menu</span>
          </button>
          
          <div className="size-7 text-[#f59e0b]">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-white text-lg font-black leading-tight tracking-tight hidden sm:block">PoshPrompt</h2>
          <h2 className="text-white text-base font-black leading-tight tracking-tight sm:hidden">PP</h2>
        </div>
        <div className="flex flex-1 justify-end gap-2">
          <div className="flex gap-2">
            <button className="hidden sm:flex items-center justify-center rounded-lg h-9 px-3 bg-[#f59e0b] text-black text-xs font-black shadow-[0_0_20px_rgba(245,158,11,0.3)] border border-[#f59e0b]/50 hover:bg-[#d97706] transition-colors">
              <span className="material-symbols-outlined text-[16px] mr-1 fill-1">monetization_on</span>
              <span className="truncate">{pendingCoins.toLocaleString()}</span>
            </button>
            <button className="hidden sm:flex items-center justify-center rounded-lg h-9 px-3 bg-[#211b11] text-[#f59e0b] text-xs font-bold border border-[#f59e0b]/20">
              <span className="truncate">{xp.toLocaleString()} XP</span>
            </button>
            <button 
              onClick={() => router.push('/dashboard/notifications')}
              className="flex items-center justify-center rounded-lg h-9 w-9 bg-[#211b11] text-[#a8906e] border border-[#a8906e]/10 relative hover:text-[#f59e0b] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">notifications</span>
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#f59e0b] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => router.push('/dashboard/profile')}
              className="flex items-center justify-center rounded-lg h-9 w-9 bg-[#211b11] text-[#a8906e] border border-[#a8906e]/10 hover:text-[#f59e0b] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">settings</span>
            </button>
          </div>
          <button 
            onClick={() => router.push('/dashboard/profile')}
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 border-2 border-[#f59e0b]/30 hover:border-[#f59e0b]/50 transition-colors"
            style={{backgroundImage: `url("${userAvatar}")`}}
          ></button>
        </div>
      </header>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <div className="flex flex-1 relative">
        {/* Desktop Sidebar - Sticky */}
        <aside className="hidden lg:flex lg:sticky lg:top-16 lg:left-0 w-64 flex-col justify-between border-r border-[#2d2417] bg-[#0f0b07] p-4 shrink-0 h-[calc(100vh-64px)] overflow-y-auto">
          <div className="flex flex-col gap-8 mt-4">
            <div className="flex gap-3 items-center px-2">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12" style={{backgroundImage: `url("${userAvatar}")`}}></div>
              <div className="flex flex-col overflow-hidden">
                <h1 className="text-white text-base font-bold leading-none truncate">{userName}</h1>
                <p className="text-[#f59e0b] text-xs font-medium mt-1 uppercase tracking-widest">{userRank}</p>
              </div>
            </div>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => router.push(item.href)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                    activeNav === item.id
                      ? 'bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                      : 'text-[#a8906e] hover:bg-white/5'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[24px] ${item.fill ? 'fill-1' : ''}`}>
                    {item.icon}
                  </span>
                  <p className={`text-sm ${activeNav === item.id ? 'font-bold' : 'font-medium'}`}>
                    {item.label}
                  </p>
                </button>
              ))}
            </nav>
          </div>
          <div className="p-4 bg-[#f59e0b]/5 rounded-xl border border-[#f59e0b]/10 mb-4">
            <p className="text-xs text-[#a8906e] uppercase font-bold tracking-tighter">Current Rank</p>
            <p className="text-xl font-black text-white shadow-[0_0_10px_rgba(245,158,11,0.5)] italic uppercase">{currentRank}</p>
          </div>
        </aside>
        
        {/* Mobile Sidebar - Offcanvas Drawer */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <aside className="w-64 flex flex-col justify-start border-r border-[#2d2417] bg-[#0f0b07] p-4 shrink-0 h-screen overflow-y-auto">
            {/* Mobile Close Button */}
            <div className="flex justify-end lg:hidden mb-4">
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center justify-center rounded-lg h-8 w-8 bg-[#211b11] text-[#a8906e] border border-[#a8906e]/10"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            
            <div className="flex flex-col gap-8 mt-0">
              <div className="flex gap-3 items-center px-2">
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12" style={{backgroundImage: `url("${userAvatar}")`}}></div>
                <div className="flex flex-col overflow-hidden">
                  <h1 className="text-white text-base font-bold leading-none truncate">{userName}</h1>
                  <p className="text-[#f59e0b] text-xs font-medium mt-1 uppercase tracking-widest">{userRank}</p>
                </div>
              </div>
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      router.push(item.href);
                      setIsSidebarOpen(false);
                    }}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                      activeNav === item.id
                        ? 'bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                        : 'text-[#a8906e] hover:bg-white/5'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[24px] ${item.fill ? 'fill-1' : ''}`}>
                      {item.icon}
                    </span>
                    <p className={`text-sm ${activeNav === item.id ? 'font-bold' : 'font-medium'}`}>
                      {item.label}
                    </p>
                  </button>
                ))}
              </nav>
            </div>
           
          </aside>
        </div>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#0f0b07]/50 min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}
