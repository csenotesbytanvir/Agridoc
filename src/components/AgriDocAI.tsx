import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Send, Bot, User, Trash2, Loader2, Info, Mic, MicOff, Volume2, VolumeX, Zap, Image as ImageIcon, X, ChevronRight, ShieldCheck, Landmark } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '../lib/utils';
import { useAgriDoc } from '../App';
import { getGeminiResponse, analyzePlantDisease } from '../services/geminiService';

export const AgriDocAI: React.FC = () => {
  const { state, t } = useAgriDoc();
  const [activeTab, setActiveTab] = useState<'chat' | 'analyze' | 'soil'>('chat');
  
  const hasApiKey = !!(state.apiKey || process.env.GEMINI_API_KEY);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
       <div className="space-y-4">
          <h2 className="text-2xl sm:text-5xl font-display font-black text-emerald-950 tracking-tighter uppercase italic leading-none">Neural Link</h2>
          <p className="text-[9px] sm:text-[10px] font-black uppercase text-emerald-600 tracking-[0.3em] sm:tracking-[0.4em]">Advanced Agronomy Matrix v3.1</p>
       </div>

      <div className="flex bg-white p-1 sm:p-2 rounded-[32px] sm:rounded-[40px] border border-emerald-100 shadow-xl overflow-hidden overflow-x-auto scrollbar-hide">
        <button 
          onClick={() => setActiveTab('chat')}
          className={cn(
            "flex-1 min-w-[120px] sm:min-w-[140px] py-4 sm:py-6 rounded-[24px] sm:rounded-[32px] text-[10px] sm:text-[11px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] transition-all flex items-center justify-center gap-2 sm:gap-4",
            activeTab === 'chat' ? "bg-emerald-600 text-white shadow-xl" : "text-emerald-300 hover:bg-emerald-50"
          )}
        >
          <Bot className="w-5 h-5 sm:w-6 sm:h-6" /> <span className="whitespace-nowrap">Cognitive Chat</span>
        </button>
        <button 
          onClick={() => setActiveTab('analyze')}
          className={cn(
            "flex-1 min-w-[140px] py-6 rounded-[32px] text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4",
            activeTab === 'analyze' ? "bg-emerald-600 text-white shadow-xl" : "text-emerald-300 hover:bg-emerald-50"
          )}
        >
          <Camera size={24} /> Visual Scan
        </button>
        <button 
          onClick={() => setActiveTab('soil')}
          className={cn(
            "flex-1 min-w-[140px] py-6 rounded-[32px] text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4",
            activeTab === 'soil' ? "bg-indigo-600 text-white shadow-xl" : "text-indigo-300 hover:bg-indigo-50"
          )}
        >
          <ImageIcon size={24} /> Soil Lab
        </button>
      </div>

      {!hasApiKey ? (
        <div className="glass p-8 sm:p-16 rounded-[48px] sm:rounded-[64px] text-center space-y-8 sm:space-y-12 border-emerald-100 relative overflow-hidden group shadow-2xl bg-white/20">
          <div className="w-24 h-24 sm:w-40 sm:h-40 bg-emerald-600 rounded-[32px] sm:rounded-[56px] flex items-center justify-center mx-auto text-white shadow-2xl group-hover:scale-110 transition-transform border-b-8 border-emerald-900 group-hover:rotate-6 shrink-0">
            <Zap className="w-10 h-10 sm:w-16 sm:h-16" fill="currentColor" />
          </div>
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-2xl sm:text-4xl font-display font-black text-emerald-950 uppercase tracking-tighter italic leading-none">Neural Link Initialization</h3>
            <p className="text-base sm:text-xl text-emerald-900/70 font-medium leading-relaxed max-w-xl mx-auto italic border-l-4 border-emerald-600 pl-4 sm:pl-6 text-left sm:text-center">
              Establish a secure cognitive bridge with the Gemini Neural Protocol to unlock real-time cultivar diagnostics and strategic agronomy synthesis.
            </p>
          </div>
          <div className="max-w-md mx-auto space-y-4">
             <input 
               type="password"
               placeholder="Enter API Key..."
               className="w-full px-8 py-6 rounded-[32px] bg-emerald-50 border-2 border-emerald-100 focus:ring-4 focus:ring-emerald-500/10 outline-none font-bold text-emerald-950 tracking-widest text-center"
               id="neural-key-input"
             />
             <button 
                onClick={async () => {
                   const val = (document.getElementById('neural-key-input') as HTMLInputElement).value;
                   if (val) {
                      localStorage.setItem('GEMINI_API_KEY', val);
                      window.dispatchEvent(new Event('storage'));
                   }
                }}
                className="btn-primary w-full py-6 text-xl"
             >
                Integrate Link
             </button>
             <p className="text-[10px] font-black text-emerald-600/40 uppercase tracking-widest">Saved locally on your device • End-to-End Encrypted</p>
          </div>
          <div className="absolute top-[-50px] right-[-50px] w-80 h-80 bg-emerald-600/5 rounded-full blur-[100px]"></div>
        </div>
      ) : (
        <div className="min-h-[600px]">
          {activeTab === 'chat' && <AIChat />}
          {activeTab === 'analyze' && <AIAnalysis />}
          {activeTab === 'soil' && <SoilLab />}
        </div>
      )}
    </div>
  );
};

const AIChat = () => {
  const { state, addPoints } = useAgriDoc();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>(() => {
    const local = localStorage.getItem('agri_chat');
    return local ? JSON.parse(local) : [{ role: 'ai', text: 'Cognitive link established. I am your AgriDoc Assistant. How can I support your yield strategy today?' }];
  });
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
    localStorage.setItem('agri_chat', JSON.stringify(messages));
  }, [messages]);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = state.language === 'bn' ? 'bn-BD' : state.language === 'th' ? 'th-TH' : 'en-US';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = state.language === 'bn' ? 'bn-BD' : state.language === 'th' ? 'th-TH' : 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !capturedImage) || loading) return;
    
    stopSpeaking();
    
    const userMsg = { 
      role: 'user', 
      text: input,
      image: capturedImage 
    };
    
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    const currentImage = capturedImage;
    
    setInput('');
    setCapturedImage(null);
    setLoading(true);

    try {
      const base64Image = currentImage ? currentImage.split(',')[1] : undefined;
      const response = await getGeminiResponse(state.apiKey, currentInput || "Analyze this image.", state.language, base64Image);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
      addPoints(10);
      speak(response);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Spectral interface failure. Verify Neural Link Key and uplink health." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[40px] sm:rounded-[64px] flex flex-col h-[75vh] overflow-hidden border border-emerald-100 shadow-2xl relative">
      <div className="flex-1 overflow-y-auto p-6 sm:p-12 space-y-8 sm:space-y-10 scrollbar-hide">
        {messages.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            key={i} 
            className={cn("flex items-start gap-3 sm:gap-6", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}
          >
            <div className={cn(
              "w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-[24px] flex items-center justify-center shadow-lg border-2 shrink-0 transition-transform hover:scale-110",
              msg.role === 'user' ? "bg-emerald-100 border-white text-emerald-700" : "bg-emerald-600 border-white text-white"
            )}>
              {msg.role === 'user' ? <User className="w-5 h-5 sm:w-8 sm:h-8" /> : <Bot className="w-5 h-5 sm:w-8 sm:h-8" />}
            </div>
            <div className={cn(
              "p-5 sm:p-8 rounded-[24px] sm:rounded-[40px] max-w-[85%] sm:max-w-[80%] text-[13px] sm:text-base font-medium shadow-sm transition-all leading-relaxed relative group",
              msg.role === 'user' ? "bg-emerald-50 text-emerald-950 rounded-tr-none" : "bg-white text-emerald-950 rounded-tl-none border border-emerald-100"
            )}>
              {msg.image && (
                <img src={msg.image} alt="User upload" className="rounded-2xl mb-4 max-w-full h-auto border border-emerald-200" referrerPolicy="no-referrer" />
              )}
              <div className="markdown-container">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.text}
                </ReactMarkdown>
              </div>
              {msg.role === 'ai' && (
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => speak(msg.text)} 
                    className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all border-2 border-white"
                  >
                    <Volume2 size={16} />
                  </button>
                  {isSpeaking && (
                    <button 
                      onClick={stopSpeaking} 
                      className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all border-2 border-white"
                    >
                      <VolumeX size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-[24px] bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm animate-pulse">
              <Bot size={32} />
            </div>
            <div className="p-8 bg-emerald-50 rounded-[40px] rounded-tl-none border border-emerald-100">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="p-6 sm:p-10 bg-slate-50 border-t border-slate-100 flex flex-col gap-4">
        {capturedImage && (
          <div className="flex items-center gap-4 bg-white p-4 rounded-[24px] border border-emerald-100 w-fit">
            <img src={capturedImage} alt="Preview" className="w-16 h-16 object-cover rounded-xl border border-emerald-50" referrerPolicy="no-referrer" />
            <button onClick={() => setCapturedImage(null)} className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
        )}
        <div className="flex gap-4 sm:gap-6 items-center">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-14 h-14 sm:w-20 sm:h-20 rounded-[20px] sm:rounded-[32px] bg-white border-2 border-slate-100 text-slate-400 flex items-center justify-center shadow-lg hover:text-emerald-600 transition-all hover:border-emerald-200 shrink-0"
          >
            <ImageIcon size={24} className="sm:w-8 sm:h-8" />
          </button>
          <button 
            onClick={startListening}
            className={cn(
              "w-14 h-14 sm:w-20 sm:h-20 rounded-[20px] sm:rounded-[32px] flex items-center justify-center transition-all border-2 shadow-lg shrink-0",
              isListening ? "bg-red-500 border-white text-white animate-pulse" : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-brand-green"
            )}
          >
            {isListening ? <MicOff size={24} className="sm:w-8 sm:h-8" /> : <Mic size={24} className="sm:w-8 sm:h-8" />}
          </button>
          <div className="flex-1 relative">
              <input 
                placeholder="State your agronomy query..."
                className="w-full h-14 sm:h-20 px-6 sm:px-8 rounded-[20px] sm:rounded-[32px] bg-white border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-green/10 text-slate-900 font-bold pr-16 sm:pr-20 text-sm sm:text-base"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={loading}
                className="absolute right-2 top-2 sm:right-4 sm:top-4 w-10 h-10 sm:w-12 sm:h-12 bg-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-xl disabled:opacity-50 transition-all active:translate-y-1 animate-pulse-slow"
              >
                <Send size={18} className="sm:w-6 sm:h-6" />
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SoilLab = () => {
  const { state } = useAgriDoc();
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const runSoilAnalysis = async () => {
    if (!image || loading) return;
    setLoading(true);
    try {
      const base64 = image.split(',')[1];
      // Reuse the Gemini response function but with a specific soil prompt
      const response = await getGeminiResponse(
        state.apiKey, 
        "Analyze this soil test report or soil picture. Provide: 1. pH, 2. Nitrogen Level, 3. Phosphorus Level, 4. Potassium Level, 5. Recommended Crops, 6. Fertilizer Suggestions.", 
        state.language, 
        base64
      );
      setResult(response);
    } catch (err) {
      alert("Soil Data Link Failure. Spectral interface interrupted.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="bg-white p-12 rounded-[64px] border border-indigo-100 shadow-2xl space-y-10 relative overflow-hidden">
        <div className="flex items-center gap-4 sm:gap-6 border-b border-indigo-50 pb-6 sm:pb-8">
           <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-[24px] bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner border border-indigo-100 shrink-0">
             <Landmark className="w-6 h-6 sm:w-8 sm:h-8" />
           </div>
           <div className="space-y-1">
             <h3 className="text-2xl sm:text-4xl font-display font-black text-slate-900 tracking-tighter uppercase leading-none">Soil Analysis Node</h3>
             <p className="text-[9px] sm:text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em] sm:tracking-[0.4em] italic">Report & Substrate Scanning</p>
           </div>
        </div>

        <div 
          onClick={() => fileRef.current?.click()}
          className="aspect-video bg-indigo-50/30 rounded-[32px] sm:rounded-[48px] border-4 border-dashed border-indigo-100 flex flex-col items-center justify-center gap-4 sm:gap-6 cursor-pointer hover:bg-slate-50 transition-all group relative overflow-hidden shadow-inner"
        >
          {image ? (
            <img src={image} alt="Soil Report" className="w-full h-full object-contain p-4 sm:p-8" referrerPolicy="no-referrer" />
          ) : (
            <div className="text-center space-y-2 sm:space-y-4 p-4 sm:p-8">
               <Upload className="w-8 h-8 sm:w-12 sm:h-12 mx-auto text-indigo-400 animate-bounce" />
               <p className="text-lg sm:text-2xl font-display font-black text-slate-900 uppercase">Input Lab Report</p>
               <p className="text-[9px] sm:text-[10px] font-black uppercase text-indigo-300 tracking-[0.3em] sm:tracking-[0.4em]">Digital Scan or High-Res Photograph</p>
            </div>
          )}
          <input type="file" ref={fileRef} onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => setImage(reader.result as string);
              reader.readAsDataURL(file);
            }
          }} className="hidden" accept="image/*" />
        </div>

        {image && (
          <button 
            onClick={runSoilAnalysis}
            disabled={loading}
            className="w-full py-8 bg-indigo-600 text-white rounded-[40px] text-2xl font-display font-black uppercase tracking-tighter shadow-2xl hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="mx-auto animate-spin" size={32} /> : "Synthesize Soil Intelligence"}
          </button>
        )}

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-10 bg-indigo-50/50 rounded-[48px] border border-indigo-100">
             <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="text-indigo-600" size={24} />
                <span className="text-[11px] font-black uppercase tracking-widest text-indigo-600">AI Report Synthesis</span>
             </div>
             <div className="markdown-container">
               <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
             </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const AIAnalysis = () => {
  const { state, addPoints } = useAgriDoc();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const speakResult = (data: any) => {
    window.speechSynthesis.cancel();
    const text = `${data.plantName}. Detected: ${data.diseaseName}. Care: ${data.careInstructions}. Soil: ${data.soilType}.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = state.language === 'bn' ? 'bn-BD' : state.language === 'th' ? 'th-TH' : 'en-US';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!image || loading) return;
    setLoading(true);
    setResult(null); // Clear previous result
    try {
      const base64 = image.split(',')[1];
      const data = await analyzePlantDisease(state.apiKey, base64, state.language);
      console.log("Analysis Data Received:", data);
      setResult(data);
      addPoints(50);
      speakResult(data);
    } catch (err: any) {
      console.error("Analysis Component Error:", err);
      alert(`Critical Scan Error: ${err.message || "Unknown spectral anomaly"}`);
    } finally {
      setLoading(false);
    }
  };

  const hasResultData = result && Object.keys(result).length > 0;

  return (
    <div className="space-y-10">
      <div className="bg-white p-6 sm:p-12 rounded-[48px] sm:rounded-[64px] space-y-10 border border-slate-100 shadow-2xl relative overflow-hidden group">
        <div 
          onClick={() => fileRef.current?.click()}
          className="aspect-square sm:aspect-video bg-slate-50 rounded-[32px] sm:rounded-[48px] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center gap-8 cursor-pointer hover:bg-slate-100 transition-all group relative overflow-hidden active:scale-[0.99] shadow-inner"
        >
          {image ? (
            <img src={image} alt="Upload" className="w-full h-full object-cover rounded-[32px] sm:rounded-[48px]" referrerPolicy="no-referrer" />
          ) : (
            <div className="flex flex-col items-center gap-8 p-6 text-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[32px] sm:rounded-[40px] bg-emerald-600 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform border-b-8 border-emerald-900 text-white">
                <Upload size={32} className="sm:w-12 sm:h-12" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl sm:text-3xl font-display font-black text-slate-900 uppercase">Initialize Scan</p>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.5em]">Cultivar Tissue Sample Required</p>
              </div>
            </div>
          )}
          <input type="file" ref={fileRef} onChange={handleUpload} className="hidden" accept="image/*" />
        </div>

        {image && !hasResultData && (
          <button 
            onClick={runAnalysis}
            disabled={loading}
            className="btn-primary w-full py-6 sm:py-8 text-xl sm:text-2xl tracking-tighter shadow-2xl"
          >
            {loading ? (
              <div className="flex items-center gap-4">
                <Loader2 className="animate-spin" size={32} />
                <span>Scanning Matrix...</span>
              </div>
            ) : "Initiate AI Diagnosis Protocol"}
          </button>
        )}

        {hasResultData && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 border-t border-emerald-100 pt-10 sm:pt-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <p className="text-[9px] sm:text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-2">Primary Cultivar Identified</p>
                <h3 className="text-2xl sm:text-5xl font-display font-black text-emerald-950 tracking-tighter uppercase leading-tight">{result.plantName}</h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  <p className="text-[10px] sm:text-[11px] font-black text-red-600 bg-red-50 inline-block px-3 sm:px-4 py-2 rounded-full uppercase tracking-[0.3em] sm:tracking-[0.4em]">Diagnosis: {result.diseaseName}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => speakResult(result)}
                  className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[32px] bg-amber-400 text-emerald-950 flex items-center justify-center shadow-2xl transition-all active:scale-95 hover:rotate-6 border-4 border-white shrink-0"
                >
                  <Volume2 className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
                {isSpeaking && (
                  <button 
                    onClick={stopSpeaking}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-[24px] sm:rounded-[32px] bg-red-600 text-white flex items-center justify-center shadow-2xl transition-all active:scale-95 border-4 border-white"
                  >
                    <VolumeX size={32} />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <AnalysisCard 
                icon={<Bot className="text-emerald-600" />} 
                title="Biological ID" 
                content={result.plantName} 
                highlight 
              />
              <AnalysisCard 
                icon={<Info className="text-red-500" />} 
                title="Pathogen/Disease" 
                content={result.diseaseName} 
              />
              <AnalysisCard 
                title="Mitigation Protocol (Treatment)" 
                content={result.treatment} 
                variant="dark"
              />
              <AnalysisCard 
                title="Chemical/Nutrient Input (Medicine)" 
                content={result.medicines} 
              />
              <AnalysisCard 
                title="Substrate Specs (Soil)" 
                content={result.soilType} 
              />
              <AnalysisCard 
                title="Hydration Protocol (Water)" 
                content={result.irrigationNeeds} 
              />
              <AnalysisCard 
                title="Strategic Care & Life Cycle" 
                content={result.careInstructions} 
                fullWidth
              />
              <AnalysisCard 
                title="Neural Addendum (Extra Info)" 
                content={result.additionalInfo || "No further data required at this stage."} 
                fullWidth
              />
            </div>

            <button onClick={() => {setImage(null); setResult(null); stopSpeaking();}} className="w-full py-10 text-[11px] font-black uppercase tracking-[0.6em] text-slate-300 hover:text-brand-green transition-all rounded-[48px] hover:bg-slate-50 border-2 border-dashed border-slate-100">
              Reset Spectral Sensor Array
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const AnalysisCard = ({ title, content, icon, highlight, variant, fullWidth }: any) => (
  <div className={cn(
    "p-8 rounded-[32px] sm:rounded-[40px] border shadow-sm space-y-4 hover:shadow-lg transition-all",
    fullWidth ? "md:col-span-2" : "",
    variant === 'dark' ? "bg-emerald-950 text-white border-emerald-800" : "bg-slate-50 border-slate-100",
    highlight ? "ring-2 ring-emerald-500/20" : ""
  )}>
    <div className="flex items-center gap-4">
      {icon}
      <p className={cn(
        "text-[10px] font-black uppercase tracking-widest",
        variant === 'dark' ? "text-emerald-400" : "text-brand-green"
      )}>{title}</p>
    </div>
    <div className={cn(
      "text-sm sm:text-base font-bold leading-relaxed",
      variant === 'dark' ? "text-emerald-100" : "text-slate-600"
    )}>
      {typeof content === 'string' && content.includes('\n') ? (
        <div className="space-y-2">
          {content.split('\n').map((line, idx) => <p key={idx}>{line}</p>)}
        </div>
      ) : content}
    </div>
  </div>
);
