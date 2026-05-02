import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, TreeDeciduous, Wind, Droplets, CheckCircle2, ChevronRight, RefreshCcw } from 'lucide-react';
import { useAgriDoc } from '../App';
import { cn } from '../lib/utils';

const QUESTIONS = [
  { id: 1, text: "Do you use organic fertilizer?", points: 20 },
  { id: 2, text: "Do you practice crop rotation?", points: 20 },
  { id: 3, text: "Do you use integrated pest management (IPM)?", points: 20 },
  { id: 4, text: "Do you harvest rainwater for irrigation?", points: 20 },
  { id: 5, text: "Do you plant trees around your farm borders?", points: 20 },
];

export const SustainabilityScore: React.FC = () => {
  const { state, addPoints } = useAgriDoc();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (val: boolean) => {
    const newAnswers = [...answers, val];
    setAnswers(newAnswers);
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setFinished(true);
      addPoints(100);
    }
  };

  const calculateScore = () => {
    return answers.reduce((acc, curr, idx) => acc + (curr ? QUESTIONS[idx].points : 0), 0);
  };

  const reset = () => {
    setCurrentStep(0);
    setAnswers([]);
    setFinished(false);
  };

  const score = calculateScore();
  const carbonCredits = (score * 12.5).toFixed(1);

  return (
    <div className="space-y-10 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <h2 className="text-5xl font-display font-black text-emerald-950 tracking-tighter uppercase leading-none italic">Eco Ledger</h2>
          <p className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.4em]">Earth-Positive Farming Protocol</p>
        </div>
        <div className="w-16 h-16 rounded-[24px] bg-emerald-600 flex items-center justify-center text-white shadow-xl border-4 border-white transition-transform hover:rotate-12">
          <Leaf size={32} />
        </div>
      </div>

      {!finished ? (
        <div className="bg-white p-12 rounded-[64px] border border-emerald-100 shadow-2xl space-y-12">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-emerald-400 tracking-widest italic">Phase 0{currentStep + 1} // Logic Node</span>
            <div className="flex gap-2">
              {QUESTIONS.map((_, i) => (
                <div key={i} className={cn("h-2 w-10 rounded-full transition-all", i <= currentStep ? "bg-emerald-600" : "bg-emerald-50")} />
              ))}
            </div>
          </div>

          <motion.div 
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <h3 className="text-4xl font-display font-black text-emerald-950 leading-tight tracking-tighter uppercase">{QUESTIONS[currentStep].text}</h3>
            <div className="grid grid-cols-2 gap-8">
              <button 
                onClick={() => handleAnswer(true)}
                className="py-10 rounded-[40px] bg-emerald-600 text-white font-display font-black text-3xl tracking-tighter shadow-xl hover:scale-[1.02] active:translate-y-1 transition-all border-b-8 border-emerald-950 uppercase"
              >
                YES (TRUE)
              </button>
              <button 
                onClick={() => handleAnswer(false)}
                className="py-10 rounded-[40px] bg-emerald-50 border border-emerald-100 text-emerald-300 font-display font-black text-3xl tracking-tighter hover:bg-emerald-100 active:translate-y-1 transition-all uppercase"
              >
                NO (FALSE)
              </button>
            </div>
          </motion.div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-10"
        >
          <div className="bg-white p-16 rounded-[80px] text-center space-y-12 shadow-2xl border border-emerald-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
               <TreeDeciduous className="text-emerald-500/5 w-64 h-64 -mr-16 -mt-16" />
            </div>

            <div className="space-y-4 relative z-10">
              <p className="text-[11px] font-black uppercase text-emerald-400 tracking-[0.5em] italic">Synthesized Sustainability Matrix Score</p>
              <div className="text-9xl font-display font-black text-emerald-950 tracking-tighter">{score}<span className="text-4xl text-emerald-600">/100</span></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              <div className="bg-emerald-50 border border-emerald-100 p-10 rounded-[48px] space-y-3 shadow-inner">
                <div className="flex justify-center text-blue-500 mb-4 scale-150"><Wind size={48} /></div>
                <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Calculated Carbon Credits</p>
                <p className="text-4xl font-display font-black text-blue-600 tracking-tighter uppercase">{carbonCredits} Nodes</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 p-10 rounded-[48px] space-y-3 shadow-inner">
                <div className="flex justify-center text-amber-500 mb-4 scale-150"><TreeDeciduous size={48} /></div>
                <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Trees for Virtual Sync</p>
                <p className="text-4xl font-display font-black text-amber-600 tracking-tighter uppercase">{state.unplantedTrees + 1} Units</p>
              </div>
            </div>

            <p className="text-emerald-950/60 text-xl font-medium leading-relaxed max-w-2xl mx-auto relative z-10 italic">
              {score >= 80 ? "Superior Logic Detected. Your farm node is a prime contributor to regenerative agricultural stability." : 
               score >= 50 ? "Standard Protocol active. Enhancing sustainability heuristics will increase total yield analytics." : 
               "Anomaly detected in eco-sync. Review regenerative protocols to preserve cultivar integrity."}
            </p>

            <button onClick={reset} className="flex items-center gap-6 mx-auto text-[11px] font-black uppercase tracking-[0.4em] text-emerald-600 hover:text-emerald-700 transition-all relative z-10 py-6 px-12 border border-emerald-200 rounded-full bg-emerald-50 shadow-sm active:scale-95">
              <RefreshCcw size={18} className="animate-spin-slow" /> Reboot Core Matrix Quiz
            </button>
          </div>

          <div className="bg-emerald-950 p-12 rounded-[64px] flex flex-col md:flex-row items-center gap-10 shadow-2xl relative overflow-hidden border-4 border-emerald-900">
            <div className="w-24 h-24 rounded-[40px] bg-white/5 border border-white/10 flex items-center justify-center text-emerald-500 shadow-2xl z-10">
              <TreeDeciduous size={48} />
            </div>
            <div className="flex-1 space-y-4 z-10">
               <h4 className="text-4xl font-display font-black text-white tracking-tighter uppercase italic">Neural Forest Goal</h4>
               <p className="text-lg text-emerald-100/40 font-medium leading-relaxed">For every 10 cultivar diagnostic reports, we pledge to plant a neural node (virtual tree) in the global matrix.</p>
               <div className="w-full bg-white/5 h-4 rounded-full mt-4 border border-white/5 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full w-[60%] shadow-[0_0_20px_#10b981]" />
               </div>
               <div className="flex justify-between items-center text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em]">
                  <span>6 / 10 Synced</span>
                  <span className="text-white/20">4 remaining for deployment</span>
               </div>
            </div>
            <div className="absolute right-[-40px] bottom-[-40px] w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]"></div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
