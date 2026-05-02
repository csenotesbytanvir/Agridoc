import React, { useState } from 'react';
import { Search, Filter, Sprout, Droplets, Sun, Beaker, ChevronLeft } from 'lucide-react';
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
        className="space-y-10 pb-32"
      >
        <button 
          onClick={() => setSelectedPlant(null)}
          className="flex items-center gap-4 text-slate-400 font-black text-[11px] uppercase tracking-[0.4em] italic hover:text-brand-green transition-colors"
        >
          <ChevronLeft size={24} /> Back to Repository Index
        </button>

        <div className="bg-white rounded-[80px] overflow-hidden shadow-2xl border border-slate-100">
          <div className="relative h-96">
            <img 
                src={selectedPlant.image} 
                alt={selectedPlant.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
            <div className="absolute bottom-10 left-10 space-y-2">
                <h1 className="text-6xl font-display font-black text-white tracking-tighter uppercase leading-none">{selectedPlant.name}</h1>
                <p className="text-white/60 text-lg font-medium italic">{selectedPlant.scientificName}</p>
            </div>
            <div className="absolute top-10 right-10">
                <span className={cn(
                  "px-8 py-3 rounded-[32px] text-xs font-black uppercase tracking-[0.3em] shadow-2xl border-2 border-white/20 backdrop-blur-xl",
                  selectedPlant.difficulty === 'easy' ? 'bg-brand-green/80 text-white' :
                  selectedPlant.difficulty === 'moderate' ? 'bg-brand-yellow/80 text-brand-green' :
                  'bg-red-500/80 text-white'
                )}>
                  Complexity: {selectedPlant.difficulty}
                </span>
            </div>
          </div>

          <div className="p-16 space-y-12">
            <p className="text-2xl font-medium text-slate-600 leading-relaxed italic border-l-8 border-brand-green pl-10 max-w-4xl">
              {selectedPlant.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
              <InfoCard icon={<Droplets size={24} className="text-blue-500" />} label="Hydro requirement" value={selectedPlant.watering} />
              <InfoCard icon={<Sun size={24} className="text-brand-yellow" />} label="Photosynthesis" value={selectedPlant.sunlight} />
              <InfoCard icon={<Sprout size={24} className="text-brand-green" />} label="Growth Cycle" value={selectedPlant.season} />
              <InfoCard icon={<Beaker size={24} className="text-purple-500" />} label="Substrate PH" value={selectedPlant.soilPh} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-slate-50">
                <div className="space-y-6">
                  <h3 className="text-3xl font-display font-black text-slate-900 uppercase tracking-tighter decoration-red-500 underline decoration-4 underline-offset-8">Threat Anomalies</h3>
                  <div className="flex flex-wrap gap-4">
                    {selectedPlant.diseases.map(d => (
                      <span key={d} className="px-6 py-3 bg-red-50 text-red-600 rounded-[24px] text-xs font-black uppercase tracking-widest border border-red-100 shadow-sm">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-3xl font-display font-black text-slate-900 uppercase tracking-tighter decoration-brand-green underline decoration-4 underline-offset-8">Symbiotic Nodes</h3>
                  <div className="flex flex-wrap gap-4">
                    {selectedPlant.companionPlants.map(p => (
                      <span key={p} className="px-6 py-3 bg-emerald-50 text-brand-green rounded-[24px] text-xs font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
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
            <h2 className="text-5xl font-display font-black text-slate-900 tracking-tighter uppercase leading-none">Biodiversity Index</h2>
            <p className="text-[10px] font-black uppercase text-brand-green tracking-[0.4em]">Global Botanical Repository</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="relative group">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-green transition-colors w-6 h-6" />
          <input 
            type="text"
            placeholder="Search biological signatures..."
            className="w-full pl-20 pr-8 py-8 bg-white border border-slate-200 rounded-[32px] focus:ring-4 focus:ring-brand-green/10 outline-none font-bold text-slate-900 shadow-xl transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {['all', 'vegetable', 'fruit', 'grain', 'herb'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all border-2",
                filter === cat ? "bg-brand-green text-white border-brand-green shadow-xl scale-105" : "bg-white text-slate-400 border-slate-50 hover:bg-slate-50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <AnimatePresence>
          {filteredPlants.map(plant => (
            <motion.div
              layout
              key={plant.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => setSelectedPlant(plant)}
              className="bg-white p-6 rounded-[56px] flex flex-col sm:flex-row gap-8 cursor-pointer hover:shadow-2xl transition-all border border-slate-100 shadow-xl group border-l-8 border-l-slate-200 hover:border-l-brand-green"
            >
              <div className="relative shrink-0">
                <img 
                    src={plant.image} 
                    alt={plant.name} 
                    className="w-32 h-32 rounded-[40px] object-cover shadow-xl border-4 border-white group-hover:scale-105 group-hover:-rotate-3 transition-transform"
                    referrerPolicy="no-referrer"
                />
                <div className="absolute -top-3 -right-3 bg-brand-yellow text-brand-green w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
                    <Sprout size={20} />
                </div>
              </div>
              <div className="flex-1 space-y-3 py-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-display font-black text-slate-900 uppercase tracking-tighter">{plant.name}</h3>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-emerald-50 text-brand-green px-4 py-1.5 rounded-full border border-emerald-100 shadow-sm">
                    {plant.type}
                  </span>
                </div>
                <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] italic">{plant.scientificName}</p>
                <div className="flex items-center gap-6 pt-2">
                  <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                    <Droplets size={16} className="text-blue-400" /> {plant.watering}
                  </span>
                  <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                    <Sun size={16} className="text-brand-yellow" /> {plant.sunlight}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

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
