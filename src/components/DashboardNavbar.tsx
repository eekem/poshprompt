'use client';

interface DashboardNavbarProps {
  pendingCoins?: number;
  xp?: number;
  userAvatar?: string;
  onMenuToggle?: () => void;
}

export default function DashboardNavbar({ 
  pendingCoins = 2400, 
  xp = 14250, 
  userAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuDZAzDZETpDLvq6HiTalR_wAiLxtA8IoU_C-ZIrwS8RfwXqMUn67V96w5k6UfGDig70tQfDLlOoPjaOfy4cNuET9v_FQNRN0W3PqFR7z9dbXVQGtnLj4AyUB_DkVc03yLrkjCpQSrwvPlNbDRh8WaqRZxl0DZ1Mii2uucdQK45V3Eyet5G1_wT72NeOJco5HyEKkJxNHuB4ncTiaQh8aBiZ8ZKdr5t8wlziikhczBS7UA3OHASW6zjQb_hqldhXI_TL3G8oRQNURGtj",
  onMenuToggle
}: DashboardNavbarProps) {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#2d2417] px-6 py-3 bg-[#0f0b07]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-4 text-white">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuToggle}
          className="lg:hidden flex items-center justify-center rounded-lg h-10 w-10 bg-[#211b11] text-[#a8906e] border border-[#a8906e]/10"
        >
          <span className="material-symbols-outlined text-[20px]">menu</span>
        </button>
        
        <div className="size-12 text-[#f59e0b]">
          <img src="/logo.svg" alt="PoshPrompt" className="w-full h-full" />
        </div>
      </div>
      <div className="flex flex-1 justify-end gap-6">
        <div className="flex gap-3">
          <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-[#f59e0b] text-black text-sm font-black shadow-[0_0_20px_rgba(245,158,11,0.3)] border border-[#f59e0b]/50 hover:bg-[#d97706] transition-colors">
            <span className="material-symbols-outlined text-[18px] mr-2 fill-1">monetization_on</span>
            <span className="truncate">{pendingCoins.toLocaleString()} Pending Coins</span>
          </button>
          <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-[#211b11] text-[#f59e0b] text-sm font-bold border border-[#f59e0b]/20">
            <span className="truncate">{xp.toLocaleString()} XP</span>
          </button>
          <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-[#211b11] text-[#a8906e] border border-[#a8906e]/10">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
          <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-[#211b11] text-[#a8906e] border border-[#a8906e]/10">
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
        </div>
        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-[#f59e0b]/30" style={{backgroundImage: `url("${userAvatar}")`}}></div>
      </div>
    </header>
  );
}
