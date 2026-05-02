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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[24px] bg-emerald-600 flex items-center justify-center text-white shadow-xl border-4 border-white transition-transform hover:rotate-12">
            <Leaf size={32} />
          </div>
          <div className="space-y-1">
            <h2 className="text-5xl font-display font-black text-emerald-950 tracking-tighter uppercase leading-none italic">Crop Registry</h2>
            <p className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.4em]">Decentralized Biological Asset Ledger</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-emerald-600 text-white h-16 px-10 rounded-[32px] text-[11px] font-black uppercase tracking-widest hover:scale-[1.03] transition-all shadow-xl active:translate-y-1 border-b-4 border-emerald-900 flex items-center gap-4"
        >
          <Plus size={20} /> Register New Asset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {crops.map((crop) => (
          <motion.div 
            layout
            key={crop.id} 
            className="bg-white p-10 rounded-[56px] border border-emerald-100 shadow-xl space-y-8 group hover:shadow-2xl transition-all relative overflow-hidden border-b-8 border-b-emerald-100 hover:border-b-emerald-600"
          >
            <div className="flex items-center justify-between relative z-10">
              <div className="w-14 h-14 rounded-[20px] bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:scale-110 group-hover:rotate-6">
                 <Sparkles size={24} />
              </div>
              <button 
                onClick={() => deleteCrop(crop.id)}
                className="text-emerald-200 hover:text-red-500 transition-colors p-2"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="space-y-2 relative z-10">
               <h3 className="text-3xl font-display font-black text-emerald-950 tracking-tighter uppercase leading-none">{crop.name}</h3>
               <p className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.3em] italic">{crop.variety} cultivar</p>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
               <CropStat icon={<Calendar size={14} />} label="Planted" value={crop.plantedDate} />
               <CropStat icon={<Droplets size={14} />} label="Bio-Health" value={`${crop.health}%`} />
            </div>

            <div className="pt-6 border-t border-emerald-50 relative z-10 flex items-center justify-between">
               <span className={cn(
                 "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2",
                 crop.status === 'Growing' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"
               )}>
                 Node State: {crop.status}
               </span>
               <div className="w-24 h-2 bg-emerald-50 rounded-full overflow-hidden">
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
              className="bg-white p-12 sm:p-16 rounded-[80px] w-full max-w-2xl relative z-10 space-y-12 shadow-[0_40px_100px_rgba(6,95,70,0.4)] border border-emerald-100"
            >
              <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-5xl font-display font-black text-emerald-950 uppercase tracking-tighter italic">Bio-Registration</h3>
                   <p className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.4em] mt-2 italic">Cultivar Initialization Protocol</p>
                </div>
                <button 
                  onClick={() => setShowAdd(false)} 
                  className="w-14 h-14 bg-emerald-50 rounded-[20px] flex items-center justify-center text-emerald-300 hover:text-emerald-600 transition-all border border-emerald-100 hover:rotate-90 transition-transform"
                >
                  <X />
                </button>
              </div>

              <form onSubmit={handleAdd} className="space-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-emerald-400 tracking-widest ml-6">Genetic Designation</label>
                    <input name="name" required placeholder="e.g. Imperial Basmati" className="w-full bg-emerald-50 border border-emerald-100 h-20 px-8 rounded-[32px] font-bold text-emerald-950 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-emerald-400 tracking-widest ml-6">Variety Sub-type</label>
                    <input name="variety" required placeholder="e.g. BRRI-84" className="w-full bg-emerald-50 border border-emerald-100 h-20 px-8 rounded-[32px] font-bold text-emerald-950 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-emerald-400 tracking-widest ml-6">Planting Date</label>
                    <input name="plantedDate" type="date" required className="w-full bg-emerald-50 border border-emerald-100 h-20 px-8 rounded-[32px] font-bold text-emerald-950 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-mono" />
                 </div>

                 <button 
                   type="submit" 
                   disabled={loading}
                   className="btn-primary w-full py-10 text-2xl tracking-tighter shadow-2xl uppercase font-black"
                 >
                   {loading ? <Loader2 className="animate-spin" size={32} /> : "Initialize Biological Log"}
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
