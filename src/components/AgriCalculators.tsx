import React, { useState } from 'react';
import { Droplets, Beaker, Bug, Clock, RefreshCw, Calculator, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const AgriCalculators: React.FC = () => {
  const [activeCalc, setActiveCalc] = useState<'irrigation' | 'fertilizer' | 'pest'>('irrigation');

  return (
    <div className="space-y-10 pb-32">
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        <CalcTab active={activeCalc === 'irrigation'} onClick={() => setActiveCalc('irrigation')} icon={<Droplets size={24} />} label="Hydro Cycles" />
        <CalcTab active={activeCalc === 'fertilizer'} onClick={() => setActiveCalc('fertilizer')} icon={<Beaker size={24} />} label="Nutrient Mix" />
        <CalcTab active={activeCalc === 'pest'} onClick={() => setActiveCalc('pest')} icon={<Bug size={24} />} label="Threat Counter" />
      </div>

      <div className="bg-white p-12 rounded-[64px] border border-slate-100 shadow-2xl space-y-10 relative overflow-hidden">
        <div className="absolute top-[-50px] right-[-50px] w-80 h-80 bg-brand-green/5 rounded-full blur-[100px] pointer-events-none" />
        {activeCalc === 'irrigation' && <IrrigationCalc />}
        {activeCalc === 'fertilizer' && <FertilizerCalc />}
        {activeCalc === 'pest' && <PestCalc />}
      </div>
    </div>
  );
};

const CalcTab = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center gap-4 px-8 py-5 rounded-[32px] text-[11px] font-black uppercase tracking-[0.2em] transition-all border-2 whitespace-nowrap shadow-xl",
      active ? "bg-brand-green text-white border-white shadow-emerald-950/20 scale-105" : "bg-white text-slate-400 border-slate-50 hover:bg-slate-50"
    )}
  >
    {icon} {label}
  </button>
);

const IrrigationCalc = () => {
  const [area, setArea] = useState(1);
  const [crop, setCrop] = useState('Rice');

  return (
    <div className="space-y-10 relative z-10">
      <div className="flex items-center gap-6 border-b border-slate-50 pb-8">
        <div className="w-16 h-16 rounded-[24px] bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner border border-blue-100">
          <Droplets size={32} />
        </div>
        <div className="space-y-1">
          <h3 className="text-4xl font-display font-black text-slate-900 tracking-tighter uppercase">Hydro Scheduler</h3>
          <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.4em] italic">Precision Irrigation Logic</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <CalcInput label="Target Cultivar" value={crop} onChange={setCrop} options={['Rice', 'Tomato', 'Mango', 'Chili']} />
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] italic pl-2">Farm Matrix Area (Acres)</label>
          <input 
            type="number" 
            value={area} 
            onChange={(e) => setArea(Number(e.target.value))}
            className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[24px] font-display font-black text-2xl text-slate-900 outline-none focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="bg-blue-600 p-12 rounded-[56px] space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.5em] italic">Daily Resource requirement</span>
          <span className="text-6xl font-display font-black text-white tracking-tighter uppercase">{area * 1500} Liters</span>
        </div>
        <div className="flex items-center gap-4 text-sm font-bold text-white/60 bg-white/5 p-6 rounded-[24px] border border-white/5 relative z-10 italic leading-relaxed">
          <Info size={20} className="text-brand-yellow shrink-0" />
          Neural Suggestion: 40 minutes of optimized drip irrigation twice every 24-hour cycle.
        </div>
        <div className="absolute right-[-40px] top-[-40px] w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
      </div>
    </div>
  );
};

const FertilizerCalc = () => {
  const [crop, setCrop] = useState('Rice');
  return (
    <div className="space-y-10 relative z-10">
      <div className="flex items-center gap-6 border-b border-slate-50 pb-8">
        <div className="w-16 h-16 rounded-[24px] bg-brand-yellow/10 text-brand-yellow flex items-center justify-center shadow-inner border border-brand-yellow/20">
          <Beaker size={32} />
        </div>
        <div className="space-y-1">
          <h3 className="text-4xl font-display font-black text-slate-900 tracking-tighter uppercase">Nutrient Synthesizer</h3>
          <p className="text-[10px] font-black uppercase text-brand-yellow tracking-[0.4em] italic">Chemical Node Balance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <CalcInput label="Target Cultivar" value={crop} onChange={setCrop} options={['Rice', 'Tomato', 'Mango', 'Chili']} />
        <CalcInput label="Phasic Growth Stage" value="Vegetative" onChange={() => {}} options={['Seedling', 'Vegetative', 'Flowering', 'Fruiting']} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NutrientBox label="N (Urea Protocol)" value="45kg" color="bg-orange-50 border-orange-200 text-orange-600" />
        <NutrientBox label="P (TSP Protocol)" value="20kg" color="bg-blue-50 border-blue-200 text-blue-600" />
        <NutrientBox label="K (MoP Protocol)" value="30kg" color="bg-red-50 border-red-200 text-red-600" />
      </div>
    </div>
  );
};

const PestCalc = () => {
  const [count, setCount] = useState(0);
  return (
    <div className="space-y-10 relative z-10">
      <div className="flex items-center gap-6 border-b border-slate-50 pb-8">
        <div className="w-16 h-16 rounded-[24px] bg-red-50 text-red-600 flex items-center justify-center shadow-inner border border-red-100">
          <Bug size={32} />
        </div>
        <div className="space-y-1">
          <h3 className="text-4xl font-display font-black text-slate-900 tracking-tighter uppercase">Threat Analyzer</h3>
          <p className="text-[10px] font-black uppercase text-red-500 tracking-[0.4em] italic">Pheromone Trap Feedback</p>
        </div>
      </div>

      <div className="space-y-10">
        <p className="text-lg font-medium text-slate-500 leading-relaxed italic max-w-2xl">
          Input active pest specimen counts collected from neural pheromone traps to synthesize outbreak risk analytics.
        </p>
        <div className="flex items-center justify-center gap-12 py-10 bg-slate-50 rounded-[48px] shadow-inner border border-slate-200">
          <button onClick={() => setCount(Math.max(0, count - 1))} className="w-20 h-20 rounded-[32px] bg-white border-2 border-slate-200 text-slate-400 hover:text-red-600 flex items-center justify-center text-4xl font-black shadow-xl active:translate-y-1 transition-all">-</button>
          <span className="text-9xl font-display font-black text-slate-900 tracking-tighter uppercase">{count}</span>
          <button onClick={() => setCount(count + 1)} className="w-20 h-20 rounded-[32px] bg-white border-2 border-slate-200 text-slate-400 hover:text-brand-green flex items-center justify-center text-4xl font-black shadow-xl active:translate-y-1 transition-all">+</button>
        </div>
      </div>

      <div className={cn(
        "p-12 rounded-[56px] flex flex-col items-center text-center space-y-4 border-4 shadow-2xl relative overflow-hidden transition-all duration-500",
        count > 10 ? "bg-red-50 border-red-200 scale-105" : count > 5 ? "bg-brand-yellow/5 border-brand-yellow/20" : "bg-emerald-50 border-emerald-200"
      )}>
        <p className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-400 italic mb-2">Diagnostic Threat Level</p>
        <h4 className={cn("text-6xl font-display font-black uppercase tracking-tighter", count > 10 ? "text-red-600" : count > 5 ? "text-brand-yellow" : "text-brand-green")}>
          {count > 10 ? "ALPHA CRITICAL" : count > 5 ? "BETA MODERATE" : "GAMMA STABLE"}
        </h4>
        <p className="text-lg font-medium text-slate-600 italic leading-relaxed max-w-md">
          {count > 10 ? "Deploy Cypermethrin or Abamectin synthesis immediately to neutralize the anomaly." : count > 5 ? "Activate yellow sticky visual traps and maintain high-frequency monitoring." : "No immediate biocidal intervention synthesized. Maintain observation."}
        </p>
      </div>
    </div>
  );
};

const NutrientBox = ({ label, value, color }: any) => (
  <div className={cn("p-10 rounded-[40px] flex flex-col items-center gap-4 shadow-xl border-2 transition-transform hover:scale-105", color)}>
    <span className="text-[11px] font-black uppercase tracking-[0.2em] italic opacity-60 text-center leading-none">{label}</span>
    <span className="text-4xl font-display font-black uppercase tracking-tighter">{value}</span>
  </div>
);

const CalcInput = ({ label, value, onChange, options }: any) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] italic pl-2">{label}</label>
    <div className="relative">
        <select 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[24px] font-display font-black text-2xl text-slate-900 outline-none focus:ring-4 focus:ring-brand-green/10 appearance-none uppercase tracking-tighter"
        >
          {options.map((opt: any) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
            <RefreshCw size={24} />
        </div>
    </div>
  </div>
);
