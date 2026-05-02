import React from 'react';
import { Sprout, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useAgriDoc } from '../App';
import { translations } from '../translations';

export const WelcomeScreen: React.FC = () => {
  const { state, setPage } = useAgriDoc();
  const t = translations[state.language];

  return (
    <div className="fixed inset-0 z-[500] bg-emerald-950 overflow-y-auto overflow-x-hidden">
      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[510] pointer-events-none"
      >
        <div className="flex flex-col items-center gap-4">
          <p className="text-[11px] font-black uppercase tracking-[0.6em] text-white italic drop-shadow-lg">Scroll Down</p>
          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-xl"
          >
            <ChevronRight className="text-white rotate-90" size={24} strokeWidth={3} />
          </motion.div>
        </div>
      </motion.div>

      {/* Dynamic Background Image */}
      <motion.div 
        initial={{ scale: 1.2, filter: 'blur(4px)' }}
        animate={{ scale: 1, filter: 'blur(1px)' }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?auto=format&fit=crop&q=80")',
        }}
      />
      {/* Rich Glassy Overlay */}
      <div className="fixed inset-0 z-1 bg-gradient-to-br from-emerald-950/90 via-emerald-900/40 to-emerald-950/90 backdrop-blur-[1px]" />
      
      {/* Animated Particles/Blobs */}
      <div className="fixed top-[20%] left-[10%] w-96 h-96 bg-emerald-500/20 blur-[120px] rounded-full animate-float" />
      <div className="fixed bottom-[20%] right-[10%] w-[500px] h-[500px] bg-amber-500/10 blur-[150px] rounded-full animate-float delay-1000" />
      
      <div className="w-full max-w-4xl mx-auto px-6 py-20 relative z-10 flex flex-col items-center min-h-screen">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-emerald-950/60 backdrop-blur-3xl p-12 sm:p-20 rounded-[100px] w-full text-center space-y-12 border border-emerald-400/30 shadow-[0_60px_120px_rgba(0,0,0,0.8)] my-auto"
        >
          <div className="space-y-8">
            <motion.div 
              initial={{ rotate: -10, scale: 0.8 }} 
              animate={{ rotate: 0, scale: 1 }} 
              transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
              className="w-32 h-32 bg-emerald-600 rounded-[40px] flex items-center justify-center mx-auto text-white shadow-[0_0_30px_#10b981] cursor-pointer hover:rotate-12 transition-transform border-4 border-white/20"
            >
              <Sprout size={64} className="animate-pulse" strokeWidth={3} />
            </motion.div>
            
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-black text-white tracking-tighter leading-[0.8] uppercase italic">
                 AgriDoc <span className="text-emerald-400 block mt-2">Intelligence</span>
              </h1>
              <div className="flex items-center justify-center gap-6">
                  <div className="h-[2px] w-16 bg-emerald-600" />
                  <p className="text-[12px] font-black uppercase tracking-[0.6em] text-emerald-300 italic">
                     The Future of Yield
                  </p>
                  <div className="h-[2px] w-16 bg-emerald-600" />
              </div>
            </div>
          </div>

          <p className="text-xl sm:text-2xl text-emerald-50 font-black leading-relaxed max-w-2xl mx-auto italic opacity-90 uppercase tracking-tight">
            Pioneering high-fidelity AI diagnostics, decentralized trade hubs, and autonomous biological asset management for the modern producer.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              <button 
                  onClick={() => setPage('home')}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white py-8 sm:py-10 text-3xl font-display font-black rounded-[48px] shadow-[0_20px_50px_rgba(16,185,129,0.4)] border-b-8 border-emerald-900 active:translate-y-2 transition-all flex items-center justify-center gap-6 group"
              >
                  START SYNC <ChevronRight className="group-hover:translate-x-4 transition-all" size={40} />
              </button>
              <div className="bg-white/5 backdrop-blur-2xl rounded-[48px] border border-white/10 p-10 flex flex-col items-center justify-center text-white/70 space-y-3 shadow-inner">
                   <p className="text-[11px] font-black uppercase tracking-[0.5em] mb-2 text-emerald-400 italic">Grid Status</p>
                   <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_20px_#10b981] animate-pulse" />
                      <span className="text-lg font-black tracking-widest uppercase">Nodes Online</span>
                   </div>
                   <p className="text-[10px] font-mono opacity-50 tracking-widest">ENCRYPTED // v2.0.44</p>
              </div>
          </div>

          <div className="flex flex-wrap justify-center gap-x-16 gap-y-6 text-[11px] font-black uppercase tracking-[0.5em] text-white/30 border-t border-white/5 pt-12">
            <span className="hover:text-emerald-400 cursor-default transition-all hover:scale-110">Neural Scan</span>
            <span className="hover:text-emerald-400 cursor-default transition-all hover:scale-110">Bio-Ledger</span>
            <span className="hover:text-emerald-400 cursor-default transition-all hover:scale-110">Market Mesh</span>
            <span className="hover:text-emerald-400 cursor-default transition-all hover:scale-110">Soil Intelligence</span>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="mt-32 mb-10 text-center space-y-3 pb-20">
          <p className="text-[11px] font-black uppercase text-white tracking-[0.7em]">All Rights Reserved to MD Tanvir Ahmmed © 2026</p>
          <p className="text-[9px] font-black uppercase text-white/50 tracking-[0.5em]">Decentralized Agricultural Intelligence Protocol // Node v2.0</p>
        </footer>
      </div>
    </div>
  );
};
