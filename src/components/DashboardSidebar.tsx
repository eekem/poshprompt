'use client';

interface DashboardSidebarProps {
  userName?: string;
  userRank?: string;
  currentRank?: string;
  userAvatar?: string;
  activeNav?: string;
  onClose?: () => void;
}

export default function DashboardSidebar({ 
  userName = "Alex Thorne",
  userRank = "Elite Engineer", 
  currentRank = "TITAN III",
  userAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuBdMt_FAVj3e0fhjW_vnauV_Zt1hpywjwUPdg7GVU1PCfTtSIuJiz8pR4uQE2TxR6hcaVgPLda2wcvlZSrcMwj2G3PTL7ebYJNhN8UVCed2EI1vJvRRgP4Qt0gLVN2TkFLiXIQnrDaHzK5oEDZ97SjnwCb_gzuOiJeiXGxL1-ST_FJEoqWFfO1ijpK2FKju7jD6XLGgweq6bMXYEDu0_SXpBvSS2Sp9oVxfhc8w_MjxVXkJfBWL_cUPQl0WPL02nLnZsUzB35QkHXTp",
  activeNav = "arena",
  onClose
}: DashboardSidebarProps) {
  const navItems = [
    { id: 'arena', label: 'Arena', icon: 'swords', fill: true },
    { id: 'rewards', label: 'Rewards', icon: 'card_giftcard', fill: false },
    { id: 'history', label: 'History', icon: 'history', fill: false },
    { id: 'profile', label: 'Profile', icon: 'account_circle', fill: false },
  ];

  return (
    <aside className="w-64 flex flex-col justify-between border-r border-[#2d2417] bg-[#0f0b07] p-4 shrink-0 h-screen overflow-y-auto">
      {/* Mobile Close Button */}
      <div className="flex justify-end lg:hidden mb-4">
        <button 
          onClick={onClose}
          className="flex items-center justify-center rounded-lg h-8 w-8 bg-[#211b11] text-[#a8906e] border border-[#a8906e]/10"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
      
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
            <a
              key={item.id}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                activeNav === item.id
                  ? 'bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                  : 'text-[#a8906e] hover:bg-white/5'
              }`}
              href="#"
              onClick={() => onClose?.()}
            >
              <span className={`material-symbols-outlined text-[24px] ${item.fill ? 'fill-1' : ''}`}>
                {item.icon}
              </span>
              <p className={`text-sm ${activeNav === item.id ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </p>
            </a>
          ))}
        </nav>
      </div>
      <div className="p-4 bg-[#f59e0b]/5 rounded-xl border border-[#f59e0b]/10 mb-4">
        <p className="text-xs text-[#a8906e] uppercase font-bold tracking-tighter">Current Rank</p>
        <p className="text-xl font-black text-white shadow-[0_0_10px_rgba(245,158,11,0.5)] italic uppercase">{currentRank}</p>
      </div>
    </aside>
  );
}
