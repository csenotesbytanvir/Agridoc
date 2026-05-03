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
}

export const CropRegistry: React.FC = () => {
  const { addPoints } = useAgriDoc();
  const [crops, setCrops] = useState<Crop[]>([
    { id: '1', name: 'Premium Boro', variety: 'BRRI-28', plantedDate: '2024-03-12', status: 'Growing', health: 85 },
    { id: '2', name: 'Organic Chilies', variety: 'Naga King', plantedDate: '2024-02-05', status: 'Growing', health: 92 }
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);

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
        health: 100
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
            className="bg-white p-6 sm:p-10 rounded-[40px] sm:rounded-[56px] border border-emerald-100 shadow-xl space-y-6 sm:space-y-8 group hover:shadow-2xl transition-all relative overflow-hidden border-b-8 border-b-emerald-100 hover:border-b-emerald-600"
          >
            <div className="flex items-center justify-between relative z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-[20px] bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:scale-110 group-hover:rotate-6">
                 <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <button 
                onClick={() => deleteCrop(crop.id)}
                className="text-emerald-200 hover:text-red-500 transition-colors p-2"
              >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="space-y-2 relative z-10">
               <h3 className="text-2xl sm:text-3xl font-display font-black text-emerald-950 tracking-tighter uppercase leading-none">{crop.name}</h3>
               <p className="text-[9px] sm:text-[10px] font-black uppercase text-emerald-400 tracking-[0.2em] sm:tracking-[0.3em] italic">{crop.variety} cultivar</p>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
               <CropStat icon={<Calendar className="w-3 h-3 sm:w-4 sm:h-4" />} label="Planted" value={crop.plantedDate} />
               <CropStat icon={<Droplets className="w-3 h-3 sm:w-4 sm:h-4" />} label="Bio-Health" value={`${crop.health}%`} />
            </div>

            <div className="pt-6 border-t border-emerald-50 relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
               <span className={cn(
                 "px-4 sm:px-6 py-2 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest border-2",
                 crop.status === 'Growing' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"
               )}>
                 State: {crop.status}
               </span>
               <div className="w-full sm:w-24 h-2 bg-emerald-50 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${crop.health}%` }} />
               </div>
            </div>

            <div className="absolute right-[-20px] top-[-20px] w-48 h-48 bg-emerald-500/5 rounded-full blur-[60px] group-hover:bg-emerald-500/10 transition-colors" />
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
