import React, { useState } from 'react';
import { Droplets, Beaker, Bug, Clock, RefreshCw, Calculator, Info, Landmark, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const AgriCalculators: React.FC = () => {
  const [activeCalc, setActiveCalc] = useState<'irrigation' | 'fertilizer' | 'pest' | 'loan'>('irrigation');

  return (
    <div className="space-y-10 pb-32">
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        <CalcTab active={activeCalc === 'irrigation'} onClick={() => setActiveCalc('irrigation')} icon={<Droplets size={24} />} label="Hydro Cycles" />
        <CalcTab active={activeCalc === 'fertilizer'} onClick={() => setActiveCalc('fertilizer')} icon={<Beaker size={24} />} label="Nutrient Mix" />
        <CalcTab active={activeCalc === 'pest'} onClick={() => setActiveCalc('pest')} icon={<Bug size={24} />} label="Threat Counter" />
        <CalcTab active={activeCalc === 'loan'} onClick={() => setActiveCalc('loan')} icon={<Landmark size={24} />} label="Loan Tracker" />
      </div>

      <div className="bg-white p-6 sm:p-12 rounded-[64px] border border-slate-100 shadow-2xl space-y-10 relative overflow-y-auto max-h-[70vh] [scrollbar-width:thin]">
        <div className="absolute top-[-50px] right-[-50px] w-80 h-80 bg-brand-green/5 rounded-full blur-[100px] pointer-events-none" />
        {activeCalc === 'irrigation' && <IrrigationCalc />}
        {activeCalc === 'fertilizer' && <FertilizerCalc />}
        {activeCalc === 'pest' && <PestCalc />}
        {activeCalc === 'loan' && <LoanTracker />}
      </div>
    </div>
  );
};

const CalcTab = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center gap-4 px-6 sm:px-8 py-4 sm:py-5 rounded-[24px] sm:rounded-[32px] text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] transition-all border-2 whitespace-nowrap shadow-xl",
      active ? "bg-brand-green text-white border-white shadow-emerald-950/20 scale-105" : "bg-white text-slate-400 border-slate-50 hover:bg-slate-50"
    )}
  >
    {React.cloneElement(icon, { size: 20 })} <span className="sm:inline">{label}</span>
  </button>
);

const IrrigationCalc = () => {
  const [area, setArea] = useState(1);
  const [crop, setCrop] = useState('Rice');
  const [soilType, setSoilType] = useState('Clay');
  const [season, setSeason] = useState('Dry');

  const calculateRequirement = () => {
    let base = 1500; // liters per acre
    if (crop === 'Rice') base = 2500;
    if (crop === 'Tomato') base = 800;
    if (crop === 'Mango') base = 1200;
    
    if (soilType === 'Sandy') base *= 1.25;
    if (soilType === 'Loamy') base *= 1.1;
    
    if (season === 'Dry') base *= 1.4;
    if (season === 'Monsoon') base *= 0.4;
    
    return Math.round(base * area);
  };

  const getDripSuggestion = () => {
    if (crop === 'Rice') return "Flooding method required (2-5cm depth). Continuous hydration cycle recommended.";
    if (season === 'Dry') return "Intense 45-min drip cycle at sunrise and sunset.";
    return "Optimized 20-min drip cycle during morning hours only.";
  };

  return (
    <div className="space-y-8 sm:space-y-10 relative z-10">
      <div className="flex items-center gap-4 sm:gap-6 border-b border-slate-50 pb-6 sm:pb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-[24px] bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner border border-blue-100 shrink-0">
          <Droplets className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl sm:text-4xl font-display font-black text-slate-900 tracking-tighter uppercase">Hydro Scheduler</h3>
          <p className="text-[9px] sm:text-[10px] font-black uppercase text-blue-400 tracking-[0.3em] sm:tracking-[0.4em] italic">Precision Irrigation Logic</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <CalcInput label="Target Cultivar" value={crop} onChange={setCrop} options={['Rice', 'Tomato', 'Mango', 'Chili']} />
        <div className="space-y-3">
          <label className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] sm:tracking-[0.4em] italic pl-2">Farm Matrix Area (Acres)</label>
          <input 
            type="number" 
            value={area} 
            onChange={(e) => setArea(Number(e.target.value))}
            className="w-full p-4 sm:p-6 bg-slate-50 border border-slate-200 rounded-2xl sm:rounded-[24px] font-display font-black text-xl sm:text-2xl text-slate-900 outline-none focus:ring-4 focus:ring-blue-100"
          />
        </div>
        <CalcInput label="Substrate Texture" value={soilType} onChange={setSoilType} options={['Clay', 'Sandy', 'Loamy', 'Silty']} />
        <CalcInput label="Climatic Phase" value={season} onChange={setSeason} options={['Dry', 'Monsoon', 'Winter']} />
      </div>

      <div className="bg-blue-600 p-8 sm:p-12 rounded-[40px] sm:rounded-[56px] space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 relative z-10">
          <span className="text-[10px] sm:text-[11px] font-black text-white/40 uppercase tracking-[0.4em] sm:tracking-[0.5em] italic">Daily Resource requirement</span>
          <span className="text-4xl sm:text-6xl font-display font-black text-white tracking-tighter uppercase">{calculateRequirement()} Liters</span>
        </div>
        <div className="flex items-center gap-4 text-sm font-bold text-white/60 bg-white/5 p-6 rounded-[24px] border border-white/5 relative z-10 italic leading-relaxed">
          <Info size={20} className="text-brand-yellow shrink-0" />
          Neural Suggestion: {getDripSuggestion()}
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
        <div className="flex items-center justify-center gap-6 sm:gap-12 py-6 sm:py-10 bg-slate-50 rounded-[32px] sm:rounded-[48px] shadow-inner border border-slate-200">
          <button onClick={() => setCount(Math.max(0, count - 1))} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[32px] bg-white border-2 border-slate-200 text-slate-400 hover:text-red-600 flex items-center justify-center text-3xl sm:text-4xl font-black shadow-xl active:translate-y-1 transition-all">-</button>
          <span className="text-6xl sm:text-9xl font-display font-black text-slate-900 tracking-tighter uppercase">{count}</span>
          <button onClick={() => setCount(count + 1)} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[32px] bg-white border-2 border-slate-200 text-slate-400 hover:text-brand-green flex items-center justify-center text-3xl sm:text-4xl font-black shadow-xl active:translate-y-1 transition-all">+</button>
        </div>
      </div>

      <div className={cn(
        "p-8 sm:p-12 rounded-[40px] sm:rounded-[56px] flex flex-col items-center text-center space-y-4 border-4 shadow-2xl relative overflow-hidden transition-all duration-500",
        count > 10 ? "bg-red-50 border-red-200 scale-105" : count > 5 ? "bg-brand-yellow/5 border-brand-yellow/20" : "bg-emerald-50 border-emerald-200"
      )}>
        <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.4em] sm:tracking-[0.6em] text-slate-400 italic mb-2">Diagnostic Threat Level</p>
        <h4 className={cn("text-4xl sm:text-6xl font-display font-black uppercase tracking-tighter", count > 10 ? "text-red-600" : count > 5 ? "text-brand-yellow" : "text-brand-green")}>
          {count > 10 ? "ALPHA CRITICAL" : count > 5 ? "BETA MODERATE" : "GAMMA STABLE"}
        </h4>
        <p className="text-lg font-medium text-slate-600 italic leading-relaxed max-w-md">
          {count > 10 ? "Deploy Cypermethrin or Abamectin synthesis immediately to neutralize the anomaly." : count > 5 ? "Activate yellow sticky visual traps and maintain high-frequency monitoring." : "No immediate biocidal intervention synthesized. Maintain observation."}
        </p>
      </div>
    </div>
  );
};

const LoanTracker = () => {
  const [loanAmount, setLoanAmount] = useState(50000);
  const [category, setCategory] = useState('KCC (Kisan Credit Card)');
  
  const getSubsidies = () => {
    if (category.includes('KCC')) return { interest: 4, rebate: 3, term: 1 };
    if (category.includes('Solar')) return { grant: 60, term: 5, interest: 8 };
    if (category.includes('Machine')) return { subsidy: 50, interest: 9, term: 3 };
    return { interest: 10, term: 1 };
  };

  const schemeData = getSubsidies();
  const rawLoan = Math.max(0, Number(loanAmount) || 0);
  const interestRate = (schemeData.interest || 0) / 100;
  const termYears = schemeData.term || 1;
  
  const totalInterest = rawLoan * interestRate * termYears;
  const totalRepayment = rawLoan + totalInterest;
  const monthlyInstallment = totalRepayment / (termYears * 12);

  return (
    <div className="space-y-10 relative z-10">
      <div className="flex items-center gap-6 border-b border-slate-50 pb-8">
        <div className="w-16 h-16 rounded-[24px] bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner border border-emerald-100">
          <Landmark size={32} />
        </div>
        <div className="space-y-1">
          <h3 className="text-4xl font-display font-black text-slate-900 tracking-tighter uppercase">Agri Finance Hub</h3>
          <p className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.4em] italic">Loan & Subsidy Tracker</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] italic pl-2">Requested Capital (BDT)</label>
          <input 
            type="number" 
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value === '' ? 0 : Number(e.target.value))}
            className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[24px] font-display font-black text-2xl text-slate-900 outline-none focus:ring-4 focus:ring-emerald-100"
          />
        </div>
        <CalcInput label="Financial Scheme" value={category} onChange={setCategory} options={['KCC (Kisan Credit Card)', 'Solar Pump (PM-KUSUM)', 'Farm Mechanization', 'Crop Insurance (PMFBY)']} />
      </div>

      <div className="bg-emerald-950 p-10 sm:p-12 rounded-[56px] space-y-10 shadow-2xl relative overflow-hidden border border-emerald-800">
        <div className="flex flex-col gap-2 relative z-10">
          <span className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.5em] italic">Projection Synthesis</span>
          <h3 className="text-4xl font-display font-black text-white uppercase tracking-tighter leading-none">{category}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          <div className="bg-white/5 p-6 rounded-[32px] border border-white/10 space-y-2">
            <p className="text-[9px] font-black uppercase text-emerald-400 tracking-widest">Base Rate</p>
            <p className="text-xl font-bold text-white uppercase tracking-tighter leading-none">{schemeData.interest}% APR</p>
          </div>
          <div className="bg-white/5 p-6 rounded-[32px] border border-white/10 space-y-2">
            <p className="text-[9px] font-black uppercase text-emerald-400 tracking-widest">Total Repayment</p>
            <p className="text-xl font-bold text-white uppercase tracking-tighter leading-none">৳{totalRepayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-white/5 p-6 rounded-[32px] border border-white/10 space-y-2">
            <p className="text-[9px] font-black uppercase text-emerald-400 tracking-widest">Monthly Installment</p>
            <p className="text-xl font-bold text-white uppercase tracking-tighter leading-none">৳{monthlyInstallment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-white/5 p-6 rounded-[32px] border border-white/10 space-y-2">
            <p className="text-[9px] font-black uppercase text-emerald-400 tracking-widest">Benefit Node</p>
            <p className="text-xl font-bold text-white uppercase tracking-tighter leading-none">{category.includes('Solar') ? '60% Grant' : 'Digital Sync'}</p>
          </div>
        </div>

        <div className="p-8 bg-emerald-900/50 rounded-[32px] border border-emerald-800 flex items-start gap-4 relative z-10">
          <ShieldCheck className="text-emerald-400 shrink-0" size={24} />
          <div className="space-y-1">
            <p className="font-bold text-white text-lg leading-none">Automated Compliance Notice</p>
            <p className="text-sm text-emerald-200/60 leading-relaxed italic">Your current profile status (94% Trust Score) qualifies for expedited processing. Disbursement time: 48-72 hours.</p>
          </div>
        </div>
        
        <div className="absolute right-[-20px] bottom-[-20px] w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]"></div>
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
    <label className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] sm:tracking-[0.4em] italic pl-2">{label}</label>
    <div className="relative">
        <select 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-4 sm:p-6 bg-slate-50 border border-slate-200 rounded-2xl sm:rounded-[24px] font-display font-black text-lg sm:text-2xl text-slate-900 outline-none focus:ring-4 focus:ring-brand-green/10 appearance-none uppercase tracking-tighter"
        >
          {options.map((opt: any) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
            <RefreshCw className="w-4 h-4 sm:w-6 sm:h-6" />
        </div>
    </div>
  </div>
);
