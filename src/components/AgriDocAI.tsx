import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Send, Bot, User, Trash2, Loader2, Info, Mic, MicOff, Volume2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useAgriDoc } from '../App';
import { getGeminiResponse, analyzePlantDisease } from '../services/geminiService';

export const AgriDocAI: React.FC = () => {
  const { state, t } = useAgriDoc();
  const [activeTab, setActiveTab] = useState<'chat' | 'analyze'>('chat');
  
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
       <div className="space-y-4">
          <h2 className="text-4xl sm:text-5xl font-display font-black text-emerald-950 tracking-tighter uppercase italic leading-none">Neural Link</h2>
          <p className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.4em]">Advanced Agronomy Matrix v3.1</p>
       </div>

      <div className="flex bg-white p-2 rounded-[40px] border border-emerald-100 shadow-xl overflow-hidden">
        <button 
          onClick={() => setActiveTab('chat')}
          className={cn(
            "flex-1 py-6 rounded-[32px] text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4",
            activeTab === 'chat' ? "bg-emerald-600 text-white shadow-xl" : "text-emerald-300 hover:bg-emerald-50"
          )}
        >
          <Bot size={24} /> Cognitive Chat
        </button>
        <button 
          onClick={() => setActiveTab('analyze')}
          className={cn(
            "flex-1 py-6 rounded-[32px] text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4",
            activeTab === 'analyze' ? "bg-emerald-600 text-white shadow-xl" : "text-emerald-300 hover:bg-emerald-50"
          )}
        >
          <Camera size={24} /> Visual Scan
        </button>
      </div>

      {!state.apiKey ? (
        <div className="glass p-16 rounded-[64px] text-center space-y-12 border-emerald-100 relative overflow-hidden group shadow-2xl bg-white/20">
          <div className="w-40 h-40 bg-emerald-600 rounded-[56px] flex items-center justify-center mx-auto text-white shadow-2xl group-hover:scale-110 transition-transform border-b-8 border-emerald-900 group-hover:rotate-6">
            <Zap size={64} fill="currentColor" />
          </div>
          <div className="space-y-6">
            <h3 className="text-3xl sm:text-4xl font-display font-black text-emerald-950 uppercase tracking-tighter italic leading-none">Neural Link Initialization</h3>
            <p className="text-lg sm:text-xl text-emerald-900/70 font-medium leading-relaxed max-w-xl mx-auto italic border-l-4 border-emerald-600 pl-6">
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
          {activeTab === 'chat' ? <AIChat /> : <AIAnalysis />}
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
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
    localStorage.setItem('agri_chat', JSON.stringify(messages));
  }, [messages]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = state.language === 'bn' ? 'bn-BD' : state.language === 'th' ? 'th-TH' : 'en-US';
    window.speechSynthesis.speak(utterance);
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

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await getGeminiResponse(state.apiKey, input, state.language);
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
    <div className="bg-white rounded-[64px] flex flex-col h-[75vh] overflow-hidden border border-emerald-100 shadow-2xl relative">
      <div className="flex-1 overflow-y-auto p-12 space-y-10 scrollbar-hide">
        {messages.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            key={i} 
            className={cn("flex items-start gap-6", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}
          >
            <div className={cn(
              "w-16 h-16 rounded-[24px] flex items-center justify-center shadow-lg border-2 shrink-0 transition-transform hover:scale-110",
              msg.role === 'user' ? "bg-emerald-100 border-white text-emerald-700" : "bg-emerald-600 border-white text-white"
            )}>
              {msg.role === 'user' ? <User size={32} /> : <Bot size={32} />}
            </div>
            <div className={cn(
              "p-8 rounded-[40px] max-w-[80%] text-base font-medium shadow-sm transition-all leading-relaxed",
              msg.role === 'user' ? "bg-emerald-50 text-emerald-950 rounded-tr-none" : "bg-white text-emerald-950 rounded-tl-none border border-emerald-100"
            )}>
              {msg.text}
              {msg.role === 'ai' && (
                <button onClick={() => speak(msg.text)} className="ml-4 text-emerald-400 hover:text-emerald-600 transition-colors">
                  <Volume2 size={20} />
                </button>
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

      <div className="p-10 bg-slate-50 border-t border-slate-100 flex gap-6">
        <button 
          onClick={startListening}
          className={cn(
            "w-20 h-20 rounded-[32px] flex items-center justify-center transition-all border-2 shadow-xl",
            isListening ? "bg-red-500 border-white text-white animate-pulse" : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-brand-green"
          )}
        >
          {isListening ? <MicOff size={32} /> : <Mic size={32} />}
        </button>
        <div className="flex-1 relative">
            <input 
              placeholder="State your agronomy query..."
              className="w-full h-20 px-8 rounded-[32px] bg-white border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-green/10 text-slate-900 font-bold pr-20"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className="absolute right-4 top-4 w-12 h-12 bg-brand-green rounded-2xl flex items-center justify-center text-white shadow-xl disabled:opacity-50 transition-all active:translate-y-1 border-b-2 border-emerald-900"
            >
              <Send size={24} />
            </button>
        </div>
      </div>
    </div>
  );
};

const AIAnalysis = () => {
  const { state, addPoints } = useAgriDoc();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const speakResult = (data: any) => {
    const text = `${data.plantName}. Detected: ${data.diseaseName}. Care: ${data.careInstructions}. Soil: ${data.soilType}.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = state.language === 'bn' ? 'bn-BD' : state.language === 'th' ? 'th-TH' : 'en-US';
    window.speechSynthesis.speak(utterance);
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
    try {
      const base64 = image.split(',')[1];
      const data = await analyzePlantDisease(state.apiKey, base64, state.language);
      setResult(data);
      addPoints(50);
      speakResult(data);
    } catch (err) {
      alert("Spectral scan failed. Verify Neural Link and environmental conditions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="bg-white p-12 rounded-[64px] space-y-12 border border-slate-100 shadow-2xl relative overflow-hidden group">
        <div 
          onClick={() => fileRef.current?.click()}
          className="aspect-square sm:aspect-video bg-slate-50 rounded-[48px] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center gap-8 cursor-pointer hover:bg-slate-100 transition-all group relative overflow-hidden active:scale-[0.99] shadow-inner"
        >
          {image ? (
            <img src={image} alt="Upload" className="w-full h-full object-cover rounded-[48px]" referrerPolicy="no-referrer" />
          ) : (
            <div className="flex flex-col items-center gap-8">
              <div className="w-32 h-32 rounded-[40px] bg-brand-green flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform border-b-8 border-emerald-900 text-white">
                <Upload size={48} />
              </div>
              <div className="text-center space-y-2">
                <p className="text-3xl font-display font-black text-slate-900 uppercase">Initialize Scan</p>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.5em]">Cultivar Tissue Sample Required</p>
              </div>
            </div>
          )}
          <input type="file" ref={fileRef} onChange={handleUpload} className="hidden" accept="image/*" />
        </div>

        {image && !result && (
          <button 
            onClick={runAnalysis}
            disabled={loading}
            className="btn-primary w-full py-8 text-2xl tracking-tighter shadow-2xl"
          >
            {loading ? <Loader2 className="animate-spin" size={40} /> : "Initiate AI Diagnosis Protocol"}
          </button>
        )}

        {result && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 border-t border-emerald-100 pt-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h3 className="text-3xl sm:text-5xl font-display font-black text-emerald-950 tracking-tighter uppercase leading-tight">{result.plantName}</h3>
                <p className="text-[11px] font-black text-red-600 bg-red-50 inline-block px-4 py-2 rounded-full uppercase tracking-[0.4em] mt-2">Diagnosis: {result.diseaseName}</p>
              </div>
              <button 
                onClick={() => speakResult(result)}
                className="w-20 h-20 rounded-[32px] bg-amber-400 text-emerald-950 flex items-center justify-center shadow-2xl transition-all active:scale-95 hover:rotate-6 border-4 border-white"
              >
                <Volume2 size={40} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnalysisCard title="Mitigation Protocol" content={result.treatment} />
              <AnalysisCard title="Input Requirements" content={result.medicines} />
              <AnalysisCard title="Substrate Specs" content={result.soilType} />
              <AnalysisCard title="Hydration Protocol" content={result.irrigationNeeds} />
              <AnalysisCard title="Strategic Care" content={result.careInstructions} />
              <AnalysisCard title="Neural Addendum" content={result.additionalInfo} />
            </div>

            <button onClick={() => {setImage(null); setResult(null);}} className="w-full py-10 text-[11px] font-black uppercase tracking-[0.6em] text-slate-300 hover:text-brand-green transition-all rounded-[48px] hover:bg-slate-50 border-2 border-dashed border-slate-100">
              Reset Spectral Sensor Array
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const AnalysisCard = ({ title, content }: any) => (
  <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-4 hover:shadow-lg transition-all">
    <p className="text-[10px] font-black uppercase tracking-widest text-brand-green">{title}</p>
    <p className="text-sm font-bold text-slate-600 leading-relaxed">{content}</p>
  </div>
);
