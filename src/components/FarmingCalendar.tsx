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

  const daysInMonth = new Date(2026, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(2026, currentMonth, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="space-y-10 pb-32">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-5xl font-display font-black text-slate-900 tracking-tighter uppercase leading-none">Agri Schedule</h2>
            <p className="text-[10px] font-black uppercase text-brand-green tracking-[0.4em]">Chronological Cultivation Matrix v2.0</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[64px] border border-slate-100 shadow-2xl space-y-8">
            <div className="grid grid-cols-7 gap-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="text-center text-[10px] font-black uppercase text-slate-300 tracking-widest pb-4">{d}</div>
                ))}
                {Array(firstDayOfMonth).fill(null).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square bg-slate-50/50 rounded-2xl border border-dashed border-slate-100 opacity-20" />
                ))}
                {days.map(day => {
                    const hasTask = monthTasks.some((t: any) => (day % 7 === 0 && t.type === 'pest-alert') || (day % 10 === 0 && t.type === 'harvest') || day === 5);
                    return (
                        <div key={day} className={cn(
                            "aspect-square rounded-2xl border flex flex-col items-center justify-center relative transition-all group cursor-pointer hover:border-brand-green hover:shadow-xl hover:scale-105",
                            day === new Date().getDate() && currentMonth === new Date().getMonth() ? "bg-brand-green border-brand-green text-white shadow-glow" : "bg-white border-slate-50 text-slate-900"
                        )}>
                            <span className="text-xl font-display font-black">{day}</span>
                            {hasTask && (
                                <div className="absolute bottom-2 flex gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                                    {day % 7 === 0 && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Task Details */}
        <div className="bg-slate-50 p-10 rounded-[64px] border border-slate-100 shadow-inner space-y-8">
            <div className="space-y-1">
                <h3 className="text-2xl font-display font-black text-slate-900 uppercase tracking-tight">Active Directives</h3>
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest italic">Operations for {MONTHS[currentMonth]}</p>
            </div>

            <div className="space-y-6">
                {monthTasks.map((task: any, i: number) => (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={i} 
                        className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all relative group overflow-hidden"
                    >
                        <div className="flex items-start gap-4">
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2",
                                task.type === 'pest-alert' ? "bg-red-50 border-red-100 text-red-500" : "bg-emerald-50 border-emerald-100 text-brand-green"
                            )}>
                                {task.type === 'pest-alert' ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-display font-black text-lg text-slate-900 leading-none uppercase">{task.crop}</h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{task.type}</p>
                            </div>
                        </div>
                        <p className="mt-4 text-sm font-medium text-slate-500 italic leading-relaxed">{task.task}</p>
                        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Precision: 98.4%</span>
                            <button onClick={() => toggleTask(tasks.indexOf(task))} className={cn(
                                "text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full transition-all",
                                task.completed ? "bg-slate-100 text-slate-400" : "bg-brand-green text-white shadow-lg shadow-emerald-950/20"
                            )}>
                                {task.completed ? 'Sync Success' : 'Execute'}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </div>

      <div className="bg-white p-12 rounded-[64px] border border-slate-100 shadow-2xl relative overflow-hidden group">
         <div className="flex flex-col sm:flex-row items-center justify-between gap-10">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-brand-green" size={24} />
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-brand-green italic">Neural Health Synthesis</span>
                </div>
                <h3 className="text-4xl font-display font-black text-slate-900 uppercase leading-none tracking-tighter">Your crops are in the <span className="text-brand-green">Safe Zone</span></h3>
                <p className="text-lg font-medium text-slate-500/80 leading-relaxed italic border-l-4 border-brand-green pl-6">The current climatic matrix and historical yield data suggest optimal conditions for transplanting Kharif-I varietals this week.</p>
            </div>
            <div className="relative w-40 h-40 shrink-0">
               <svg className="w-40 h-40 transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-50" />
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * 0.85)} className="text-brand-green drop-shadow-xl" strokeLinecap="round" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <span className="text-4xl font-display font-black text-slate-900 leading-none">85%</span>
                   <span className="text-[9px] font-black uppercase text-slate-400">Total Sync</span>
               </div>
            </div>
         </div>
         <div className="absolute right-[-40px] top-[-40px] w-64 h-64 bg-brand-green/5 rounded-full blur-[80px]"></div>
      </div>

      <button className="w-full py-10 bg-slate-900 text-white rounded-[56px] font-display font-black text-2xl uppercase tracking-tighter flex items-center justify-center gap-6 shadow-2xl hover:scale-[1.01] transition-transform active:scale-95 group relative overflow-hidden">
        <Plus size={32} className="group-hover:rotate-180 transition-transform duration-700" />
        Initialize Custom Harvest Node
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      </button>
    </div>
  );
};
