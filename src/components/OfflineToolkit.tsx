import React, { useState } from 'react';
import { SymptomChecker } from './SymptomChecker';
import { FarmingCalendar } from './FarmingCalendar';
import { PlantLibrary } from './PlantLibrary';
import { AgriCalculators } from './AgriCalculators';
import { BookOpen, Calendar, HelpCircle, ArrowRight, Cloud, Info, Calculator, Beaker, Search, Sprout, Droplets } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useAgriDoc } from '../App';

export const OfflineToolkit: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'checker' | 'calendar' | 'library' | 'guides' | 'calc'>('checker');
  const { state, setIsOnline } = useAgriDoc();

  const renderContent = () => {
    switch (activeTab) {
      case 'checker': return <SymptomChecker />;
      case 'calendar': return <FarmingCalendar />;
      case 'library': return <PlantLibrary />;
      case 'calc': return <AgriCalculators />;
      case 'guides': return <ExpertGuides />;
      default: return <SymptomChecker />;
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
      <div className="space-y-4">
        <h2 className="text-5xl font-display font-black text-slate-900 tracking-tighter uppercase">Manual Proxy</h2>
        <p className="text-[10px] font-black uppercase text-brand-green tracking-[0.4em]">Rural Resilience Matrix v3.0</p>
      </div>

      {/* Offline Alert */}
      <div className="bg-white border-4 border-slate-100 text-slate-900 p-10 rounded-[64px] shadow-2xl flex flex-col xl:flex-row items-center justify-between gap-10 relative overflow-hidden group">
        <div className="flex items-center gap-8 relative z-10">
          <div className="bg-emerald-50 w-20 h-20 rounded-[32px] border-2 border-emerald-100 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Info className="w-10 h-10 text-brand-green" />
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-display font-black leading-tight tracking-tighter uppercase">Neural Sync Severed</p>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Matrix Status: Edge Repository Hybrid Active</p>
          </div>
        </div>
        <button 
          onClick={() => setIsOnline(true)}
          className="bg-brand-green text-white px-12 py-7 rounded-[32px] text-[11px] font-black uppercase tracking-[0.4em] relative z-10 w-full xl:w-auto shadow-xl hover:scale-[1.03] transition-all border-b-4 border-emerald-900 active:translate-y-1"
        >
          Restore Neural Uplink
        </button>
        <div className="absolute top-[-50px] left-[-50px] w-96 h-96 bg-brand-green/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 overflow-x-auto pb-10 scrollbar-hide -mx-4 px-4 sticky top-0 z-20">
        <TabButton active={activeTab === 'checker'} onClick={() => setActiveTab('checker')} icon={<HelpCircle />} label="Symptom Check" />
        <TabButton active={activeTab === 'calc'} onClick={() => setActiveTab('calc')} icon={<Calculator />} label="NPK Matrix" />
        <TabButton active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} icon={<Calendar />} label="Crop Cycle" />
        <TabButton active={activeTab === 'library'} onClick={() => setActiveTab('library')} icon={<BookOpen />} label="Cultivar Atlas" />
        <TabButton active={activeTab === 'guides'} onClick={() => setActiveTab('guides')} icon={<Clipboard />} label="Field Guides" />
      </div>

      <div className="min-h-[500px]">
        {renderContent()}
      </div>

      {/* Backup Section */}
      <div className="bg-slate-900 p-16 rounded-[80px] space-y-10 border-4 border-white/5 relative overflow-hidden group shadow-2xl">
        <div className="space-y-6 relative z-10">
          <div className="w-24 h-24 bg-white/5 rounded-[40px] border border-white/10 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
            <Cloud className="text-brand-green" size={48} />
          </div>
          <div className="space-y-3">
            <h3 className="text-4xl font-display font-black text-white tracking-tighter uppercase">Global Synchronization</h3>
            <p className="text-lg text-white/40 font-medium leading-relaxed max-w-lg uppercase tracking-wide">
               Export localized field observations to the core decentralized ledger for deep-learning cross-synthesis across the global matrix.
            </p>
          </div>
        </div>
        <button className="bg-brand-green text-white w-full sm:w-auto py-8 px-16 rounded-[40px] text-2xl font-display font-black tracking-tighter shadow-2xl hover:scale-105 transition-all border-b-4 border-emerald-900 active:translate-y-1">
          Initiate Core Broadcast
        </button>
        <div className="absolute right-[-40px] bottom-[-40px] w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[150px]"></div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center gap-4 px-10 py-5 rounded-[28px] text-[11px] font-black uppercase tracking-[0.3em] whitespace-nowrap transition-all border-2",
      active 
        ? "bg-brand-green text-white border-brand-green shadow-xl" 
        : "bg-white text-slate-400 border-slate-100 hover:bg-slate-50 hover:text-brand-green hover:border-brand-green/20"
    )}
  >
    {React.cloneElement(icon as React.ReactElement, { size: 24, strokeWidth: 3 })}
    <span>{label}</span>
  </button>
);

const Clipboard = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>
);

const ExpertGuides = () => (
  <div className="space-y-10">
    <div className="flex items-center justify-between">
        <h2 className="text-4xl font-display font-black text-slate-900 tracking-tighter uppercase leading-none">Intelligence Synthesis</h2>
        <div className="text-[10px] font-black uppercase text-brand-green tracking-[0.4em] italic">Knowledge Archival Node</div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <GuideCard title="Organic Biocide Synthesis" duration="5 min Readtime" icon={<Beaker className="text-pink-500" />} />
      <GuideCard title="Substrate Health Diagnosis" duration="8 min Readtime" icon={<Search className="text-blue-500" />} />
      <GuideCard title="Consensus Composting Protocol" duration="12 min Readtime" icon={<Sprout className="text-brand-green" />} />
      <GuideCard title="Atmospheric Nitrogen Infusion" duration="6 min Readtime" icon={<Droplets className="text-cyan-500" />} />
    </div>
  </div>
);

const GuideCard = ({ title, duration, icon }: any) => (
  <button className="bg-white p-8 rounded-[48px] flex items-center gap-6 text-left border border-slate-100 shadow-xl group hover:shadow-2xl transition-all relative overflow-hidden group">
    <div className="w-16 h-16 rounded-[24px] bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform relative z-10">
      {icon}
    </div>
    <div className="flex-1 space-y-1 relative z-10">
      <h3 className="text-2xl font-display font-black text-slate-900 uppercase tracking-tighter group-hover:text-brand-green transition-colors">{title}</h3>
      <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] italic">{duration}</p>
    </div>
    <ArrowRight className="text-slate-200 group-hover:text-brand-green group-hover:translate-x-2 transition-all relative z-10" size={32} />
    <div className="absolute right-[-20px] top-[-20px] w-40 h-40 bg-slate-50 rounded-full blur-[40px] pointer-events-none group-hover:bg-brand-green/5 transition-colors"></div>
  </button>
);
