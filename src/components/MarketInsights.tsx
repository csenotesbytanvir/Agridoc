import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, ShoppingBag, Plus, Search, Tag, MapPin, Phone, ArrowUpRight, ArrowDownRight, ShieldCheck, History, X, Info, Trash2, MessageCircle, Send as SendIcon, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { cn } from '../lib/utils';
import { useAgriDoc } from '../App';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Simple hash simulation function
const generateHash = (data: string) => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
};

const ITEMS = [
  { name: 'Rice', price: 54, unit: 'kg', trend: 'up' },
  { name: 'Tomato', price: 32, unit: 'kg', trend: 'down' },
  { name: 'Mango', price: 120, unit: 'kg', trend: 'up' },
  { name: 'Chili', price: 80, unit: 'kg', trend: 'stable' },
  { name: 'Potato', price: 20, unit: 'kg', trend: 'up' },
  { name: 'Onion', price: 45, unit: 'kg', trend: 'down' },
  { name: 'Urea', price: 250, unit: 'bag', trend: 'stable' },
  { name: 'Potash', price: 400, unit: 'bag', trend: 'up' },
];

export const MarketInsights: React.FC = () => {
  const { addPoints, t } = useAgriDoc();
  const [activeTab, setActiveTab] = useState<'prices' | 'marketplace'>('prices');
  const [listings, setListings] = useState<any[]>(() => {
    const local = localStorage.getItem('agri_listings');
    return local ? JSON.parse(local) : [
      { 
        id: 1, 
        type: 'sell', 
        title: 'Heirloom Organic Tomatoes', 
        price: 30, 
        quantity: '500kg', 
        location: 'Savar', 
        seller: 'Tanvir', 
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=1974&auto=format&fit=crop', 
        blockchainHash: generateHash('Organic Tomatoes-Tanvir-2026'), 
        harvestDate: '2026-04-15', 
        origin: 'Savar Eco-Farm' 
      },
      { 
        id: 2, 
        type: 'buy', 
        title: 'WANTED: Premium Mangoes', 
        price: 180, 
        quantity: '2000kg', 
        location: 'Dhaka Port', 
        seller: 'Global Exports Ltd', 
        image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=1974&auto=format&fit=crop', 
        blockchainHash: generateHash('Mango-Buy-Global-2026'), 
        origin: 'Rajshahi Region Preferred' 
      },
      { 
        id: 3, 
        type: 'sell', 
        title: 'Boro Rice Grains', 
        price: 450, 
        quantity: '50kg', 
        location: 'Bogura', 
        seller: 'Sarker', 
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=2070&auto=format&fit=crop', 
        blockchainHash: generateHash('Rice-Sarker-2026'), 
        harvestDate: '2026-04-10', 
        origin: 'Bogura Plains' 
      },
      { 
        id: 4, 
        type: 'buy', 
        title: 'WANTED: Fresh Chilli (Bullet)', 
        price: 120, 
        quantity: '500kg', 
        location: 'Gazipur', 
        seller: 'Kitchen Spices Inc', 
        image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?q=80&w=1964&auto=format&fit=crop', 
        blockchainHash: generateHash('Chilli-Buy-Kitchen-2026'), 
        origin: 'Bogura/Pabna Region' 
      },
    ];
  });

  const [showAddListing, setShowAddListing] = useState(false);
  const [traceTarget, setTraceTarget] = useState<any>(null);
  const [chatTarget, setChatTarget] = useState<any>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const [chats, setChats] = useState<any>(() => {
    const local = localStorage.getItem('agri_trade_chats');
    return local ? JSON.parse(local) : {};
  });

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    const chatId = chatTarget.id;
    const newMsg = { sender: 'me', text: chatMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    const updatedChats = { ...chats, [chatId]: [...(chats[chatId] || []), newMsg] };
    setChats(updatedChats);
    localStorage.setItem('agri_trade_chats', JSON.stringify(updatedChats));
    setChatMessage('');
    
    // Auto-reply logic
    setTimeout(() => {
      const reply = { sender: 'seller', text: `Thanks for reaching out! Is the price for ${chatTarget.title} negotiable?`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      const finalChats = { ...updatedChats, [chatId]: [...updatedChats[chatId], reply] };
      setChats(finalChats);
      localStorage.setItem('agri_trade_chats', JSON.stringify(finalChats));
      addPoints(5);
    }, 1500);
  };

  const handleAdd = (e: any) => {
    e.preventDefault();
    const form = e.target;
    const newList = {
      id: Date.now(),
      type: 'sell',
      title: form.title.value,
      price: Number(form.price.value),
      quantity: form.quantity.value,
      location: form.location.value,
      seller: localStorage.getItem('agri_profile_name') || 'Me',
      image: uploadPreview || `https://picsum.photos/seed/${form.title.value}/400`,
      blockchainHash: generateHash(`${form.title.value}-Me-${new Date().toISOString()}`),
      harvestDate: new Date().toISOString().split('T')[0],
      origin: form.location.value
    };
    const updated = [newList, ...listings];
    setListings(updated);
    localStorage.setItem('agri_listings', JSON.stringify(updated));
    setShowAddListing(false);
    setUploadPreview(null);
    addPoints(100);
  };

  const handleDeleteListing = (id: number) => {
    const updated = listings.filter(l => l.id !== id);
    setListings(updated);
    localStorage.setItem('agri_listings', JSON.stringify(updated));
  };

  const currentUser = localStorage.getItem('agri_profile_name') || 'Me';

  return (
    <div className="space-y-10 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <h2 className="text-3xl sm:text-5xl font-display font-black text-emerald-950 tracking-tighter uppercase">Trade Hub</h2>
        <p className="text-[9px] sm:text-[10px] font-black uppercase text-emerald-600 tracking-[0.3em] sm:tracking-[0.4em]">Decentralized Marketplace Hub</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1 sm:p-2 rounded-[32px] sm:rounded-[40px] border border-emerald-100 shadow-xl overflow-hidden">
        <button 
          onClick={() => setActiveTab('prices')}
          className={cn(
            "flex-1 py-4 sm:py-6 rounded-[24px] sm:rounded-[32px] text-[10px] sm:text-[11px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] transition-all flex items-center justify-center gap-2 sm:gap-4",
            activeTab === 'prices' ? "bg-emerald-600 text-white shadow-xl" : "text-emerald-300 hover:bg-emerald-50"
          )}
        >
          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" /> <span className="whitespace-nowrap">Index Prices</span>
        </button>
        <button 
          onClick={() => setActiveTab('marketplace')}
          className={cn(
            "flex-1 py-4 sm:py-6 rounded-[24px] sm:rounded-[32px] text-[10px] sm:text-[11px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] transition-all flex items-center justify-center gap-2 sm:gap-4",
            activeTab === 'marketplace' ? "bg-emerald-600 text-white shadow-xl" : "text-emerald-300 hover:bg-emerald-50"
          )}
        >
          <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" /> <span className="whitespace-nowrap">Trade Hub</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'prices' ? (
          <motion.div 
            key="prices"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-10"
          >
            <PriceTrendChart />
            
            <div className="bg-white rounded-[40px] sm:rounded-[56px] overflow-hidden divide-y divide-emerald-50 border border-emerald-100 shadow-xl">
              <div className="p-5 sm:p-8 bg-emerald-50 flex items-center justify-between">
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-emerald-400">Cultivar / Matrix</span>
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-emerald-400">Exchange Rate</span>
              </div>
              {ITEMS.map((item, i) => (
                <div key={i} className="p-5 sm:p-8 flex items-center justify-between hover:bg-emerald-50 transition-all group">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-[24px] bg-emerald-50 flex items-center justify-center font-display font-black text-xl sm:text-2xl text-emerald-800 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 transition-all group-hover:rotate-6 shrink-0">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-display font-black text-emerald-950 text-base sm:text-xl uppercase tracking-tighter shrink-0">{item.name}</h4>
                      <p className="text-[9px] sm:text-[10px] font-black text-emerald-300 tracking-[0.15em] sm:tracking-[0.2em] uppercase mt-1">Metric: {item.unit}</p>
                    </div>
                  </div>
                  
                  {/* Mini Trend Graph */}
                  <div className="hidden md:block w-32 h-16 opacity-50 group-hover:opacity-100 transition-opacity">
                    <Line 
                      data={{
                        labels: ['', '', '', '', ''],
                        datasets: [{
                          data: [item.price * 0.9, item.price * 1.1, item.price * 0.95, item.price * 1.05, item.price],
                          borderColor: item.trend === 'up' ? '#ef4444' : item.trend === 'down' ? '#10b981' : '#10b981',
                          borderWidth: 3,
                          tension: 0.4,
                          pointRadius: 0
                        }]
                      }} 
                      options={{
                        plugins: { legend: { display: false }, tooltip: { enabled: false } },
                        scales: { x: { display: false }, y: { display: false } },
                        maintainAspectRatio: false
                      }}
                    />
                  </div>

                  <div className="text-right">
                    <p className="font-display font-black text-xl sm:text-3xl text-emerald-950 tracking-tighter">৳{item.price}</p>
                    <div className={cn(
                      "flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest justify-end mt-1 sm:mt-2",
                      item.trend === 'up' ? "text-red-500" : item.trend === 'down' ? "text-emerald-600" : "text-emerald-300"
                    )}>
                      {item.trend === 'up' ? <ArrowUpRight size={12} /> : item.trend === 'down' ? <ArrowDownRight size={12} /> : null}
                      {item.trend}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="marketplace"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative flex-1 group">
                <Search className="absolute left-6 sm:left-8 top-1/2 -translate-y-1/2 text-emerald-300 w-5 h-5 sm:w-6 sm:h-6 group-focus-within:text-emerald-600 transition-colors" />
                <input 
                  type="text"
                  placeholder="Search global cultivars..."
                  className="w-full pl-14 sm:pl-20 pr-6 sm:pr-8 h-14 sm:h-20 bg-white border border-emerald-100 rounded-2xl sm:rounded-[32px] font-bold text-emerald-950 shadow-xl focus:ring-4 focus:ring-emerald-500/10 outline-none text-sm sm:text-base"
                />
              </div>
              <button 
                onClick={() => setShowAddListing(true)}
                className="w-14 h-14 sm:w-20 sm:h-20 bg-emerald-500 rounded-2xl sm:rounded-[32px] flex items-center justify-center text-white shadow-xl hover:scale-105 hover:rotate-12 transition-all active:scale-95 border-4 border-white shrink-0"
              >
                <Plus className="w-6 h-6 sm:w-9 sm:h-9" />
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 sm:gap-10">
              {listings.map((list) => (
                <div key={list.id} className="bg-white rounded-[40px] sm:rounded-[56px] overflow-hidden flex flex-col group transition-all hover:shadow-2xl border border-emerald-50 shadow-xl relative border-b-8 border-b-emerald-100 hover:border-b-emerald-500 hover:-translate-y-1">
                  <div className="w-full h-48 sm:h-64 overflow-hidden relative">
                    <img 
                      src={list.image} 
                      alt={list.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      referrerPolicy="no-referrer"
                    />
                    {list.blockchainHash && (
                      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-emerald-600 text-white text-[9px] sm:text-[10px] font-black px-4 sm:px-5 py-2 sm:py-3 rounded-full sm:rounded-[24px] uppercase tracking-widest flex items-center gap-2 sm:gap-3 shadow-2xl border-2 border-white/20 backdrop-blur-md">
                        <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="hidden xs:inline">Verified Matrix</span><span className="xs:hidden">Verified</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 sm:p-10 space-y-6 sm:space-y-8 relative z-10">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                        <h3 className="font-display font-black text-xl sm:text-3xl text-emerald-950 tracking-tighter uppercase leading-tight">{list.title}</h3>
                        <span className={cn(
                          "text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-4 sm:px-6 py-1.5 sm:py-2 rounded-full border-2 w-fit",
                          list.type === 'sell' ? "bg-red-50 text-red-600 border-red-100" : "bg-blue-50 text-blue-600 border-blue-100"
                        )}>
                          Protocol: {list.type}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 sm:gap-8">
                        <MarketMeta icon={<Tag className="w-4 h-4 sm:w-5 sm:h-5" />} label={list.quantity} />
                        <MarketMeta icon={<MapPin className="w-4 h-4 sm:w-5 sm:h-5" />} label={list.location} />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 sm:pt-10 mt-6 sm:mt-10 border-t border-emerald-50">
                      <p className="text-3xl sm:text-4xl font-display font-black text-emerald-950 tracking-tighter">৳{list.price}</p>
                      <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
                        {list.blockchainHash && (
                          <button 
                            onClick={() => setTraceTarget(list)}
                            className="bg-emerald-50 text-emerald-400 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-[24px] hover:bg-emerald-100 transition-all border border-emerald-200 flex items-center justify-center active:scale-95 shadow-inner shrink-0"
                            title="Traceability Protocol"
                          >
                            <History className="w-5 h-5 sm:w-6 sm:h-6" />
                          </button>
                        )}
                        <button 
                          onClick={() => setChatTarget(list)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 sm:gap-4 bg-emerald-600 text-white h-12 sm:h-16 px-4 sm:px-10 rounded-2xl sm:rounded-[32px] text-[10px] sm:text-[11px] font-black uppercase tracking-widest hover:scale-[1.03] transition-all shadow-xl active:translate-y-1 border-b-4 border-emerald-900"
                        >
                          <MessageCircle className="w-5 h-5 sm:w-5 sm:h-5" /> Chat
                        </button>
                        {list.seller === currentUser && (
                          <button 
                            onClick={() => handleDeleteListing(list.id)}
                            className="bg-red-50 text-red-400 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-[24px] hover:bg-red-500 hover:text-white transition-all border border-red-100 flex items-center justify-center active:scale-95 shadow-sm shrink-0"
                          >
                            <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddListing && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddListing(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-12 sm:p-16 rounded-[80px] w-full max-w-2xl relative z-10 space-y-10 shadow-2xl border border-emerald-100"
            >
              <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-4xl font-display font-black text-emerald-950 uppercase">Global Listing</h3>
                    <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mt-1">Matrix Registration Protocol v3.0</p>
                </div>
                <button onClick={() => setShowAddListing(false)} className="w-14 h-14 bg-emerald-50 rounded-[20px] flex items-center justify-center text-emerald-300 hover:text-emerald-600 hover:bg-emerald-100 transition-all border border-emerald-100"><X /></button>
              </div>
              <form onSubmit={handleAdd} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-emerald-400 tracking-widest ml-6">Product Lexicon</label>
                  <input name="title" required placeholder="Cultivar Designation (e.g., Premium Boro Rice)" className="w-full bg-emerald-50 border border-emerald-100 h-20 px-8 rounded-[32px] font-bold text-emerald-950 outline-none focus:ring-4 focus:ring-emerald-500/10" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-emerald-400 tracking-widest ml-6">Valuation (৳)</label>
                    <input name="price" type="number" required placeholder="Price Point" className="w-full bg-emerald-50 border border-emerald-100 h-20 px-8 rounded-[32px] font-bold text-emerald-950 outline-none focus:ring-4 focus:ring-emerald-500/10" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-emerald-400 tracking-widest ml-6">Mass/Unit</label>
                    <input name="quantity" required placeholder="e.g. 500kg" className="w-full bg-emerald-50 border border-emerald-100 h-20 px-8 rounded-[32px] font-bold text-emerald-950 outline-none focus:ring-4 focus:ring-emerald-500/10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-emerald-400 tracking-widest ml-6">Product Geospatial Map</label>
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 h-32 bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-[32px] flex flex-col items-center justify-center gap-3 text-emerald-400 hover:bg-emerald-100 hover:border-emerald-300 transition-all group overflow-hidden relative"
                    >
                      {uploadPreview ? (
                        <img src={uploadPreview} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <>
                          <ImageIcon size={32} className="group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-black tracking-widest uppercase">Upload Cultivar Image</span>
                        </>
                      )}
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-emerald-400 tracking-widest ml-6">Geospatial Origin</label>
                  <input name="location" required placeholder="Farming District" className="w-full bg-emerald-50 border border-emerald-100 h-20 px-8 rounded-[32px] font-bold text-emerald-950 outline-none focus:ring-4 focus:ring-emerald-500/10" />
                </div>
                <div className="bg-emerald-50 p-8 rounded-[48px] border border-emerald-100 flex gap-6">
                  <ShieldCheck size={32} className="text-emerald-600 shrink-0" />
                  <p className="text-[11px] font-black text-emerald-600 leading-relaxed uppercase tracking-wider">Automated Hash Synthesis: Your cultivar metadata will be permanently inscribed into the Agri-Ledger for verified global traceability.</p>
                </div>
                <button type="submit" className="btn-primary w-full py-8 text-2xl tracking-tighter shadow-xl">
                  Initialize Registry Entry
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {traceTarget && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTraceTarget(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-12 sm:p-16 rounded-[80px] w-full max-w-2xl relative z-10 space-y-12 shadow-2xl border border-emerald-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-5xl font-display font-black text-emerald-950 tracking-tighter uppercase">Traceability</h3>
                  <p className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.4em] mt-2">Block ID: #TX-{(traceTarget.blockchainHash || '').toUpperCase()}</p>
                </div>
                <button onClick={() => setTraceTarget(null)} className="w-14 h-14 bg-emerald-50 rounded-[20px] flex items-center justify-center text-emerald-300 hover:text-emerald-600 transition-all border border-emerald-100"><X /></button>
              </div>

              <div className="space-y-10">
                <TraceStep 
                  time="Phase 1: Registration" 
                  desc={`Product ${traceTarget.title} registered by Verified Farmer ${traceTarget.seller}. Identity authenticated.`}
                  icon={<ShieldCheck className="text-emerald-600" />}
                />
                <TraceStep 
                  time={`Phase 2: Harvest (${traceTarget.harvestDate})`} 
                  desc={`Cultivar harvested at ${traceTarget.origin}. Quality Certificate: Grade A Agricultural Matrix.`}
                  icon={<Tag className="text-blue-500" />}
                />
                <TraceStep 
                  time="Phase 3: Validation" 
                  desc="Distributed ledger consensus achieved. Merkle root verification complete."
                  icon={<History className="text-purple-500" />}
                />
                <TraceStep 
                  time="Current State: Live Hub" 
                  desc={`Active listing for ৳${traceTarget.price} in ${traceTarget.location} node.`}
                  isLast
                  icon={<MapPin className="text-amber-500" />}
                />
              </div>

              <div className="bg-emerald-50 p-8 rounded-[48px] border border-emerald-100 space-y-4">
                 <p className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.3em] flex items-center gap-3">
                    <Info size={16} /> Cryptographic Proof
                 </p>
                 <code className="text-[11px] font-mono text-emerald-600 break-all bg-white border border-emerald-100 p-6 rounded-3xl block leading-loose shadow-inner">
                    {`{"tx": "${traceTarget.blockchainHash}", "root": "0x${generateHash(traceTarget.title + 'root')}", "nodes": 124, "latency": "14ms"}`}
                 </code>
              </div>
            </motion.div>
          </div>
        )}

        {chatTarget && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setChatTarget(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[64px] w-full max-w-xl relative z-10 shadow-2xl flex flex-col h-[70vh] overflow-hidden border border-emerald-100">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center text-white border-4 border-white shadow-lg">
                    {chatTarget.seller.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-display font-black text-emerald-950 text-xl tracking-tight leading-none uppercase">{chatTarget.seller}</h3>
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-1">Trading Node: {chatTarget.location}</p>
                  </div>
                </div>
                <button onClick={() => setChatTarget(null)} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 shadow-md transition-all"><X size={20} /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-10 space-y-6 scrollbar-hide bg-slate-50/50">
                <div className="flex flex-col items-center mb-8">
                  <div className="w-32 h-32 rounded-[24px] overflow-hidden border-4 border-white shadow-xl mb-4">
                    <img src={chatTarget.image} className="w-full h-full object-cover" alt="Product" />
                  </div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Inquiring about:</p>
                  <p className="font-bold text-slate-800 uppercase tracking-tight">{chatTarget.title}</p>
                </div>

                {(chats[chatTarget.id] || []).map((msg: any, i: number) => (
                  <div key={i} className={cn("flex", msg.sender === 'me' ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[80%] p-6 rounded-[24px] shadow-sm text-sm font-bold relative",
                      msg.sender === 'me' ? "bg-emerald-600 text-white rounded-tr-none" : "bg-white text-slate-900 rounded-tl-none border border-slate-100"
                    )}>
                      {msg.text}
                      <span className={cn("block text-[8px] mt-2 opacity-50", msg.sender === 'me' ? "text-right" : "text-left")}>{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-white border-t border-slate-100">
                <div className="flex gap-4 relative">
                  <input 
                    placeholder="Type your trade query..."
                    className="w-full h-16 bg-slate-50 border border-slate-100 rounded-[24px] px-8 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-emerald-100 pr-16"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="absolute right-2 top-2 w-12 h-12 bg-emerald-600 text-white rounded-[18px] flex items-center justify-center shadow-lg active:scale-95 transition-all"
                  >
                    <SendIcon size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TraceStep = ({ time, desc, icon, isLast }: any) => (
  <div className="relative flex gap-10">
    {!isLast && <div className="absolute left-[27px] top-14 bottom-0 w-1 bg-emerald-100" />}
    <div className="w-14 h-14 rounded-[20px] bg-white border-2 border-emerald-100 flex items-center justify-center shrink-0 shadow-lg relative z-10 transition-transform hover:scale-110">
      {icon}
    </div>
    <div className="space-y-3 pb-12">
       <p className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.4em]">{time}</p>
       <p className="text-lg font-medium text-emerald-900/60 leading-relaxed italic">{desc}</p>
    </div>
  </div>
);

const MarketMeta = ({ icon, label }: any) => (
  <div className="flex items-center gap-3 text-base font-bold text-emerald-400 group-hover:text-emerald-600 transition-colors">
    <span className="text-emerald-500">{icon}</span>
    <span className="tracking-tight uppercase">{label}</span>
  </div>
);

const PriceTrendChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Market Index',
        data: [45, 48, 42, 55, 60, 54],
        borderColor: '#15803d',
        backgroundColor: 'rgba(21, 128, 61, 0.05)',
        fill: true,
        tension: 0.5,
        borderWidth: 6,
        pointRadius: 0,
        pointHoverRadius: 10,
        pointHoverBackgroundColor: '#15803d',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        titleFont: { family: 'Space Grotesk', size: 16, weight: 'bold' as const },
        bodyFont: { family: 'Space Grotesk', size: 14 },
        titleColor: '#0f172a',
        bodyColor: '#15803d',
        padding: 20,
        borderRadius: 24,
        borderColor: '#f1f5f9',
        borderWidth: 2,
        displayColors: false,
        shadowBlur: 20,
        shadowColor: 'rgba(0,0,0,0.1)'
      }
    },
    scales: {
      y: { display: false },
      x: { 
        grid: { display: false },
        border: { display: false },
        ticks: { 
            font: { weight: 'bold' as const, family: 'Space Grotesk', size: 11 }, 
            color: '#cbd5e1',
            padding: 15
        }
      }
    },
  };

  return (
    <div className="bg-white p-6 sm:p-12 rounded-[40px] sm:rounded-[64px] space-y-6 sm:space-y-10 border border-emerald-100 relative overflow-hidden group shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-0 relative z-10">
        <div className="space-y-1">
          <h3 className="text-2xl sm:text-3xl font-display font-black text-emerald-950 tracking-tighter uppercase">Price Matrix</h3>
          <p className="text-[9px] sm:text-[10px] text-emerald-400 font-black uppercase tracking-[0.3em] sm:tracking-[0.5em]">Aggregated Cultivar Trends</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-3xl sm:text-5xl font-display font-black text-emerald-600 tracking-tighter">+12.8%</p>
          <p className="text-[9px] sm:text-[10px] font-black text-emerald-300 uppercase tracking-widest mt-1">Q3 Protocol Variance</p>
        </div>
      </div>
      <div className="h-48 sm:h-64 relative z-10">
        <Line data={data} options={options} />
      </div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none"></div>
    </div>
  );
};

