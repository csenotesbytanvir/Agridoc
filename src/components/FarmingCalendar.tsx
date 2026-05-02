import React, { useState } from 'react';
import { Calendar as CalendarIcon, CheckCircle2, AlertTriangle, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { CALENDAR_DATA } from '../constants';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const FarmingCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [tasks, setTasks] = useState(() => {
    const local = localStorage.getItem('agri_tasks');
    return local ? JSON.parse(local) : CALENDAR_DATA;
  });

  const toggleTask = (index: number) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
    localStorage.setItem('agri_tasks', JSON.stringify(updated));
  };

  const monthTasks = tasks.filter((t: any) => t.month === currentMonth);

  return (
    <div className="space-y-10 pb-32">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
            <h2 className="text-5xl font-display font-black text-slate-900 tracking-tighter uppercase leading-none">Agri Schedule</h2>
            <p className="text-[10px] font-black uppercase text-brand-green tracking-[0.4em]">Chronological Cultivation Matrix</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-3 rounded-[32px] border border-slate-100 shadow-xl">
          <button 
            onClick={() => setCurrentMonth(prev => (prev === 0 ? 11 : prev - 1))}
            className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-brand-green transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="px-8 py-3 bg-brand-green/10 rounded-2xl min-w-40 text-center font-display font-black text-xl text-brand-green uppercase tracking-tighter">
            {MONTHS[currentMonth]}
          </div>
          <button 
            onClick={() => setCurrentMonth(prev => (prev === 11 ? 0 : prev + 1))}
            className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-brand-green transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="bg-white p-12 rounded-[64px] border border-slate-100 shadow-2xl space-y-10">
        <div className="flex items-center gap-4 text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] italic border-b border-slate-50 pb-6">
          <CalendarIcon size={20} className="text-brand-green" />
          <span>Sync Protocol for {MONTHS[currentMonth]} Cycletime</span>
        </div>

        <div className="space-y-6">
          {monthTasks.length > 0 ? (
            monthTasks.map((task: any, i: number) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "p-8 rounded-[40px] border transition-all flex items-start gap-8 group",
                  task.completed ? "bg-slate-50 border-transparent opacity-40 grayscale" : "bg-white border-slate-100 shadow-xl hover:border-brand-green/20"
                )}
              >
                <button 
                  onClick={() => toggleTask(tasks.indexOf(task))}
                  className={cn(
                    "mt-1 w-10 h-10 rounded-2xl flex items-center justify-center border-4 transition-all shadow-sm",
                    task.completed ? "bg-brand-green border-brand-green text-white" : "bg-white border-slate-50 text-transparent"
                  )}
                >
                  <CheckCircle2 size={24} className={task.completed ? "scale-100" : "scale-0"} />
                </button>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-display font-black text-slate-900 uppercase tracking-tighter">{task.crop}</span>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-sm",
                      task.type === 'pest-alert' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-brand-green border border-emerald-100'
                    )}>
                      {task.type}
                    </span>
                  </div>
                  <p className="text-lg font-medium text-slate-500 leading-tight italic">{task.task}</p>
                </div>
                {task.type === 'pest-alert' && !task.completed && (
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 animate-pulse border border-red-100">
                     <AlertTriangle size={24} />
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 text-slate-300 font-display font-black text-2xl uppercase tracking-widest opacity-20 italic">
              No Operational Directives Found
            </div>
          )}
        </div>

        <button className="w-full py-8 border-4 border-dashed border-slate-100 rounded-[48px] flex items-center justify-center gap-4 text-slate-300 font-black text-sm uppercase tracking-[0.4em] hover:bg-slate-50 hover:border-brand-green/20 hover:text-brand-green transition-all group">
          <Plus size={24} className="group-hover:rotate-180 transition-transform duration-500" />
          Inject Custom Node Directive
        </button>
      </div>

      {/* Progress View */}
      <div className="bg-slate-900 p-12 rounded-[64px] flex items-center justify-between shadow-2xl relative overflow-hidden">
        <div className="space-y-2 z-10">
          <h3 className="text-3xl font-display font-black text-white uppercase tracking-tighter">Matrix Yield Progress</h3>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic leading-none">Temporal Task Completion Metrics</p>
        </div>
        <div className="relative w-24 h-24 z-10">
          <svg className="w-24 h-24 transform -rotate-90 scale-110">
            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251} strokeDashoffset={251 - (251 * 0.6)} className="text-brand-green shadow-glow" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xl font-display font-black text-white">60%</span>
        </div>
        <div className="absolute right-[-40px] bottom-[-40px] w-64 h-64 bg-brand-green/10 rounded-full blur-[80px]"></div>
      </div>
    </div>
  );
};
