import React from 'react';
import { Award, Trophy, Star, TrendingUp, Users, Target, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useAgriDoc } from '../App';
import { cn } from '../lib/utils';

const LEADERBOARD = [
  { name: 'Tanvir Ahmmed', points: 4500, level: 12, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tanvir' },
  { name: 'Somchai P.', points: 3800, level: 10, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Somchai' },
  { name: 'Ahmet Yilmaz', points: 3200, level: 9, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmet' },
  { name: 'Maria Santos', points: 2900, level: 8, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria' },
  { name: 'John Doe', points: 2100, level: 6, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
];

const REWARDS = [
  { title: 'Seed Discount', desc: '10% off at local depot', points: 500, icon: <Star className="text-yellow-400" /> },
  { title: 'Premium Expert', desc: '1 Free consultation', points: 1500, icon: <Trophy className="text-emerald-400" /> },
  { title: 'AgriHero Badge', desc: 'Show off on FarmGram', points: 3000, icon: <Award className="text-blue-400" /> },
];

export const Gamification: React.FC = () => {
  const { state } = useAgriDoc();

  return (
    <div className="space-y-10 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[24px] bg-emerald-600 flex items-center justify-center text-white shadow-xl border-4 border-white transition-transform hover:rotate-12">
            <Trophy size={32} />
          </div>
          <div className="space-y-1">
            <h2 className="text-5xl font-display font-black text-emerald-950 tracking-tighter uppercase leading-none italic">Global Rank</h2>
            <p className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.4em]">Neural Network Contribution Matrix</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-12 rounded-[64px] shadow-2xl border border-emerald-100 relative overflow-hidden space-y-12">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="text-center space-y-4 relative z-10">
          <p className="text-[11px] font-black uppercase text-emerald-400 tracking-[0.5em] italic">Authentication Identity Node Status</p>
          <h3 className="text-8xl font-display font-black text-emerald-950 tracking-tighter uppercase italic leading-none">Level {state.level}</h3>
          <div className="max-w-md mx-auto w-full h-4 bg-emerald-50 rounded-full mt-10 overflow-hidden border border-emerald-100">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${(state.points % 1000) / 10}%` }}
               className="bg-emerald-600 h-full shadow-[0_0_15px_#10b981]"
             />
          </div>
          <div className="flex justify-center items-center gap-4 text-[11px] font-black uppercase text-emerald-600 tracking-[0.4em] mt-8">
             <span>{state.points} Units Synthesized</span>
             <span className="text-emerald-200">/</span>
             <span className="text-emerald-400">{Math.ceil(state.points / 1000) * 1000} Threshold</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
           <StatusCard icon={<Target className="text-emerald-600" />} label="Validated Tasks" value="24" />
           <StatusCard icon={<TrendingUp className="text-blue-500" />} label="Network Percentile" value="#128" />
        </div>
      </div>

      <div className="space-y-8">
         <h4 className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.4em] ml-8 italic">Top Node Contributors</h4>
         <div className="space-y-4">
            {LEADERBOARD.map((user, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="bg-white p-8 rounded-[48px] flex items-center gap-8 border border-emerald-50 hover:border-emerald-200 hover:bg-emerald-50 transition-all shadow-xl group border-b-4 border-b-emerald-50"
              >
                <div className="text-4xl font-display font-black text-emerald-100 w-12 group-hover:text-emerald-600 transition-all">{i + 1}</div>
                <div className="relative">
                    <img src={user.avatar} className="w-20 h-20 rounded-[32px] bg-emerald-50 border-2 border-white shadow-xl group-hover:scale-110 transition-transform" alt={user.name} />
                    <div className="absolute -bottom-2 -right-2 bg-emerald-600 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                        {user.level}
                    </div>
                </div>
                <div className="flex-1">
                   <p className="text-2xl font-display font-black text-emerald-950 uppercase tracking-tighter leading-none">{user.name}</p>
                   <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mt-2 italic opacity-60">Identity Verified • Sector 7G</p>
                </div>
                <div className="text-right">
                   <p className="text-4xl font-display font-black text-emerald-600 tracking-tighter leading-none uppercase">{user.points}</p>
                   <p className="text-[10px] font-black uppercase text-emerald-200 tracking-widest mt-1 italic">Matrix units</p>
                </div>
              </motion.div>
            ))}
         </div>
      </div>

      <div className="space-y-8">
         <h4 className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.4em] ml-8 italic">Protocol Rewards</h4>
         <div className="grid grid-cols-1 gap-8">
            {REWARDS.map((reward, i) => (
              <div key={i} className="bg-white p-12 rounded-[56px] flex flex-col md:flex-row items-center justify-between gap-12 group shadow-xl border border-emerald-50 hover:bg-emerald-50 transition-all border-b-8 border-emerald-50">
                 <div className="flex items-center gap-8 text-center md:text-left flex-col md:flex-row">
                    <div className="w-24 h-24 rounded-[40px] bg-emerald-50 border border-emerald-100 flex items-center justify-center text-5xl shadow-inner group-hover:scale-110 transition-transform group-hover:bg-emerald-600 group-hover:text-white group-hover:rotate-6">
                      {reward.icon}
                    </div>
                    <div className="space-y-2">
                       <h5 className="text-3xl font-display font-black text-emerald-950 uppercase tracking-tighter leading-none">{reward.title}</h5>
                       <p className="text-xl text-emerald-900/40 font-medium leading-tight italic">{reward.desc}</p>
                    </div>
                 </div>
                 <button className={cn(
                    "px-12 h-20 rounded-[32px] text-[11px] font-black uppercase tracking-[0.4em] transition-all border-b-8 shadow-2xl active:translate-y-1",
                    state.points >= reward.points 
                        ? "bg-emerald-600 text-white border-emerald-900 hover:scale-105" 
                        : "bg-emerald-50 text-emerald-200 border-emerald-100 cursor-not-allowed opacity-50"
                 )}>
                    {state.points >= reward.points ? "Claim Deployment" : `${reward.points} Units Required`}
                 </button>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

const StatusCard = ({ icon, label, value }: any) => (
  <div className="bg-emerald-50/50 p-12 rounded-[48px] border border-emerald-100 flex flex-col items-center gap-6 shadow-inner hover:bg-white hover:shadow-2xl transition-all group cursor-default">
     <div className="w-20 h-20 rounded-[32px] bg-white border border-emerald-50 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all">{icon}</div>
     <div className="text-center space-y-1">
        <p className="text-[11px] font-black uppercase text-emerald-400 tracking-[0.5em] italic mb-2">{label}</p>
        <p className="text-6xl font-display font-black text-emerald-950 uppercase tracking-tighter leading-none">{value}</p>
     </div>
  </div>
);
