/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, PageId, Language } from './types';
import { Layout } from './components/Layout';
import { WelcomeScreen } from './components/WelcomeScreen';
import { translations } from './translations';
import { OfflineToolkit } from './components/OfflineToolkit';
import { MarketInsights } from './components/MarketInsights';
import { FarmGram } from './components/FarmGram';
import { AgriDocAI } from './components/AgriDocAI';
import { Experts } from './components/Experts';
import { ProfileSettings } from './components/ProfileSettings';
import { PestMap } from './components/PestMap';
import { SustainabilityScore } from './components/SustainabilityScore';
import { IoTDashboard } from './components/IoTDashboard';
import { YieldPredictor } from './components/YieldPredictor';
import { CropRegistry } from './components/CropRegistry';
import { Gamification } from './components/Gamification';
import { populateDemoData } from './services/demoService';
import { Cloud, ArrowRight, Zap, Database, Globe, User, ShieldCheck, TreeDeciduous, Users, Droplets, Trophy, TrendingUp, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

/// Main Dashboard View
const Dashboard = () => {
  const { state, setPage, setIsOnline, t } = useAgriDoc();
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  const stats = [
    { label: t.dashboard.statDisease, value: "127", icon: <ShieldCheck className="text-emerald-400" /> },
    { label: t.dashboard.statFarmers, value: "2,340", icon: <Users className="text-blue-400" /> },
    { label: t.dashboard.statCountries, value: "15", icon: <Globe className="text-orange-400" /> },
    { label: t.dashboard.statWater, value: "340,000", icon: <Droplets className="text-cyan-400" /> },
  ];

  const suggestions = [
    "Detected high humidity: Monitor for Fungal Leaf Spot on Mango cultivars.",
    "Market Alert: Wheat prices up 12% in Local Node. Consider harvesting early.",
    "Soil Insight: Nitrogen levels stabilizing. Optimal window for urea protocol starts tomorrow.",
    "Weather Alert: Heavy rain expected in 48h. Secure greenhouse nodes."
  ];

  useEffect(() => {
    const it = setInterval(() => setSuggestionIndex(i => (i + 1) % suggestions.length), 5000);
    return () => clearInterval(it);
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-32">
      {/* Offline Warning if applies */}
      {!state.isOnline && (
         <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-[32px] flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-6">
               <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center text-white">
                  <Database size={24} />
               </div>
               <div>
                  <p className="font-display font-black text-emerald-950 uppercase tracking-tight">Offline Mode Active</p>
                  <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Neural Sync Paused</p>
               </div>
            </div>
            <button 
               onClick={() => setIsOnline(true)}
               className="bg-emerald-700 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-md"
            >
               Sync Now
            </button>
         </div>
      )}

      {/* Hero Interace (AGRI DIAGNOSTICS FIRST) */}
      <section className="bg-emerald-950 p-12 lg:p-20 rounded-[80px] relative overflow-hidden group shadow-[0_40px_100px_rgba(6,95,70,0.3)] border-b-8 border-emerald-900">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-16">
          <div className="flex-1 space-y-10">
            <div className="flex items-center gap-4">
               <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_15px_#10b981] animate-pulse"></div>
               <span className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.4em] leading-none">
                  Neural Scan Interface v4.0
               </span>
            </div>
            <h2 className="text-6xl sm:text-7xl lg:text-9xl font-display font-black leading-[0.8] tracking-tighter uppercase text-white">
              VISUAL <span className="block text-emerald-400 mt-4">DIAGNOSTICS</span>
            </h2>
            <p className="text-emerald-100/60 text-xl max-w-xl leading-relaxed font-medium italic">
               Upload or capture botanical samples for high-fidelity AI synthesis of pathogens and treatment protocols.
            </p>
            <div className="flex flex-wrap gap-6 pt-4">
              <button 
                onClick={() => setPage('agridoc-ai')}
                className="btn-primary px-16 py-8 text-lg"
              >
                <Zap size={28} /> {t.dashboard.btnAi}
              </button>
              <button 
                onClick={() => setPage('offline-toolkit')}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white px-16 py-8 rounded-[40px] text-lg font-black uppercase tracking-widest transition-all border border-white/10 flex items-center gap-4"
              >
                <Database size={28} className="text-emerald-400" /> Local Database
              </button>
            </div>
          </div>
          
          <div className="hidden xl:block relative">
            <div className="w-96 h-96 bg-white/5 rounded-[100px] border border-white/10 rotate-12 flex items-center justify-center animate-pulse">
                <ShieldCheck size={200} className="text-white/10" />
            </div>
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500 rounded-[48px] shadow-2xl flex items-center justify-center rotate-3 animate-float border-4 border-emerald-950">
                <TreeDeciduous size={80} className="text-white" />
            </div>
          </div>
        </div>
        <div className="absolute right-[-100px] top-[-100px] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      </section>

      {/* Top Section: Weather & Profile Quick View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Real-time Weather Widget */}
        <div 
          onClick={() => setPage('iot-dashboard')}
          className="lg:col-span-4 bg-emerald-950 p-10 rounded-[56px] shadow-2xl relative overflow-hidden group cursor-pointer border-b-8 border-emerald-900"
        >
           <div className="relative z-10 space-y-8">
              <div className="flex justify-between items-start">
                 <div>
                    <p className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.4em] mb-1">Local Telemetry</p>
                    <h3 className="text-7xl font-display font-black text-white tracking-tighter">32°C</h3>
                    <p className="text-sm font-bold text-emerald-100 uppercase tracking-widest mt-1 italic opacity-60">Solar Peak • 12km/h Uplift</p>
                 </div>
                 <div className="w-16 h-16 bg-white/10 rounded-[28px] flex items-center justify-center backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform">
                    <Cloud className="text-emerald-400 animate-bounce" size={32} />
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1 text-emerald-300">Humidity</p>
                    <p className="text-xl font-display font-black text-white">64%</p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1 text-emerald-300">Soil Moisture</p>
                    <p className="text-xl font-display font-black text-white">28%</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Dynamic Suggestions Carousel */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[56px] border border-emerald-100 shadow-xl flex items-center gap-8 relative overflow-hidden group">
           <div className="w-20 h-20 bg-emerald-50 rounded-[32px] flex items-center justify-center shrink-0 border border-emerald-100">
              <Zap className="text-emerald-600" size={32} fill="currentColor" />
           </div>
           <div className="flex-1">
              <p className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.4em] mb-2">Neural Link Feed</p>
              <div className="h-16 overflow-hidden relative">
                 <AnimatePresence mode="wait">
                    <motion.p 
                      key={suggestionIndex}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      className="text-xl font-bold text-emerald-950 leading-tight italic"
                    >
                      {suggestions[suggestionIndex]}
                    </motion.p>
                 </AnimatePresence>
              </div>
           </div>
        </div>
      </div>

      {/* Feature Cluster: Intelligence Nodes */}
      <div className="space-y-10">
          <div className="flex items-center gap-6">
              <div className="h-[2px] bg-emerald-600 flex-1"></div>
              <h3 className="text-4xl font-display font-black text-emerald-950 tracking-tighter uppercase shrink-0">Intelligence Nodes</h3>
              <div className="h-[2px] bg-emerald-100 flex-1"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <CapabilityCard 
                onClick={() => setPage('agridoc-ai')}
                icon={<Zap size={32} className="text-white" />}
                title="Neural Link"
                desc="Visual AI identification of pathogens & anomalies."
                color="bg-emerald-600"
              />
              <CapabilityCard 
                onClick={() => setPage('offline-toolkit')}
                icon={<Database size={32} className="text-white" />}
                title="Manual Proxy"
                desc="Field-ready offline diagnostic heuristics."
                color="bg-emerald-900"
              />
              <CapabilityCard 
                onClick={() => setPage('market-insights')}
                icon={<TrendingUp size={32} className="text-white" />}
                title="Trade Hub"
                desc="Market dynamics with listing capabilities."
                color="bg-emerald-700"
              />
              <CapabilityCard 
                onClick={() => setPage('crop-registry')}
                icon={<Leaf size={32} className="text-white" />}
                title="Crop Registry"
                desc="Biological Asset Ledger (CRUD)."
                color="bg-emerald-500"
              />
              <CapabilityCard 
                onClick={() => setPage('pest-map')}
                icon={<Globe size={32} className="text-white" />}
                title="Pathogen Radar"
                desc="Global outbreak tracking and risk alerts."
                color="bg-red-700"
              />
              <CapabilityCard 
                onClick={() => setPage('yield-predictor')}
                icon={<TrendingUp size={32} className="text-white" />}
                title="Yield Forecast"
                desc="Predictive harvest analytics based on metrics."
                color="bg-amber-600"
              />
              <CapabilityCard 
                onClick={() => setPage('sustainability')}
                icon={<TreeDeciduous size={32} className="text-white" />}
                title="Eco Ledger"
                desc="Regenerative agriculture impact metrics."
                color="bg-teal-600"
              />
          </div>
      </div>

      {/* Community Section */}
      <div className="bg-white border border-emerald-100 rounded-[64px] p-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="space-y-6 flex-1">
                  <h3 className="text-5xl font-display font-black text-emerald-950 tracking-tighter uppercase">Community Mesh</h3>
                  <p className="text-xl text-emerald-900/60 font-medium leading-relaxed italic max-w-xl">
                      Synchronize with the global AgriDoc network to trade insights, solve cultivar anomalies, and access the open-source market hub.
                  </p>
                  <div className="flex gap-4">
                      <button onClick={() => setPage('farmgram')} className="btn-primary">Connect to Network</button>
                      <button onClick={() => setPage('experts')} className="px-10 py-5 bg-emerald-50 text-emerald-600 rounded-[32px] font-black text-[11px] uppercase tracking-widest border border-emerald-100 hover:bg-emerald-100 transition-all">Consult Council</button>
                  </div>
              </div>
              <div className="flex -space-x-6">
                  {[1,2,3,4,5].map(i => (
                      <div key={i} className="w-20 h-20 rounded-full border-4 border-white shadow-xl overflow-hidden grayscale hover:grayscale-0 transition-all cursor-pointer hover:scale-110 active:scale-95">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 77}`} alt="user" className="w-full h-full object-cover bg-emerald-50" />
                      </div>
                  ))}
              </div>
          </div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-50 rounded-full blur-[80px] pointer-events-none"></div>
      </div>

      {/* Consultants Small Scrolling Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-4">
            <h3 className="text-3xl font-display font-black text-emerald-950 tracking-tighter uppercase">High Council Experts</h3>
            <button 
                onClick={() => setPage('experts')}
                className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] hover:tracking-[0.6em] transition-all"
            >
                View Full Node Council →
            </button>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide px-4">
            {["Dr. Sarah K.", "Prof. Ahmed M.", "Agri-Tech Dave", "Dr. Lin Yao"].map((name, i) => (
                <div 
                    key={i}
                    onClick={() => setPage('experts')}
                    className="min-w-[280px] bg-white p-8 rounded-[48px] border border-emerald-50 shadow-xl flex items-center gap-6 group cursor-pointer hover:border-emerald-200 transition-all active:scale-95"
                >
                    <div className="w-16 h-16 rounded-3xl overflow-hidden shadow-lg border-2 border-white group-hover:rotate-6 transition-transform">
                        <img src={`https://i.pravatar.cc/150?u=${i}99`} alt="expert" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                        <p className="font-display font-black text-emerald-950 text-lg uppercase tracking-tight leading-none mb-1">{name}</p>
                        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest italic leading-none">Council Level {10-i}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

const CapabilityCard = ({ onClick, icon, title, desc, color, iconColor }: any) => (
  <button 
    onClick={onClick}
    className="bg-white p-10 rounded-[64px] border border-emerald-50 shadow-xl text-left space-y-6 hover:shadow-2xl transition-all group active:scale-[0.98]"
  >
    <div className={cn("w-16 h-16 rounded-[24px] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform", color)}>
       {React.cloneElement(icon as React.ReactElement<any>, { size: 32, className: iconColor || "text-white" })}
    </div>
    <div className="space-y-2">
       <h4 className="text-2xl font-display font-black text-emerald-950 uppercase tracking-tighter leading-none">{title}</h4>
       <p className="text-sm font-medium text-emerald-900/40 leading-tight italic">{desc}</p>
    </div>
  </button>
);

const ServiceCard = ({ onClick, icon, title, sub }: any) => (
  <button 
    onClick={onClick}
    className="p-10 bg-white border border-slate-100 rounded-[48px] hover:bg-emerald-50 transition-all text-left flex flex-col items-center justify-center gap-6 group relative overflow-hidden text-center hover:border-brand-green/20 shadow-xl active:scale-[0.98]"
  >
    <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center group-hover:scale-110 transition-all duration-700 border border-slate-100 group-hover:bg-brand-green group-hover:text-white group-hover:shadow-glow/20">
      {React.cloneElement(icon as React.ReactElement<any>, { size: 32 })}
    </div>
    <div className="space-y-2">
      <span className="block text-xl font-display font-black text-slate-900 tracking-tight uppercase">{title}</span>
      <span className="text-[10px] text-slate-400 uppercase font-black tracking-[0.3em]">{sub}</span>
    </div>
    <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-brand-green opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100 shadow-glow"></div>
  </button>
);


interface AgriDocContextType {
  state: AppState;
  setLanguage: (lang: Language) => void;
  setPage: (page: PageId) => void;
  setIsOnline: (online: boolean) => void;
  addPoints: (val: number) => void;
  toggleDemoMode: () => void;
  t: any;
}

const AgriDocContext = createContext<AgriDocContextType | undefined>(undefined);

export const useAgriDoc = () => {
  const context = useContext(AgriDocContext);
  if (!context) throw new Error('useAgriDoc must be used within an AgriDocProvider');
  return context;
};

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    const localLang = localStorage.getItem('agri_lang') as Language || 'en';
    const points = Number(localStorage.getItem('agri_points') || '0');
    return {
      language: localLang,
      isOnline: false,
      apiKey: localStorage.getItem('GEMINI_API_KEY') || '',
      weatherKey: localStorage.getItem('WEATHER_API_KEY') || '',
      hasStarted: false, // Reset on reload as requested
      currentPage: 'home',
      points: points,
      level: Math.floor(points / 1000) + 1,
      unplantedTrees: Math.floor(points / 500),
      isDemoMode: localStorage.getItem('agri_demo') === 'true',
    };
  });

  useEffect(() => {
    localStorage.setItem('agri_points', state.points.toString());
    localStorage.setItem('agri_demo', state.isDemoMode.toString());
  }, [state.points, state.isDemoMode]);

  const addPoints = (val: number) => {
    setState(prev => {
      const newPoints = prev.points + val;
      return {
        ...prev,
        points: newPoints,
        level: Math.floor(newPoints / 1000) + 1,
        unplantedTrees: Math.floor(newPoints / 500)
      };
    });
  };

  const toggleDemoMode = () => {
    setState(prev => ({ ...prev, isDemoMode: !prev.isDemoMode }));
  };

  const setLanguage = (language: Language) => {
    localStorage.setItem('agri_lang', language);
    setState(prev => ({ ...prev, language }));
  };

  const setIsOnline = (isOnline: boolean) => setState(prev => ({ ...prev, isOnline }));
  
  const setPage = (page: PageId) => {
    setState(prev => ({ ...prev, currentPage: page, hasStarted: true }));
    window.scrollTo(0, 0);
  };

  const t = translations[state.language];

  // Competition Demo Mode Trigger (Ctrl+Shift+D)
  useEffect(() => {
    const handleKD = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        const confirm = window.confirm("Enter Competition Demo Mode? This will pre-populate the app with rich demo data.");
        if (confirm) {
          populateDemoData();
          toggleDemoMode();
          window.location.reload(); 
        }
      }
    };
    window.addEventListener('keydown', handleKD);
    return () => window.removeEventListener('keydown', handleKD);
  }, []);

  // Service Worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW failed', err));
      });
    }
  }, []);

  // Sync state with storage for API key updates
  useEffect(() => {
    const handleStorage = () => {
      setState(prev => ({ 
        ...prev, 
        apiKey: localStorage.getItem('GEMINI_API_KEY') || '',
        weatherKey: localStorage.getItem('WEATHER_API_KEY') || ''
      }));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const renderContent = () => {
    switch (state.currentPage) {
      case 'home': return <Dashboard />;
      case 'farmgram': return <FarmGram />;
      case 'agridoc-ai': return <AgriDocAI />;
      case 'profile': return <ProfileSettings />;
      case 'offline-toolkit': return <OfflineToolkit />;
      case 'market-insights': return <MarketInsights />;
      case 'experts': return <Experts />;
      case 'pest-map': return <PestMap />;
      case 'sustainability': return <SustainabilityScore />;
      case 'iot-dashboard': return <IoTDashboard />;
      case 'yield-predictor': return <YieldPredictor />;
      case 'crop-registry': return <CropRegistry />;
      case 'gamification': return <Gamification />;
      default: return <Dashboard />;
    }
  };

  return (
    <AgriDocContext.Provider value={{ state, setLanguage, setPage, setIsOnline, addPoints, toggleDemoMode, t }}>
      {!state.hasStarted ? (
        <WelcomeScreen />
      ) : (
        <Layout>
          {renderContent()}
        </Layout>
      )}
    </AgriDocContext.Provider>
  );
}


