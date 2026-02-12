'use client';

interface DashboardNavbarProps {
  pendingCoins?: number;
  certification?: number;
  earnedCertification?: number;
  promptBalance?: number;
  userAvatar?: string;
  userRank?: number | null;
  userPrize?: number;
  onMenuToggle?: () => void;
  onLogout?: () => Promise<void>;
  onTopUp?: () => void;
}

export default function DashboardNavbar({ 
  pendingCoins = 2400, 
  certification = 14250,
  earnedCertification = 1250,
  promptBalance = 45,
  userAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuDZAzDZETpDLvq6HiTalR_wAiLxtA8IoU_C-ZIrwS8RfwXqMUn67V96w5k6UfGDig70tQfDLlOoPjaOfy4cNuET9v_FQNRN0W3PqFR7z9dbXVQGtnLj4AyUB_DkVc03yLrkjCpQSrwvPlNbDRh8WaqRZxl0DZ1Mii2uucdQK45V3Eyet5G1_wT72NeOJco5HyEKkJxNHuB4ncTiaQh8aBiZ8ZKdr5t8wlziikhczBS7UA3OHASW6zjQb_hqldhXI_TL3G8oRQNURGtj",
  userRank = null,
  userPrize = 0,
  onMenuToggle,
  onLogout,
  onTopUp
}: DashboardNavbarProps) {
  const handleTopUp = () => {
    if (onTopUp) {
      onTopUp();
    } else {
      console.log('Top-up clicked');
    }
  };

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    } else {
      console.log('Logout clicked');
    }
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#2d2417] px-4 sm:px-6 py-3 bg-[#0f0b07]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-4 text-white">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuToggle}
          className="lg:hidden flex items-center justify-center rounded-lg h-10 w-10 bg-[#211b11] text-[#a8906e] border border-[#a8906e]/10"
        >
          <span className="material-symbols-outlined text-[20px]">menu</span>
        </button>
        
        <div className="size-10 sm:size-12 text-[#f59e0b]">
          <img src="/logo.svg" alt="PoshPrompt" className="w-full h-full" />
        </div>
      </div>
      
      <div className="flex flex-1 justify-end items-center gap-2 sm:gap-4">
        {/* Mobile: Show only essential buttons */}
        <div className="hidden sm:flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Top Up Button */}
          <button 
            onClick={handleTopUp}
            className="flex items-center justify-center rounded-lg h-8 sm:h-10 px-3 sm:px-4 bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-black text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)] border border-[#f59e0b]/50 hover:from-[#d97706] hover:to-[#b45309] transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px] sm:text-[18px] mr-1 sm:mr-2 fill-1">add_circle</span>
            <span className="hidden sm:inline truncate">Top Up</span>
            <span className="sm:hidden">+</span>
          </button>
          
          {/* Pending Coins */}
          <button className="flex items-center justify-center rounded-lg h-8 sm:h-10 px-3 sm:px-4 bg-[#f59e0b] text-black text-xs sm:text-sm font-black shadow-[0_0_20px_rgba(245,158,11,0.3)] border border-[#f59e0b]/50 hover:bg-[#d97706] transition-colors">
            <span className="material-symbols-outlined text-[16px] sm:text-[18px] mr-1 sm:mr-2 fill-1">monetization_on</span>
            <span className="truncate">{pendingCoins.toLocaleString()}</span>
          </button>
          
          {/* Earned XP */}
          <button className="flex items-center justify-center rounded-lg h-8 sm:h-10 px-3 sm:px-4 bg-[#211b11] text-[#f59e0b] text-xs sm:text-sm font-bold border border-[#f59e0b]/20">
            <span className="material-symbols-outlined text-[16px] sm:text-[18px] mr-1 sm:mr-2">stars</span>
            <span className="truncate">{earnedCertification.toLocaleString()} Cert</span>
          </button>
          
          {/* Prompt Balance */}
          <button className="flex items-center justify-center rounded-lg h-8 sm:h-10 px-3 sm:px-4 bg-[#211b11] text-blue-400 text-xs sm:text-sm font-bold border border-blue-400/20">
            <span className="material-symbols-outlined text-[16px] sm:text-[18px] mr-1 sm:mr-2">psychology</span>
            <span className="truncate">{promptBalance}</span>
          </button>
        </div>
        
        {/* Mobile: Compact view */}
        <div className="flex sm:hidden items-center gap-2">
          {/* Top Up */}
          <button 
            onClick={handleTopUp}
            className="flex items-center justify-center rounded-lg h-8 w-8 bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-black text-xs font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)] border border-[#f59e0b]/50 hover:from-[#d97706] hover:to-[#b45309] transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px] fill-1">add_circle</span>
          </button>
          
          {/* Coins */}
          <button className="flex items-center justify-center rounded-lg h-8 px-2 bg-[#f59e0b] text-black text-xs font-black shadow-[0_0_20px_rgba(245,158,11,0.3)] border border-[#f59e0b]/50 hover:bg-[#d97706] transition-colors">
            <span className="material-symbols-outlined text-[16px] mr-1 fill-1">monetization_on</span>
            <span>{pendingCoins.toLocaleString()}</span>
          </button>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* User Avatar with Dropdown */}
          <div className="relative group">
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 sm:size-10 border-2 border-[#f59e0b]/30 cursor-pointer hover:border-[#f59e0b]/50 transition-colors" style={{backgroundImage: `url("${userAvatar}")`}}></div>
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-surface-dark border border-[#332a1e] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-2">
                <div className="px-3 py-2 border-b border-[#332a1e]/50 mb-2">
                  <p className="text-sm font-medium text-white truncate">User Profile</p>
                  <p className="text-xs text-gray-400 truncate">{userAvatar ? 'Logged in' : 'Guest'}</p>
                </div>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#332a1e] rounded-md transition-colors text-left">
                  <span className="material-symbols-outlined text-base">account_circle</span>
                  <span>Profile</span>
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#332a1e] rounded-md transition-colors text-left">
                  <span className="material-symbols-outlined text-base">settings</span>
                  <span>Settings</span>
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#332a1e] rounded-md transition-colors text-left">
                  <span className="material-symbols-outlined text-base">help</span>
                  <span>Help & Support</span>
                </button>
                <div className="border-t border-[#332a1e]/50 mt-2 pt-2">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-md transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-base">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
