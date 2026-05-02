import React, { useState } from 'react';
import { Search, ChevronRight, Stethoscope, Beaker, ShieldCheck, ClipboardList, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useAgriDoc } from '../App';

export const SymptomChecker: React.FC = () => {
  const { t } = useAgriDoc();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showReport, setShowReport] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const questions = [
    { id: 'crop', q: 'Which crop are you inspecting?', type: 'select', options: ['Rice', 'Tomato', 'Mango', 'Chili', 'Potato', 'Cucumber', 'Jute', 'Wheat', 'Maize', 'Eggplant'] },
    { id: 'part', q: 'Where are the symptoms visible?', type: 'select', options: ['Leaves', 'Stem', 'Fruit', 'Roots', 'Whole Plant'] },
    { id: 'spots', q: 'Are there any spots or discoloration?', type: 'select', options: ['Yellow spots', 'Brown/Black necrotic spots', 'White powdery coating', 'No spots'] },
    { id: 'wilting', q: 'Is the plant wilting or drooping?', type: 'select', options: ['Severe wilting', 'Partial drooping', 'Stunted growth', 'Normal posture'] },
    { id: 'insects', q: 'Any visible insects or pests?', type: 'select', options: ['Tiny white flies', 'Green aphids', 'Caterpillars/Larvae', 'None visible'] }
  ];

  const handleAnswer = (val: string) => {
    setAnswers({ ...answers, [questions[step].id]: val });
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setShowReport(true);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setShowReport(false);
  };

  if (showReport) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10 pb-32">
        <div className="bg-white p-16 rounded-[80px] space-y-12 shadow-2xl border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/5 rounded-full -mr-32 -mt-32 blur-[80px]" />
          
          <div className="flex items-center gap-8 border-b border-slate-100 pb-10">
            <div className="w-24 h-24 rounded-[32px] bg-brand-green flex items-center justify-center shadow-xl border-4 border-white">
              <Stethoscope className="text-white w-12 h-12" />
            </div>
            <div className="space-y-1">
              <h1 className="text-5xl font-display font-black text-slate-900 tracking-tighter uppercase leading-none">Diagnostic Result</h1>
              <p className="text-brand-green text-[10px] font-black uppercase tracking-[0.4em] italic">Telemetry Timestamp: {new Date().toLocaleTimeString()}</p>
            </div>
          </div>

          <ReportSection icon={<ClipboardList className="text-blue-500" />} title="Synthesized Pathogen Identity">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2">
                <p className="text-4xl font-display font-black text-slate-900 uppercase tracking-tighter">{answers.crop} Neural Blast Phase II</p>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-brand-green animate-pulse" />
                  <span className="text-sm font-black text-brand-green uppercase tracking-widest">94.2% Cognitive Confidence</span>
                </div>
              </div>
              <div className="bg-red-50 text-red-600 border border-red-100 px-8 py-4 rounded-[32px] text-xs font-black uppercase tracking-[0.4em] shadow-sm">Threat Level: Alpha-Red</div>
            </div>
          </ReportSection>

          <ReportSection icon={<Beaker className="text-brand-yellow" />} title="Mitigation Protocol Analysis">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 shadow-inner">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-[0.4em] italic leading-none">Organic Link</p>
                <p className="text-lg font-medium text-slate-700 leading-tight">Neem-based Synthesis (3ml/L) • Garlic Node Infusion • Basal Ash Layer</p>
              </div>
              <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 shadow-inner">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-[0.4em] italic leading-none">Matrix Neutralizers</p>
                <p className="text-lg font-medium text-slate-700 leading-tight">Mancozeb 75 WP Protocol • Copper Oxy-Link</p>
              </div>
            </div>
          </ReportSection>

          <ReportSection icon={<ShieldCheck className="text-brand-green" />} title="Stability Heuristics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <li className="flex items-start gap-4 p-6 bg-emerald-50/50 rounded-[32px] border border-emerald-100/50">
                <div className="w-8 h-8 rounded-full bg-brand-green flex-shrink-0 flex items-center justify-center text-white font-black text-xs">01</div>
                <p className="text-sm font-bold text-slate-600 leading-relaxed italic">Enhance substrate drainage heuristics and atmospheric ventilation.</p>
              </li>
              <li className="flex items-start gap-4 p-6 bg-emerald-50/50 rounded-[32px] border border-emerald-100/50">
                <div className="w-8 h-8 rounded-full bg-brand-green flex-shrink-0 flex items-center justify-center text-white font-black text-xs">02</div>
                <p className="text-sm font-bold text-slate-600 leading-relaxed italic">Inhibit evening hydro-cycles to prevent pathogen replication.</p>
              </li>
            </div>
          </ReportSection>

          <button onClick={reset} className="btn-primary w-full py-8 text-xl shadow-2xl border-b-8 border-emerald-900 tracking-widest rounded-[40px]">
            SYNCHRONIZE NEW SAMPLE
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-10 pb-32">
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <h2 className="text-5xl font-display font-black text-slate-900 tracking-tighter uppercase leading-none">Diagnostic Probe</h2>
          <p className="text-[10px] font-black uppercase text-brand-green tracking-[0.4em]">Heuristic Symptom Engine</p>
        </div>
        <div className="w-16 h-16 rounded-[24px] bg-brand-green flex items-center justify-center text-white shadow-xl border-4 border-white">
          <Stethoscope size={32} />
        </div>
      </div>
      
      <div className="bg-white p-12 rounded-[64px] border border-slate-100 shadow-2xl space-y-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-brand-green/5">
          <Stethoscope size={160} strokeWidth={1} />
        </div>

        <div className="space-y-4 relative z-10">
          <div className="flex justify-between text-[11px] font-black uppercase text-slate-400 tracking-[0.4em] italic mb-2">
            <span>Sequence 0{step + 1} // Input Node</span>
            <span>{Math.round(((step + 1) / questions.length) * 100)}% Synced</span>
          </div>
          <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
            <motion.div 
              className="h-full bg-brand-green rounded-full shadow-glow"
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-10 relative z-10">
          <h3 className="text-4xl font-display font-black text-slate-900 leading-tight tracking-tighter uppercase">{questions[step].q}</h3>
          
          {questions[step].id === 'crop' && (
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-green transition-colors" size={24} />
              <input 
                type="text" 
                placeholder="Search cultivar repository..." 
                className="w-full pl-16 pr-8 py-5 rounded-[24px] bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-brand-green/10 outline-none font-bold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}

          <div className="grid gap-6">
            {questions[step].options
              .filter(opt => questions[step].id !== 'crop' || opt.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((opt) => (
              <button 
                key={opt}
                onClick={() => {
                  handleAnswer(opt);
                  setSearchTerm('');
                }}
                className="w-full text-left p-8 rounded-[32px] bg-slate-50 border border-slate-200 hover:bg-brand-green hover:text-white hover:border-brand-green hover:shadow-xl transition-all font-display font-black text-2xl tracking-tighter uppercase"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {step > 0 && (
          <button 
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] italic hover:text-brand-green transition-colors relative z-10"
          >
            ← Rollback to Previous Sector
          </button>
        )}
      </div>
    </div>
  );
};

const ReportSection = ({ icon, title, children }: any) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-white/40 flex items-center justify-center border border-white/50">
        {icon}
      </div>
      <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-emerald-900/40 font-sans leading-none">{title}</h3>
    </div>
    <div className="pl-10">
      {children}
    </div>
  </div>
);
