import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Shield, 
  Globe, 
  LogOut, 
  Bell, 
  Camera, 
  ChevronRight, 
  Database, 
  AlertTriangle,
  Zap,
  Phone,
  Key,
  Check,
  AlertCircle,
  Save,
  Cloud,
  TreeDeciduous
} from 'lucide-react';
import { useAgriDoc } from '../App';
import { cn } from '../lib/utils';
import { validateApiKey } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';

export const ProfileSettings: React.FC = () => {
  const { state, setLanguage, addPoints, setIsOnline } = useAgriDoc();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: localStorage.getItem('agri_profile_name') || 'Tanvir Ahmmed',
    farmName: localStorage.getItem('agri_profile_farm') || 'Green Valley Estates',
    location: localStorage.getItem('agri_profile_loc') || 'Dhaka, Bangladesh',
    primaryCrop: localStorage.getItem('agri_profile_crop') || 'Rice & Jute',
    farmSize: localStorage.getItem('agri_profile_size') || '5.5 Acres',
    avatar: localStorage.getItem('agri_profile_avatar') || `https://api.dicebear.com/7.x/avataaars/svg?seed=${localStorage.getItem('agri_profile_name') || 'Tanvir Ahmmed'}`
  });

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [apiKey, setApiKey] = useState(state.apiKey);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const saveProfile = () => {
    localStorage.setItem('agri_profile_name', profile.name);
    localStorage.setItem('agri_profile_farm', profile.farmName);
    localStorage.setItem('agri_profile_loc', profile.location);
    localStorage.setItem('agri_profile_crop', profile.primaryCrop);
    localStorage.setItem('agri_profile_size', profile.farmSize);
    localStorage.setItem('agri_profile_avatar', profile.avatar);
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result as string });
        localStorage.setItem('agri_profile_avatar', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveKey = async () => {
    setStatus('loading');
    const isValid = await validateApiKey(apiKey);
    if (isValid) {
      localStorage.setItem('GEMINI_API_KEY', apiKey);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } else {
      setStatus('error');
    }
  };

  const clearData = () => {
    localStorage.clear();
    location.reload();
  };

  const [showToast, setShowToast] = useState(false);

  const triggerAlert = () => {
    setShowToast(true);
    addPoints(50);
    setShowEmergencyModal(false);
    setTimeout(() => setShowToast(false), 5000);
  };

  return (
    <div className="space-y-10 pb-32 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleAvatarChange} 
      />
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-10 left-1/2 -translate-x-1/2 z-[500] w-full max-w-xl px-6"
          >
            <div className="bg-red-600 text-white p-8 rounded-[32px] shadow-2xl border-4 border-white flex items-center gap-6">
              <div className="bg-white/20 p-3 rounded-2xl">
                <AlertTriangle size={32} />
              </div>
              <div className="flex-1">
                <p className="font-display font-black uppercase tracking-tighter text-2xl leading-tight italic">Protocol Activated</p>
                <p className="text-[11px] font-black uppercase tracking-widest text-red-100 italic">Simulated SMS notifications sent to local cluster and authorities.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <h2 className="text-5xl font-display font-black text-emerald-950 tracking-tighter uppercase italic leading-none">Farmer Identity</h2>
          <p className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.4em]">Biometric Identity & Config</p>
        </div>
        <div className="bg-emerald-700 p-4 rounded-[24px] shadow-xl border-4 border-white transition-transform hover:rotate-12">
          <Shield className="text-white" size={32} />
        </div>
      </div>

      {/* Editable Profile Header */}
      <div className="bg-white p-12 rounded-[64px] border border-emerald-100 relative overflow-hidden group shadow-2xl transition-all hover:shadow-emerald-100/50">
        <div className="flex flex-col xl:flex-row items-center gap-12 relative z-10">
          <div className="relative">
            <div className="w-40 h-40 rounded-full border-4 border-emerald-50 p-2 bg-emerald-50 shadow-inner group-hover:scale-105 transition-transform">
              <img 
                src={profile.avatar} 
                className="w-full h-full rounded-full bg-white shadow-xl object-cover" 
                alt="Avatar"
                referrerPolicy="no-referrer"
              />
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white shadow-xl hover:scale-110 transition-transform"
            >
              <Camera size={24} className="text-white" />
            </button>
          </div>
          
          <div className="flex-1 text-center xl:text-left space-y-6">
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-1 text-left">
                    <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest ml-6 italic">Full Identity</p>
                    <input 
                      className="w-full bg-emerald-50 border border-emerald-100 py-4 px-6 h-16 rounded-[24px] font-bold text-emerald-950 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all" 
                      value={profile.name} 
                      onChange={e => setProfile({...profile, name: e.target.value})}
                      placeholder="Your Name"
                    />
                 </div>
                 <div className="space-y-1 text-left">
                    <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest ml-6 italic">Farm Designation</p>
                    <input 
                      className="w-full bg-emerald-50 border border-emerald-100 py-4 px-6 h-16 rounded-[24px] font-bold text-emerald-950 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all" 
                      value={profile.farmName} 
                      onChange={e => setProfile({...profile, farmName: e.target.value})}
                      placeholder="Farm Name"
                    />
                 </div>
                 <div className="space-y-1 text-left">
                    <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest ml-6 italic">Geospatial Active Node</p>
                    <input 
                      className="w-full bg-emerald-50 border border-emerald-100 py-4 px-6 h-16 rounded-[24px] font-bold text-emerald-950 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all" 
                      value={profile.location} 
                      onChange={e => setProfile({...profile, location: e.target.value})}
                      placeholder="Location"
                    />
                 </div>
                 <div className="space-y-1 text-left">
                    <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest ml-6 italic">Cultivar Focus</p>
                    <input 
                      className="w-full bg-emerald-50 border border-emerald-100 py-4 px-6 h-16 rounded-[24px] font-bold text-emerald-950 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all" 
                      value={profile.primaryCrop} 
                      onChange={e => setProfile({...profile, primaryCrop: e.target.value})}
                      placeholder="Primary Crops"
                    />
                 </div>
              </div>
            ) : (
              <div>
                <h3 className="text-5xl sm:text-7xl font-display font-black text-emerald-950 tracking-tighter uppercase leading-none mb-3 italic">{profile.name}</h3>
                <p className="text-emerald-700 text-2xl font-black uppercase tracking-[0.4em] italic">{profile.farmName}</p>
                <div className="inline-flex items-center gap-6 mt-8 bg-emerald-50 px-8 py-3 rounded-full border border-emerald-100 shadow-sm">
                    <Zap className="text-emerald-600 fill-emerald-600 animate-pulse" size={20} />
                    <span className="text-[11px] text-emerald-700 font-black uppercase tracking-[0.3em] leading-none">Level {state.level} • AgriChampion Matrix</span>
                </div>
                <div className="flex items-center justify-center xl:justify-start gap-3 mt-6">
                  {[1,2,3,4,5].map(star => (
                    <Zap key={star} size={20} className={cn("transition-transform hover:scale-125", star <= 4 ? "text-emerald-600 fill-emerald-600" : "text-emerald-100")} />
                  ))}
                  <span className="text-[11px] font-black text-emerald-700 uppercase tracking-widest ml-4 italic">4.8 Field Rating</span>
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-6 pt-6 justify-center xl:justify-start">
               {isEditing ? (
                  <button onClick={saveProfile} className="bg-emerald-600 text-white px-12 h-16 rounded-[32px] text-[11px] font-black uppercase tracking-widest shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:scale-105 active:translate-y-1 transition-all border-b-4 border-emerald-900 flex items-center gap-4">
                    <Save size={24} /> Save Identity
                  </button>
               ) : (
                  <button onClick={() => setIsEditing(true)} className="bg-emerald-950 hover:bg-black text-white px-12 h-16 rounded-[32px] font-black text-[11px] uppercase tracking-widest flex items-center gap-4 border-b-4 border-emerald-800 transition-all shadow-xl active:translate-y-1">
                     <Settings size={22} className="animate-spin-slow" /> Update Field Bio
                   </button>
               )}
            </div>
          </div>
        </div>

        {/* Global Success Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 bg-gradient-to-br from-emerald-950 to-emerald-900 p-12 rounded-[64px] border-b-8 border-emerald-950 shadow-[0_30px_60px_rgba(0,0,0,0.3)] relative overflow-hidden group">
           <SuccessMetric label="Harvest Success" value="92%" color="text-emerald-400" />
           <SuccessMetric label="Community Impact" value="High" color="text-amber-400" />
           <SuccessMetric label="Carbon Credits" value="4.2k" color="text-emerald-300" />
           <div className="absolute right-[-40px] bottom-[-40px] opacity-10 pointer-events-none group-hover:scale-150 group-hover:rotate-12 transition-all duration-[2000ms]">
              <TreeDeciduous size={280} className="text-white" />
           </div>
           <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
        </div>

        {/* Extended Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16 pt-16 border-t border-emerald-100 relative z-10">
           <ProfileStat label="Yield Points" value={state.points} />
           <ProfileStat label="Eco Trees" value={state.unplantedTrees} />
           <ProfileStat label="Cultivars" value={profile.primaryCrop} isEditable={isEditing} valueKey="primaryCrop" profile={profile} setProfile={setProfile} />
           <ProfileStat label="Acreage" value={profile.farmSize} isEditable={isEditing} valueKey="farmSize" profile={profile} setProfile={setProfile} />
        </div>
        
        <div className="absolute right-[-100px] top-[-100px] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      {/* Categorized Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="space-y-8">
            <p className="text-[11px] font-black uppercase text-emerald-400 tracking-[0.4em] ml-10 italic">Classified: Crisis Protocol</p>
            <div className="bg-red-50 p-12 rounded-[64px] border border-red-100 space-y-10 group hover:bg-red-100 transition-all cursor-pointer shadow-xl border-b-8 border-b-red-200" onClick={() => setShowEmergencyModal(true)}>
                <div className="flex items-center gap-8">
                    <div className="w-24 h-24 bg-red-600 rounded-[40px] shadow-2xl animate-pulse flex items-center justify-center border-4 border-white text-white">
                        <AlertTriangle size={40} />
                    </div>
                    <div>
                        <h4 className="text-4xl font-display font-black text-emerald-950 uppercase tracking-tighter leading-none">Emergency Hub</h4>
                        <p className="text-[11px] text-red-600 uppercase font-black tracking-widest mt-2 italic leading-none">Global Alert Sync active</p>
                    </div>
                </div>
                <p className="text-lg font-bold text-red-900/60 uppercase tracking-tight leading-relaxed italic">Instantly broadcast pest warnings or climate anomalies to your local cluster and government agents.</p>
                <div className="flex items-center gap-6 text-red-600 font-black text-[11px] uppercase tracking-[0.5em] group-hover:gap-10 transition-all">
                    <span>Protocol: High Alert</span>
                    <ChevronRight size={20} />
                </div>
            </div>
        </section>

        <section className="space-y-8">
            <p className="text-[11px] font-black uppercase text-emerald-400 tracking-[0.4em] ml-10 italic">Classified: Performance Matrix</p>
            <div className="bg-white p-12 rounded-[64px] border border-emerald-100 shadow-xl space-y-10 flex flex-col justify-between border-b-8 border-b-emerald-100 h-full">
                <div className="flex items-center gap-8">
                    <div className="w-24 h-24 bg-emerald-50 rounded-[40px] border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner group-hover:scale-110 transition-transform">
                        <Database size={40} />
                    </div>
                    <div>
                        <h4 className="text-4xl font-display font-black text-emerald-950 uppercase tracking-tighter leading-none">Sync Health</h4>
                        <p className="text-[11px] text-emerald-600 uppercase font-black tracking-widest mt-2 italic leading-none">85.4% Edge Repository Integrity</p>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="w-full bg-emerald-50 h-5 rounded-full overflow-hidden border border-emerald-100 p-1">
                        <div className="bg-emerald-500 h-full w-[85%] rounded-full shadow-[0_0_15px_#10b981]"></div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-black uppercase text-emerald-400 tracking-widest italic">
                        <span>Local Cache: 14.8 MB</span>
                        <span className="text-emerald-600">Next Uplink: Verified</span>
                    </div>
                </div>
            </div>
        </section>
      </div>

      <div className="space-y-10">
        {/* Neural Link Integration */}
        <section className="space-y-8">
            <p className="text-[11px] font-black uppercase text-emerald-400 tracking-[0.4em] ml-10 italic">Classified: Neural Core Access</p>
            <div className="bg-white p-12 rounded-[64px] border border-emerald-100 shadow-2xl space-y-12 relative overflow-hidden group border-b-8 border-b-emerald-100">
                <div className="flex items-center gap-8 text-emerald-950 relative z-10">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-600 rounded-[32px] flex items-center justify-center shadow-xl border-4 border-white text-white transition-transform hover:rotate-12">
                        <Key size={32} className="sm:w-10 sm:h-10" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-2xl sm:text-4xl font-display font-black tracking-tighter uppercase leading-none italic truncate">Neural Uplink Key</h4>
                        <p className="text-[10px] sm:text-[11px] text-emerald-600 uppercase font-black tracking-widest mt-2 italic leading-none truncate overflow-hidden">Cross-Matrix Synchronization v3.5</p>
                    </div>
                </div>
                
                <p className="text-lg sm:text-xl text-emerald-900/60 font-medium leading-relaxed max-w-xl relative z-10 italic">
                    Bridge your local field data with the Gemini global neural network for real-time diagnostic synthesis.
                </p>

                <div className="relative z-10">
                    <input 
                        type="password"
                        placeholder="Enter API Key..."
                        className={cn(
                            "w-full h-20 bg-emerald-50 border border-emerald-100 px-10 rounded-[32px] font-bold text-emerald-950 outline-none focus:ring-8 focus:ring-emerald-500/10 pr-24 transition-all text-lg",
                            status === 'error' ? "ring-4 ring-red-500" : ""
                        )}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                    />
                    <div className="absolute right-8 top-1/2 -translate-y-1/2">
                        {status === 'success' && <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg animate-in zoom-in"><Check size={24} /></div>}
                        {status === 'error' && <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg animate-in shake"><AlertCircle size={24} /></div>}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-8 relative z-10">
                    <button 
                        onClick={handleSaveKey}
                        disabled={status === 'loading'}
                        className="bg-emerald-600 text-white flex-1 h-20 rounded-[32px] text-2xl font-display font-black tracking-tighter uppercase shadow-[0_20px_40px_rgba(16,185,129,0.3)] disabled:opacity-50 hover:scale-[1.02] active:translate-y-1 transition-all border-b-8 border-emerald-950"
                    >
                        {status === 'loading' ? 'Bridging Matrix...' : 'Establish Neural Link'}
                    </button>
                    <div className="bg-emerald-50 px-10 h-20 rounded-[32px] border border-emerald-100 flex items-center gap-6 text-emerald-400">
                        <Shield size={28} />
                        <span className="text-[11px] font-black uppercase tracking-widest leading-tight italic">TLS 1.3 Encryption Active</span>
                    </div>
                </div>
                <div className="absolute right-[-120px] bottom-[-120px] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none"></div>
            </div>
        </section>

        {/* System Operations */}
        <section className="space-y-8">
            <p className="text-[11px] font-black uppercase text-emerald-400 tracking-[0.4em] ml-10 italic">Classified: Global Matrix Prefs</p>
            <div className="bg-white rounded-[64px] overflow-hidden divide-y divide-emerald-50 border border-emerald-100 shadow-2xl border-b-8 border-b-emerald-100">
                <SettingsItem 
                    icon={<Globe className="text-blue-500" />} 
                    title="Interface Lexicon" 
                    sub="Global Matrix Language Support"
                    action={
                        <select 
                            value={state.language}
                            onChange={(e) => setLanguage(e.target.value as any)}
                            className="bg-emerald-50 px-8 h-12 rounded-full text-emerald-950 font-black text-[11px] uppercase tracking-widest outline-none border border-emerald-200 focus:ring-4 focus:ring-emerald-500/10 appearance-none text-center min-w-[140px] cursor-pointer"
                        >
                            <option value="en">English (US)</option>
                            <option value="bn">Bengali (BN)</option>
                            <option value="th">Thai (TH)</option>
                        </select>
                    }
                />
                <SettingsItem 
                    icon={<Cloud className="text-emerald-600" />} 
                    title="Ecosystem Sync" 
                    sub="Real-time Uplink Node Status"
                    action={
                        <button 
                            onClick={() => setIsOnline(!state.isOnline)}
                            className={cn(
                                "w-24 h-12 rounded-full relative transition-all duration-500 border-4",
                                state.isOnline ? "bg-emerald-600 border-emerald-700" : "bg-emerald-50 border-emerald-100"
                            )}
                        >
                           <motion.div 
                             animate={{ x: state.isOnline ? 56 : 6 }}
                             className={cn(
                               "absolute top-1 w-7 h-7 rounded-full shadow-2xl transition-colors",
                               state.isOnline ? "bg-white" : "bg-emerald-200"
                             )} 
                           />
                        </button>
                    }
                />
            </div>
        </section>

        <button 
            onClick={() => setShowClearConfirm(true)}
            className="w-full py-12 flex items-center justify-center gap-8 text-emerald-200 font-black uppercase tracking-[0.6em] text-[12px] hover:text-red-500 transition-all rounded-[64px] hover:bg-red-50 border-4 border-dashed border-emerald-50 hover:border-red-200 italic"
        >
            <LogOut size={28} /> Wipe Local Matrix Repository
        </button>
      </div>

      <AnimatePresence>
        {showClearConfirm && (
           <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowClearConfirm(false)} className="absolute inset-0 bg-emerald-950/80 backdrop-blur-2xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white p-14 rounded-[80px] max-w-md w-full relative z-10 text-center space-y-12 shadow-[0_40px_100px_rgba(0,0,0,0.3)] border border-emerald-100">
              <div className="w-28 h-28 bg-red-50 rounded-[40px] flex items-center justify-center mx-auto border-4 border-red-100 text-red-500 shadow-xl">
                <AlertTriangle size={56} className="animate-pulse" />
              </div>
              <div className="space-y-6">
                <h3 className="text-4xl sm:text-5xl font-display font-black text-emerald-950 uppercase tracking-tighter italic leading-none">Purge Data?</h3>
                <p className="text-xl text-emerald-900/40 font-bold leading-relaxed uppercase italic">This will permanently incinerate all local cultivar logs and settings. This operation is immutable.</p>
              </div>
              <div className="flex gap-6">
                <button onClick={() => setShowClearConfirm(false)} className="flex-1 py-6 text-[12px] font-black uppercase text-emerald-300 tracking-[0.3em] hover:text-emerald-950 transition-colors">Cancel</button>
                <button onClick={clearData} className="flex-1 h-20 bg-red-600 text-white rounded-[32px] text-[12px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-red-500/30 active:translate-y-1 border-b-8 border-red-900">Confirm Wipe</button>
              </div>
            </motion.div>
          </div>
        )}
        
        {showEmergencyModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEmergencyModal(false)} className="absolute inset-0 bg-emerald-950/80 backdrop-blur-2xl" />
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white p-14 rounded-[100px] max-w-2xl w-full relative z-10 space-y-12 shadow-[0_50px_120px_rgba(0,0,0,0.4)] border border-red-100">
              <div className="flex items-center gap-8 flex-col sm:flex-row text-center sm:text-left">
                <div className="w-24 h-24 bg-red-600 rounded-[40px] shadow-[0_0_40px_rgba(220,38,38,0.4)] flex items-center justify-center animate-pulse border-4 border-white text-white">
                   <AlertTriangle size={48} />
                </div>
                <div>
                   <h3 className="text-4xl sm:text-5xl font-display font-black text-emerald-950 uppercase tracking-tighter italic leading-none">Emergency Hub</h3>
                   <p className="text-[12px] font-black uppercase text-red-600 tracking-[0.5em] mt-3 italic leading-none">High-Alert Uplink active</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 <div className="bg-emerald-50 p-10 rounded-[48px] border border-emerald-100 flex flex-col items-center gap-6 group hover:bg-emerald-600 hover:text-white transition-all cursor-pointer border-b-8 border-b-emerald-100">
                    <div className="w-20 h-20 bg-white rounded-[32px] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all">
                        <Phone className="text-emerald-600" size={32} />
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-black text-emerald-950 group-hover:text-white tracking-tighter uppercase leading-none">Authorities</p>
                        <p className="text-[10px] text-emerald-400 group-hover:text-white/60 font-black uppercase tracking-widest mt-2 italic">Local Gov Sync</p>
                    </div>
                 </div>
                 <div className="bg-emerald-50 p-10 rounded-[48px] border border-emerald-100 flex flex-col items-center gap-6 group hover:bg-emerald-600 hover:text-white transition-all cursor-pointer border-b-8 border-b-emerald-100">
                    <div className="w-20 h-20 bg-white rounded-[32px] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-all">
                        <Zap className="text-blue-500" size={32} />
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-black text-emerald-950 group-hover:text-white tracking-tighter uppercase leading-none">Blast Alert</p>
                        <p className="text-[10px] text-emerald-400 group-hover:text-white/60 font-black uppercase tracking-widest mt-2 italic">500+ Nodes Sync</p>
                    </div>
                 </div>
              </div>

              <button 
                onClick={triggerAlert}
                className="bg-red-600 text-white w-full h-24 rounded-[48px] font-display font-black tracking-tighter text-4xl shadow-[0_25px_50px_rgba(220,38,38,0.3)] active:translate-y-2 hover:scale-[1.02] transition-all border-b-8 border-red-950 italic"
              >
                ACTIVATE PROTOCOL NOW
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProfileStat = ({ label, value, isEditable, valueKey, profile, setProfile }: any) => (
  <div className="bg-emerald-50/50 p-8 rounded-[48px] border border-emerald-50 space-y-3 hover:bg-white hover:shadow-2xl transition-all border-b-4 border-emerald-100 group">
    <p className="text-[10px] uppercase text-emerald-400 font-black tracking-[0.4em] ml-2 italic group-hover:tracking-[0.6em] transition-all">{label}</p>
    {isEditable && valueKey ? (
       <input 
          className="w-full bg-white border border-emerald-200 px-6 h-12 rounded-2xl text-md font-black text-emerald-950 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 italic"
          value={value}
          onChange={e => setProfile({...profile, [valueKey]: e.target.value})}
       />
    ) : (
       <p className="text-3xl font-display font-black text-emerald-950 tracking-tighter uppercase leading-none italic">{value}</p>
    )}
  </div>
);

const SettingsItem = ({ icon, title, sub, action }: any) => (
  <div className="p-10 flex items-center justify-between hover:bg-emerald-50 transition-all group border-l-[12px] border-transparent hover:border-emerald-500">
    <div className="flex items-center gap-8">
      <div className="w-16 h-16 rounded-[24px] bg-white flex items-center justify-center border-2 border-emerald-50 shadow-lg group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all group-hover:rotate-6">
        {React.cloneElement(icon as React.ReactElement<any>, { size: 28 })}
      </div>
      <div>
        <h4 className="font-black text-emerald-950 text-2xl uppercase tracking-tighter leading-none italic">{title}</h4>
        {sub && <p className="text-[11px] text-emerald-400 font-black uppercase tracking-widest mt-2 italic leading-none">{sub}</p>}
      </div>
    </div>
    {action || <ChevronRight className="text-emerald-100 group-hover:text-emerald-400 transition-colors" size={32} />}
  </div>
);

const SuccessMetric = ({ label, value, color }: any) => (
  <div className="relative z-10 text-center space-y-1">
    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">{label}</p>
    <p className={cn("text-5xl font-display font-black tracking-tighter", color)}>{value}</p>
  </div>
);
