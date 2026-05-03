import React from 'react';
import { Phone, Mail, MapPin, Award, ExternalLink, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

const EXPERTS = [
  { id: 1, name: 'Dr. Tanvir Ahmmed', gender: 'male', degree: 'Ph.D. Plant Pathology', specialization: 'Rice Disease Specialist', location: 'Dhaka', phone: '+880-1234567', email: 'tanvir@agridoc.ai', avatar: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?q=80&w=1921&auto=format&fit=crop' },
  { id: 2, name: 'Arjun Sharma', gender: 'male', degree: 'M.Sc. Agriculture', specialization: 'Soil Fertility Expert', location: 'Rajshahi', phone: '+880-1234568', email: 'arjun@agridoc.ai', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop' },
  { id: 3, name: 'Priya Das', gender: 'female', degree: 'B.Sc. Agriculture', specialization: 'Organic Farming', location: 'Sylhet', phone: '+880-1234569', email: 'priya@agridoc.ai', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop' },
  { id: 4, name: 'Sompong Bun', gender: 'male', degree: 'M.Sc. Entomology', specialization: 'Pest Management', location: 'Bangkok', phone: '+66-0987654', email: 'sompong@agridoc.ai', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop' },
  { id: 5, name: 'Sireena Thai', gender: 'female', degree: 'B.Sc. Botany', specialization: 'Greenhouse Tech', location: 'Chiang Mai', phone: '+66-0987655', email: 'sireena@agridoc.ai', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop' },
  { id: 6, name: 'Fatema Khatun', gender: 'female', degree: 'M.Sc. Horticulture', specialization: 'Fruit Crop Expert', location: 'Chittagong', phone: '+880-1234570', email: 'fatema@agridoc.ai', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop' },
];

export const Experts: React.FC = () => {
  return (
    <div className="space-y-10 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
            <h2 className="text-5xl font-display font-black text-emerald-950 tracking-tighter uppercase leading-none">Agro Sentinels</h2>
            <p className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.4em]">Verified High-Council Agronomists</p>
        </div>
        <div className="bg-emerald-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-xl border-4 border-white">
          Active
        </div>
      </div>

      <div className="grid gap-10">
        {EXPERTS.map((expert, i) => (
          <motion.div 
            key={expert.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[64px] border border-emerald-100 shadow-2xl overflow-hidden group hover:shadow-emerald-900/10 transition-all p-2 relative"
          >
            <div className="bg-emerald-50 p-10 rounded-[56px] space-y-8 relative overflow-hidden">
              <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-emerald-600/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-emerald-600/10 transition-colors" />
              
              <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                <div className="relative shrink-0">
                  <img 
                    src={expert.avatar} 
                    alt={expert.name} 
                    className="w-32 h-32 rounded-[40px] object-cover shadow-2xl border-4 border-white group-hover:scale-105 group-hover:rotate-3 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white animate-bounce group-hover:animate-none">
                    <Award size={20} />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-4xl font-display font-black text-emerald-950 uppercase tracking-tighter leading-none">{expert.name}</h3>
                    <p className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.3em] italic">{expert.degree}</p>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <span className="text-[10px] font-black uppercase bg-white text-emerald-400 border border-emerald-100 px-5 py-2 rounded-[20px] shadow-sm tracking-widest italic group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all">
                      {expert.specialization}
                    </span>
                    <span className="text-[10px] font-black uppercase bg-white text-emerald-400 border border-emerald-100 px-5 py-2 rounded-[20px] shadow-sm tracking-widest italic flex items-center gap-2">
                        <MapPin size={14} className="text-emerald-600" /> {expert.location} Node
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 border-t border-emerald-200/50 pt-8 relative z-10">
                 <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase text-emerald-600/40 tracking-[0.4em] italic mb-1">Matrix Tenure</p>
                    <p className="text-2xl font-display font-black text-emerald-950 uppercase tracking-tighter">10+ CYCLES</p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase text-emerald-600/40 tracking-[0.4em] italic mb-1">Response Rate</p>
                    <p className="text-2xl font-display font-black text-emerald-600 uppercase tracking-tighter">98.4% SYNCHRONIZED</p>
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 relative z-10">
                <a 
                  href={`tel:${expert.phone}`}
                  className="flex-1 h-20 bg-emerald-600 text-white rounded-[32px] flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.3em] shadow-xl shadow-emerald-600/20 hover:scale-[1.02] active:translate-y-1 transition-all border-b-8 border-emerald-900"
                >
                  <Phone size={24} /> Initiate Audio Link
                </a>
                <a 
                  href={`mailto:${expert.email}`}
                  className="flex-1 h-20 bg-white text-emerald-700 rounded-[32px] flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.3em] border-2 border-emerald-100 hover:bg-emerald-50 transition-all shadow-lg active:translate-y-1"
                >
                  <Mail size={24} /> Transmit Data
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-emerald-950 p-16 rounded-[80px] text-center space-y-8 relative overflow-hidden shadow-2xl">
        <p className="text-2xl font-display font-black text-white leading-tight italic uppercase tracking-tighter opacity-80 decoration-emerald-500 underline decoration-4 underline-offset-8">
          "Agro Sentinels are standing by for live tactical synchronization. Premium nodes unlocked for priority diagnostic uplink."
        </p>
        <button className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.5em] flex items-center justify-center gap-4 mx-auto hover:tracking-[0.8em] transition-all group">
          Expand Global High Council <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
        </button>
        <div className="absolute left-[-40px] top-[-40px] w-64 h-64 bg-emerald-600/10 rounded-full blur-[80px]"></div>
      </div>
    </div>
  );
};
