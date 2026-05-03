import React, { useState } from 'react';
import { Search, Filter, Sprout, Droplets, Sun, Beaker, ChevronLeft, Leaf, ShieldCheck, Zap } from 'lucide-react';
import { PLANTS } from '../constants';
import { Plant } from '../types';
import { cn } from '../lib/utils';
import { useAgriDoc } from '../App';
import { motion, AnimatePresence } from 'motion/react';

export const PlantLibrary: React.FC = () => {
  const { state } = useAgriDoc();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<any>('all');
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  const filteredPlants = PLANTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.scientificName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || p.type === filter;
    return matchesSearch && matchesFilter;
  });

  if (selectedPlant) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6 sm:space-y-10 pb-32"
      >
        <button 
          onClick={() => setSelectedPlant(null)}
          className="flex items-center gap-3 sm:gap-4 text-slate-400 font-black text-[10px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.4em] italic hover:text-brand-green transition-colors"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" /> Back to Repository Index
        </button>

        <div className="bg-white rounded-[40px] sm:rounded-[80px] overflow-hidden shadow-2xl border border-slate-100">
          <div className="relative h-64 sm:h-96">
            <img 
                src={selectedPlant.image} 
                alt={selectedPlant.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 space-y-1 sm:space-y-2">
                <h1 className="text-3xl sm:text-6xl font-display font-black text-white tracking-tighter uppercase leading-none">{selectedPlant.name}</h1>
                <p className="text-white/60 text-base sm:text-lg font-medium italic">{selectedPlant.scientificName}</p>
            </div>
            <div className="absolute top-6 right-6 sm:top-10 sm:right-10">
                <span className={cn(
                  "px-4 sm:px-8 py-2 sm:py-3 rounded-[24px] sm:rounded-[32px] text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] shadow-2xl border-2 border-white/20 backdrop-blur-xl",
                  selectedPlant.difficulty === 'easy' ? 'bg-brand-green/80 text-white' :
                  selectedPlant.difficulty === 'moderate' ? 'bg-brand-yellow/80 text-brand-green' :
                  'bg-red-500/80 text-white'
                )}>
                  Complexity: {selectedPlant.difficulty}
                </span>
            </div>
          </div>

          <div className="p-8 sm:p-20 space-y-12 sm:space-y-20">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 sm:gap-20">
              <div className="xl:col-span-2 space-y-12 sm:space-y-16">
                <div className="space-y-6">
                   <h2 className="text-[10px] font-black uppercase text-brand-green tracking-[0.4em] italic">Abstract / Biological Intent</h2>
                   <p className="text-xl sm:text-3xl font-medium text-slate-600 leading-relaxed max-w-4xl border-l-[12px] border-brand-green pl-8 sm:pl-12 italic py-4">
                     {selectedPlant.description}
                   </p>
                </div>

                <div className="space-y-10">
                   <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em]">Life Cycle Chronology</h2>
                   <div className="relative pt-10">
                      <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2" />
                      <div className="flex justify-between relative z-10">
                         {['Germination', 'Vegetative', 'Vascular', 'Mature'].map((step, idx) => (
                           <div key={idx} className="flex flex-col items-center gap-4 bg-white group cursor-help">
                              <div className={cn(
                                "w-10 h-10 sm:w-16 sm:h-16 rounded-full border-4 border-white shadow-xl flex items-center justify-center transition-all",
                                idx === 2 ? "bg-brand-green text-white scale-110" : "bg-slate-100 text-slate-400"
                              )}>
                                 <Sprout size={idx === 2 ? 32 : 24} />
                              </div>
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-brand-green transition-colors">{step}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
              </div>

              <div className="space-y-12 bg-slate-50 p-10 rounded-[64px] border border-slate-100 shadow-inner">
                <div className="space-y-8">
                  <h3 className="text-xl font-display font-black text-slate-950 uppercase tracking-tighter">Specimen Parameters</h3>
                  <div className="space-y-6">
                    <Parameter icon={<Droplets className="text-blue-500" />} label="Hydro" value={selectedPlant.watering} />
                    <Parameter icon={<Sun className="text-amber-500" />} label="Lumina" value={selectedPlant.sunlight} />
                    <Parameter icon={<Beaker className="text-purple-500" />} label="Substrate pH" value={selectedPlant.soilPh} />
                    <Parameter icon={<Sprout className="text-brand-green" />} label="Seasonal Node" value={selectedPlant.season} />
                  </div>
                </div>

                <div className="space-y-6 pt-10 border-t border-slate-200">
                  <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Symbiotic Synergy</h2>
                  <div className="flex flex-wrap gap-3">
                    {selectedPlant.companionPlants.map(p => (
                      <div key={p} className="flex items-center gap-3 bg-white pl-2 pr-4 py-2 rounded-full border border-slate-200 shadow-sm hover:translate-y-[-2px] transition-all">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-brand-green">
                           <Leaf size={16} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-950 p-10 sm:p-20 rounded-[64px] sm:rounded-[80px] text-white space-y-12 relative overflow-hidden">
               <div className="relative z-10 space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-3xl sm:text-6xl font-display font-black tracking-tighter uppercase leading-none">Diagnostic Anomalies</h3>
                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-red-400 flex items-center gap-3">
                      <ShieldCheck size={20} /> Identity Verification Required for High-Risk Pathogens
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedPlant.diseases.map(d => (
                       <div key={d} className="bg-white/10 backdrop-blur-xl p-6 rounded-[32px] border border-white/10 hover:bg-white/20 transition-all cursor-pointer group">
                          <p className="text-[10px] font-black uppercase text-red-300 mb-2 tracking-widest group-hover:text-white transition-colors">Pathogen Node</p>
                          <p className="text-lg font-bold group-hover:translate-x-2 transition-transform">{d}</p>
                       </div>
                    ))}
                  </div>
               </div>
               <div className="absolute right-[-10%] top-[-10%] w-[40%] h-[40%] bg-red-600/20 rounded-full blur-[100px]" />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-10 pb-32">
       <div className="flex items-center justify-between">
        <div className="space-y-2">
            <h2 className="text-3xl sm:text-5xl font-display font-black text-slate-900 tracking-tighter uppercase leading-none">Biodiversity Index</h2>
            <p className="text-[9px] sm:text-[10px] font-black uppercase text-brand-green tracking-[0.3em] sm:tracking-[0.4em]">Global Botanical Repository</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="relative group">
          <Search className="absolute left-6 sm:left-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-green transition-colors w-5 h-5 sm:w-6 sm:h-6" />
          <input 
            type="text"
            placeholder="Search biological signatures..."
            className="w-full pl-14 sm:pl-20 pr-6 sm:pr-8 py-5 sm:py-8 bg-white border border-slate-200 rounded-2xl sm:rounded-[32px] focus:ring-4 focus:ring-brand-green/10 outline-none font-bold text-slate-900 shadow-xl transition-all text-sm sm:text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
          {['all', 'vegetable', 'fruit', 'grain', 'herb'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-6 sm:px-10 py-3 sm:py-5 rounded-[18px] sm:rounded-[24px] text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap transition-all border-2",
                filter === cat ? "bg-brand-green text-white border-brand-green shadow-xl scale-105" : "bg-white text-slate-400 border-slate-50 hover:bg-slate-50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
        <AnimatePresence>
          {filteredPlants.map(plant => (
            <motion.div
              layout
              key={plant.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => setSelectedPlant(plant)}
              className="bg-white p-5 sm:p-6 rounded-[48px] sm:rounded-[64px] flex flex-col xs:flex-row gap-6 sm:gap-10 cursor-pointer hover:shadow-2xl transition-all border border-slate-100 shadow-xl group relative overflow-hidden"
            >
              <div className="relative shrink-0 flex justify-center sm:block">
                <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-[32px] sm:rounded-[48px] overflow-hidden shadow-2xl border-4 border-white group-hover:scale-105 transition-transform relative z-10">
                  <img 
                      src={plant.image} 
                      alt={plant.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -top-3 -right-3 bg-brand-yellow text-brand-green w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white z-20 group-hover:rotate-12 transition-transform">
                    <Sprout size={24} />
                </div>
              </div>
              <div className="flex-1 space-y-4 py-2 relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl sm:text-3xl font-display font-black text-slate-900 uppercase tracking-tighter leading-tight">{plant.name}</h3>
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] bg-emerald-50 text-brand-green px-3 py-1 rounded-full border border-emerald-100">
                      {plant.type}
                    </span>
                  </div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] italic">{plant.scientificName}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none">Hydro Stats</p>
                    <div className="h-1 bg-blue-50 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-400" style={{ width: plant.watering === 'high' ? '100%' : plant.watering === 'moderate' ? '60%' : '30%' }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none">Photo Period</p>
                    <div className="h-1 bg-amber-50 rounded-full overflow-hidden">
                       <div className="h-full bg-amber-400" style={{ width: plant.sunlight === 'full sun' ? '100%' : '50%' }} />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-50 flex items-center gap-4">
                    <div className="flex -space-x-2">
                       {[1, 2, 3].map(i => (
                         <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100" />
                       ))}
                    </div>
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Synergy Protocol Active</p>
                </div>
              </div>
              
              {/* Technical Gradient Background */}
              <div className="absolute right-[-20%] bottom-[-20%] w-[60%] h-[60%] bg-brand-green/5 rounded-full blur-[60px] group-hover:bg-brand-green/10 transition-colors" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Parameter = ({ icon, label, value }: any) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{label}</span>
    </div>
    <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">{value}</span>
  </div>
);

const InfoCard = ({ icon, label, value }: any) => (
  <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 shadow-inner space-y-3 transition-colors hover:bg-white hover:shadow-xl group">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] italic leading-none">{label}</span>
    </div>
    <p className="text-xl font-display font-black text-slate-900 uppercase tracking-tighter">{value}</p>
  </div>
);
