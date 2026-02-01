export default function Footer() {
  return (
    <footer className="py-16 border-t border-border-dark bg-background-dark text-amber-100/30">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-primary">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z" fill="currentColor"></path>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tighter uppercase italic">PoshPrompt</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed mb-8">
              The premier destination for elite prompt engineers. Battle, rank up, and earn rewards in the most advanced AI arena ever built.
            </p>
            <div className="flex gap-6">
              <a className="hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">public</span></a>
              <a className="hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">forum</span></a>
              <a className="hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">terminal</span></a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Platform</h4>
            <div className="flex flex-col gap-4 text-sm">
              <a className="hover:text-primary transition-colors" href="#">Arena</a>
              <a className="hover:text-primary transition-colors" href="#">Leaderboard</a>
              <a className="hover:text-primary transition-colors" href="#">Challenges</a>
              <a className="hover:text-primary transition-colors" href="#">Documentation</a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Company</h4>
            <div className="flex flex-col gap-4 text-sm">
              <a className="hover:text-primary transition-colors" href="#">About Us</a>
              <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
              <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
              <a className="hover:text-primary transition-colors" href="#">Support</a>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
          <p>© 2024 PoshPrompt Arena. Forge your legacy.</p>
          <div className="flex gap-8">
            <span className="text-primary/50">Server Status: 100% Online</span>
            <span className="text-primary/50">Uptime: 99.9%</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
