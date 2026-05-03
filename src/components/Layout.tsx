import React from 'react';
import { Home, Share2, MessageSquare, User, Globe, Cloud, LogOut, Zap, Sprout, Users, Leaf, Bug } from 'lucide-react';
import { useAgriDoc } from '../App';
import { translations } from '../translations';
import { cn } from '../lib/utils';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, setLanguage, setPage, setIsOnline } = useAgriDoc();
  const t = translations[state.language];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-brand-bg">
      {/* PC Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-72 h-screen sticky top-0 bg-emerald-950 z-50 p-8 shadow-2xl border-r border-emerald-900">
        <div className="flex items-center gap-4 mb-12 cursor-pointer group" onClick={() => setPage('home')}>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform text-white border-b-4 border-emerald-700">
            <Sprout size={28} />
          </div>
          <div>
            <h1 className="text-xl font-display font-black tracking-tighter leading-none text-white uppercase">AGRIDOC</h1>
            <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em] mt-1 italic">Intelligence</p>
          </div>
        </div>

        <nav className="flex-1 space-y-3 overflow-y-auto pr-2 min-h-0 [scrollbar-width:thin] [overflow-anchor:none] pb-10">
          <SidebarBtn 
            active={state.currentPage === 'home'} 
            onClick={() => setPage('home')} 
            icon={<Home />} 
            label={t.nav.home} 
          />
          <SidebarBtn 
            active={state.currentPage === 'farmgram'} 
            onClick={() => setPage('farmgram')} 
            icon={<Share2 />} 
            label={t.nav.farmgram} 
          />
          <SidebarBtn 
            active={state.currentPage === 'agridoc-ai'} 
            onClick={() => setPage('agridoc-ai')} 
            icon={<Zap />} 
            label={t.nav.agridocAi} 
          />
          <SidebarBtn 
            active={state.currentPage === 'pest-map'} 
            onClick={() => setPage('pest-map')} 
            icon={<Bug />} 
            label="Pathogen Radar" 
          />
          <SidebarBtn 
            active={state.currentPage === 'market-insights'} 
            onClick={() => setPage('market-insights')} 
            icon={<Globe />} 
            label="Trade Hub" 
          />
          <SidebarBtn 
            active={state.currentPage === 'experts'} 
            onClick={() => setPage('experts')} 
            icon={<Users />} 
            label="Consult Node" 
          />
          <SidebarBtn 
            active={state.currentPage === 'crop-registry'} 
            onClick={() => setPage('crop-registry')} 
            icon={<Leaf />} 
            label="Registry" 
          />
          <SidebarBtn 
            active={state.currentPage === 'profile'} 
            onClick={() => setPage('profile')} 
            icon={<User />} 
            label={t.nav.profile} 
          />
          <div className="md:hidden">
             {/* Only show extra spacing for mobile if needed, but nav itself is for desktop aside */}
          </div>
        </nav>

        <div className="mt-12 space-y-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 p-5 rounded-[32px] border border-white/10 space-y-4">
             <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Language Matrix</p>
             <div className="flex gap-2">
                {['en', 'bn', 'th'].map(lang => (
                  <button 
                    key={lang}
                    onClick={() => setLanguage(lang as any)}
                    className={cn(
                      "flex-1 py-3 rounded-xl text-[10px] font-black uppercase border transition-all",
                      state.language === lang 
                        ? "bg-emerald-500 text-white border-emerald-500 shadow-sm" 
                        : "bg-transparent text-emerald-100/40 border-white/10 hover:border-white/20"
                    )}
                  >
                    {lang}
                  </button>
                ))}
             </div>
          </div>

          <button 
            onClick={() => setIsOnline(!state.isOnline)}
            className={cn(
              "w-full flex items-center justify-between px-6 py-4 rounded-[40px] text-[10px] font-black uppercase tracking-widest transition-all border",
              state.isOnline 
                ? "bg-emerald-900 border-emerald-700 text-emerald-400" 
                : "bg-white/5 border-white/10 text-white/40"
            )}
          >
            <div className="flex items-center gap-3">
              <Cloud size={16} className={cn(state.isOnline && "animate-pulse")} />
              <span>{state.isOnline ? "Online" : "Offline"}</span>
            </div>
            <div className={cn("w-2 h-2 rounded-full", state.isOnline ? "bg-emerald-400 shadow-glow" : "bg-white/20")}></div>
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="md:hidden sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-b border-emerald-50 px-6 py-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3" onClick={() => setPage('home')}>
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg border-b-2 border-emerald-800">
            <Sprout size={22} />
          </div>
          <h1 className="text-lg font-display font-black text-emerald-950 leading-none">AGRIDOC <span className="text-emerald-600 italic">INTEL</span></h1>
        </div>
        <button 
          onClick={() => setIsOnline(!state.isOnline)}
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center border transition-all shadow-sm",
            state.isOnline ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-white text-emerald-200 border-emerald-50"
          )}
        >
          <Cloud size={20} className={cn(state.isOnline && "animate-pulse")} />
        </button>
      </header>

      {/* Main Context Area */}
      <main className="flex-1 overflow-x-hidden pt-8 md:pt-12 md:px-12 lg:px-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           {children}
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-2xl border-t border-emerald-100 h-24 flex items-center justify-around px-4 shadow-[0_-10px_40px_rgba(6,95,70,0.1)]">
        <MobileNavBtn active={state.currentPage === 'home'} onClick={() => setPage('home')} icon={<Home />} />
        <MobileNavBtn active={state.currentPage === 'crop-registry'} onClick={() => setPage('crop-registry')} icon={<Leaf />} />
        <div className="relative -top-8">
          <button 
            onClick={() => setPage('agridoc-ai')}
            className="w-16 h-16 bg-emerald-600 text-white rounded-[24px] flex items-center justify-center shadow-2xl border-b-4 border-emerald-900 active:translate-y-1 transition-all"
          >
            <Zap size={28} fill="currentColor" />
          </button>
        </div>
        <MobileNavBtn active={state.currentPage === 'market-insights'} onClick={() => setPage('market-insights')} icon={<Globe />} />
        <MobileNavBtn active={state.currentPage === 'farmgram'} onClick={() => setPage('farmgram')} icon={<Share2 />} />
      </nav>
    </div>
  );
};

const SidebarBtn = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-4 px-6 py-5 rounded-[40px] text-[11px] font-black uppercase tracking-[0.2em] transition-all group",
      active 
        ? "bg-emerald-500 text-white shadow-xl shadow-emerald-900/10 -translate-x-1 border-b-2 border-emerald-700" 
        : "text-emerald-100/40 hover:bg-white/5 hover:text-white"
    )}
  >
    <span className={cn("transition-transform group-hover:scale-110", active && "text-white")}>
      {React.cloneElement(icon as React.ReactElement<any>, { size: 20, strokeWidth: active ? 3 : 2 })}
    </span>
    <span className="flex-1 text-left">{label}</span>
  </button>
);

const MobileNavBtn = ({ active, onClick, icon }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "p-4 rounded-2xl transition-all duration-300",
      active ? "bg-emerald-50 text-emerald-600 shadow-inner scale-110" : "text-emerald-200 hover:text-emerald-400"
    )}
  >
    {React.cloneElement(icon as React.ReactElement<any>, { size: 24, strokeWidth: active ? 3 : 2 })}
  </button>
);
