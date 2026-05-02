import React, { useState } from 'react';
import { TrendingUp, Calendar, MapPin, Loader2, Info, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useAgriDoc } from '../App';

export const YieldPredictor: React.FC = () => {
  const { addPoints } = useAgriDoc();
  const [crop, setCrop] = useState('Rice');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);

  const predict = () => {
    if (!date) return;
    setLoading(true);
    setTimeout(() => {
      // Simple linear regression simulation
      const baseYield = crop === 'Rice' ? 4500 : crop === 'Wheat' ? 3200 : 2500;
      const variation = (Math.random() - 0.5) * 500;
      const predicted = baseYield + variation;
      setPrediction({
        yield: Math.round(predicted),
        confidence: Math.round(85 + Math.random() * 10),
        low: Math.round(predicted * 0.9),
        high: Math.round(predicted * 1.1)
      });
      setLoading(false);
      addPoints(40);
    }, 1500);
  };

  return (
    <div className="space-y-10 pb-32">
       <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[24px] bg-emerald-600 flex items-center justify-center text-white shadow-xl border-4 border-white">
            <TrendingUp size={32} />
          </div>
          <div className="space-y-1">
            <h2 className="text-5xl font-display font-black text-emerald-950 tracking-tighter uppercase leading-none">Yield Analytics</h2>
            <p className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.4em]">Predictive Harvest Synthesis</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-12 rounded-[64px] shadow-2xl border border-emerald-100 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-emerald-400 tracking-widest pl-2">Cultivar Type</label>
            <select 
              value={crop}
              onChange={e => setCrop(e.target.value)}
              className="w-full bg-emerald-50 border border-emerald-100 p-5 rounded-[24px] text-emerald-950 font-bold appearance-none outline-none focus:ring-4 focus:ring-emerald-500/10"
            >
              <option value="Rice">Rice (Oryza sativa)</option>
              <option value="Wheat">Wheat (Triticum)</option>
              <option value="Maize">Maize (Zea mays)</option>
              <option value="Chili">Chili (Capsicum)</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-emerald-400 tracking-widest pl-2">Deployment Date</label>
            <input 
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full bg-emerald-50 border border-emerald-100 p-5 rounded-[24px] text-emerald-950 font-bold outline-none focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>
        </div>

        <button 
          onClick={predict}
          disabled={loading || !date}
          className="btn-primary w-full py-10 text-2xl shadow-2xl border-b-8 border-emerald-900 tracking-widest font-black uppercase"
        >
          {loading ? <Loader2 className="animate-spin" size={32} /> : "RUN PREDICTIVE SIMULATION"}
        </button>

        <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[32px] flex gap-4">
          <Info className="text-emerald-600 shrink-0" size={32} />
          <p className="text-base text-emerald-900/60 font-medium leading-relaxed italic">
            AgriDoc Neural Model uses historical climate cycles, soil telemetry, and global cultivar benchmarks to synthesize potential yield outcomes. 
          </p>
        </div>
      </div>

      <AnimatePresence>
        {prediction && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-10"
          >
            <div className="bg-emerald-950 p-16 rounded-[80px] text-center space-y-12 relative overflow-hidden shadow-2xl border-4 border-emerald-900 font-black uppercase">
               <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent pointer-events-none" />
               <div className="space-y-4 relative z-10">
                  <p className="text-[11px] font-black uppercase text-emerald-400 tracking-[0.5em] italic">Synthesized Yield Output</p>
                  <div className="text-9xl font-display font-black text-white tracking-tighter leading-none">{prediction.yield}<span className="text-3xl text-emerald-400 ml-4 tracking-normal">kg/h</span></div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                  <PredictionMetric label="Confidence Interval" value={`${prediction.confidence}%`} />
                  <PredictionMetric label="Projected Range" value={`${prediction.low} - ${prediction.high}`} />
               </div>

               <div className="pt-12 border-t border-white/5 flex flex-col gap-8 relative z-10">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Optimization Heuristics</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <OptimizationTip text="Increase nitrogen synthesis in cycle 3 for 15% delta yield." />
                     <OptimizationTip text="Precipitation anomaly predicted in Sept; initiate drainage." />
                  </div>
               </div>

               <div className="absolute right-[-40px] top-[-40px] w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PredictionMetric = ({ label, value }: any) => (
  <div className="bg-white/5 border border-white/10 p-10 rounded-[48px] shadow-inner">
    <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 italic">{label}</p>
    <p className="text-4xl font-display font-black text-white tracking-tighter uppercase">{value}</p>
  </div>
);

const OptimizationTip = ({ text }: any) => (
  <div className="bg-white/5 p-8 rounded-[32px] border border-white/5 flex items-center gap-6 text-left hover:bg-white/10 transition-colors group">
    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-110 transition-transform">
        <ChevronRight size={24} />
    </div>
    <p className="text-lg font-medium text-white/70 leading-relaxed italic">{text}</p>
  </div>
);
