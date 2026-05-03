import React, { useState } from 'react';
import { Plus, Trash2, Calendar, Droplets, Leaf, Search, X, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useAgriDoc } from '../App';

interface Crop {
  id: string;
  name: string;
  variety: string;
  plantedDate: string;
  status: 'Growing' | 'Harvested' | 'Dormant';
  health: number;
  stage: number; // 0-3 (Seed, Sprout, Vegetative, Mature)
  resilience: {
    heat: number; // 0-100
    pest: number; // 0-100
  };
}

export const CropRegistry: React.FC = () => {
  const { addPoints } = useAgriDoc();
  const [crops, setCrops] = useState<Crop[]>([
    { 
      id: '1', 
      name: 'Premium Boro', 
      variety: 'BRRI-28', 
      plantedDate: '2024-03-12', 
      status: 'Growing', 
      health: 85,
      stage: 2,
      resilience: { heat: 78, pest: 65 }
    },
    { 
      id: '2', 
      name: 'Organic Chilies', 
      variety: 'Naga King', 
      plantedDate: '2024-02-05', 
      status: 'Growing', 
      health: 92,
      stage: 3,
      resilience: { heat: 90, pest: 82 }
    }
  ]);

  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    setTimeout(() => {
      const newCrop: Crop = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.get('name') as string,
        variety: formData.get('variety') as string,
        plantedDate: formData.get('plantedDate') as string,
        status: 'Growing',
        health: 100,
        stage: 0,
        resilience: { heat: 50, pest: 50 }
      };
      setCrops([newCrop, ...crops]);
      setLoading(false);
      setShowAdd(false);
      addPoints(50);
    }, 1000);
  };

  const deleteCrop = (id: string) => {
    setCrops(crops.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-10 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-[24px] bg-emerald-600 flex items-center justify-center text-white shadow-xl border-4 border-white transition-transform hover:rotate-12 shrink-0">
            <Leaf className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-5xl font-display font-black text-emerald-950 tracking-tighter uppercase leading-none italic">Crop Registry</h2>
            <p className="text-[9px] sm:text-[10px] font-black uppercase text-emerald-600 tracking-[0.3em] sm:tracking-[0.4em]">Decentralized Biological Asset Ledger</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-emerald-600 text-white h-14 sm:h-16 px-6 sm:px-10 rounded-2xl sm:rounded-[32px] text-[10px] sm:text-[11px] font-black uppercase tracking-widest hover:scale-[1.03] transition-all shadow-xl active:translate-y-1 border-b-4 border-emerald-900 flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> Register New Asset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {crops.map((crop) => (
          <motion.div 
            layout
            key={crop.id} 
            className="bg-white p-6 sm:p-10 rounded-[48px] sm:rounded-[64px] border border-emerald-100 shadow-xl space-y-8 group hover:shadow-2xl transition-all relative overflow-hidden border-b-[12px] border-b-emerald-50 hover:border-b-emerald-600"
          >
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-[20px] bg-emerald-600 flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6">
                   <Sparkles size={24} />
                </div>
                <div>
                   <p className="text-[9px] font-mono font-black text-emerald-400 uppercase tracking-widest leading-none">ASSET_ID: {crop.id.toUpperCase()}</p>
                   <span className={cn(
                     "mt-1 inline-block px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                     crop.status === 'Growing' ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-50 text-slate-400 border-slate-200"
                   )}>
                     {crop.status}
                   </span>
                </div>
              </div>
              <button 
                onClick={() => deleteCrop(crop.id)}
                className="text-slate-200 hover:text-red-500 transition-colors p-2"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 relative z-10">
               <h3 className="text-3xl sm:text-4xl font-display font-black text-emerald-950 tracking-tighter uppercase leading-none">{crop.name}</h3>
               <p className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.3em] sm:tracking-[0.4em] italic border-l-4 border-emerald-600 pl-4">{crop.variety} genetic strain</p>
            </div>

            {/* Growth Phase Tracker */}
            <div className="space-y-4 relative z-10 pt-4">
               <div className="flex justify-between items-end">
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest italic">Biological Progression</p>
                  <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">{['Germination', 'Vegetative', 'Vascular', 'Mature'][crop.stage]}</p>
               </div>
               <div className="flex gap-2 h-2.5">
                  {[0, 1, 2, 3].map((s) => (
                    <div 
                      key={s} 
                      className={cn(
                        "flex-1 rounded-full transition-all duration-700",
                        s <= crop.stage ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" : "bg-emerald-50"
                      )}
                    />
                  ))}
               </div>
            </div>

            {/* Matrix Data */}
            <div className="grid grid-cols-2 gap-6 relative z-10 pt-6 border-t border-emerald-50">
               <div className="space-y-4">
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none">Matrix Sensors</p>
                  <div className="space-y-3">
                     <ResilienceMeter label="Heat Matrix" value={crop.resilience.heat} color="amber" />
                     <ResilienceMeter label="Biological Guard" value={crop.resilience.pest} color="blue" />
                  </div>
               </div>
               <div className="space-y-4 text-right">
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none">Vital Sign</p>
                  <div className="inline-flex flex-col items-end">
                     <p className="text-4xl font-display font-black text-emerald-950 tracking-tighter">{crop.health}%</p>
                     <p className="text-[9px] font-black uppercase text-emerald-400 tracking-[0.2em] italic">Bio-Integrity</p>
                  </div>
               </div>
            </div>

            <div className="absolute right-[-40px] top-[-40px] w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] group-hover:bg-emerald-500/10 transition-colors" />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-20">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdd(false)}
              className="absolute inset-0 bg-emerald-950/80 backdrop-blur-2xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-8 sm:p-16 rounded-[48px] sm:rounded-[80px] w-full max-w-2xl relative z-10 space-y-8 sm:space-y-12 shadow-[0_40px_100px_rgba(6,95,70,0.4)] border border-emerald-100"
            >
              <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-2xl sm:text-5xl font-display font-black text-emerald-950 uppercase tracking-tighter italic leading-none">Bio-Registration</h3>
                   <p className="text-[9px] sm:text-[10px] font-black uppercase text-emerald-600 tracking-[0.3em] sm:tracking-[0.4em] mt-2 italic">Cultivar Initialization Protocol</p>
                </div>
                <button 
                  onClick={() => setShowAdd(false)} 
                  className="w-10 h-10 sm:w-14 sm:h-14 bg-emerald-50 rounded-xl sm:rounded-[20px] flex items-center justify-center text-emerald-300 hover:text-emerald-600 transition-all border border-emerald-100 hover:rotate-90 transition-transform"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <form onSubmit={handleAdd} className="space-y-6 sm:space-y-8">
                 <div className="space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black uppercase text-emerald-400 tracking-widest ml-4 sm:ml-6">Genetic Designation</label>
                    <input name="name" required placeholder="e.g. Imperial Basmati" className="w-full bg-emerald-50 border border-emerald-100 h-14 sm:h-20 px-6 sm:px-8 rounded-2xl sm:rounded-[32px] font-bold text-emerald-950 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm sm:text-base" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black uppercase text-emerald-400 tracking-widest ml-4 sm:ml-6">Variety Sub-type</label>
                    <input name="variety" required placeholder="e.g. BRRI-84" className="w-full bg-emerald-50 border border-emerald-100 h-14 sm:h-20 px-6 sm:px-8 rounded-2xl sm:rounded-[32px] font-bold text-emerald-950 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm sm:text-base" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black uppercase text-emerald-400 tracking-widest ml-4 sm:ml-6">Planting Date</label>
                    <input name="plantedDate" type="date" required className="w-full bg-emerald-50 border border-emerald-100 h-14 sm:h-20 px-6 sm:px-8 rounded-2xl sm:rounded-[32px] font-bold text-emerald-950 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-mono text-sm sm:text-base" />
                 </div>

                 <button 
                   type="submit" 
                   disabled={loading}
                   className="btn-primary w-full py-6 sm:py-10 text-xl sm:text-2xl tracking-tighter shadow-2xl uppercase font-black"
                 >
                   {loading ? <Loader2 className="animate-spin" size={24} /> : "Initialize Biological Log"}
                 </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CropStat = ({ icon, label, value }: any) => (
  <div className="space-y-1">
     <p className="text-[9px] font-black uppercase text-emerald-400 tracking-widest flex items-center gap-2 italic leading-none">
       {icon} {label}
     </p>
     <p className="text-xl font-display font-black text-emerald-950 uppercase tracking-tighter leading-none">{value}</p>
  </div>
);

const ResilienceMeter = ({ label, value, color }: any) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-500">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
      <div 
        className={cn(
          "h-full rounded-full transition-all duration-1000",
          color === 'amber' ? "bg-amber-400" : "bg-blue-400"
        )} 
        style={{ width: `${value}%` }} 
      />
    </div>
  </div>
);
