import React, { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, Plus, Search, Tag, MapPin, Phone, ArrowUpRight, ArrowDownRight, ShieldCheck, History, X, Info, Trash2 } from 'lucide-react';
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
        type: 'sell', 
        title: 'Premium Alphanso Mangoes', 
        price: 150, 
        quantity: '100kg', 
        location: 'Rajshahi', 
        seller: 'Rahim', 
        image: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&q=80&w=1964', 
        blockchainHash: generateHash('Mangoes-Rahim-2026'), 
        harvestDate: '2026-04-20', 
        origin: 'Rajshahi Orchards' 
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
    ];
  });

  const [showAddListing, setShowAddListing] = useState(false);
  const [traceTarget, setTraceTarget] = useState<any>(null);

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
      image: `https://picsum.photos/seed/${form.title.value}/200`,
      blockchainHash: generateHash(`${form.title.value}-Me-${new Date().toISOString()}`),
      harvestDate: new Date().toISOString().split('T')[0],
      origin: form.location.value
    };
    const updated = [newList, ...listings];
    setListings(updated);
    localStorage.setItem('agri_listings', JSON.stringify(updated));
    setShowAddListing(false);
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
        <h2 className="text-5xl font-display font-black text-emerald-950 tracking-tighter uppercase">Trade Hub</h2>
        <p className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.4em]">Decentralized Marketplace Hub</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-2 rounded-[40px] border border-emerald-100 shadow-xl overflow-hidden">
        <button 
          onClick={() => setActiveTab('prices')}
          className={cn(
            "flex-1 py-6 rounded-[32px] text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4",
            activeTab === 'prices' ? "bg-emerald-600 text-white shadow-xl" : "text-emerald-300 hover:bg-emerald-50"
          )}
        >
          <TrendingUp size={24} /> Index Prices
        </button>
        <button 
          onClick={() => setActiveTab('marketplace')}
          className={cn(
            "flex-1 py-6 rounded-[32px] text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4",
            activeTab === 'marketplace' ? "bg-emerald-600 text-white shadow-xl" : "text-emerald-300 hover:bg-emerald-50"
          )}
        >
          <ShoppingBag size={24} /> Trade Hub
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
            
            <div className="bg-white rounded-[56px] overflow-hidden divide-y divide-emerald-50 border border-emerald-100 shadow-xl">
              <div className="p-8 bg-emerald-50 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Cultivar / Matrix</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Exchange Rate</span>
              </div>
              {ITEMS.map((item, i) => (
                <div key={i} className="p-8 flex items-center justify-between hover:bg-emerald-50 transition-all group">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[24px] bg-emerald-50 flex items-center justify-center font-display font-black text-2xl text-emerald-800 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 transition-all group-hover:rotate-6">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-display font-black text-emerald-950 text-xl uppercase tracking-tighter">{item.name}</h4>
                      <p className="text-[10px] font-black text-emerald-300 tracking-[0.2em] uppercase mt-1">Metric: Per {item.unit}</p>
                    </div>
                  </div>
                  
                  {/* Mini Trend Graph */}
                  <div className="hidden sm:block w-32 h-16 opacity-50 group-hover:opacity-100 transition-opacity">
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
                    <p className="font-display font-black text-3xl text-emerald-950 tracking-tighter">৳{item.price}</p>
                    <div className={cn(
                      "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest justify-end mt-2",
                      item.trend === 'up' ? "text-red-500" : item.trend === 'down' ? "text-emerald-600" : "text-emerald-300"
                    )}>
                      {item.trend === 'up' ? <ArrowUpRight size={14} /> : item.trend === 'down' ? <ArrowDownRight size={14} /> : null}
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
            <div className="flex items-center gap-6">
              <div className="relative flex-1 group">
                <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-emerald-300 w-6 h-6 group-focus-within:text-emerald-600 transition-colors" />
                <input 
                  type="text"
                  placeholder="Search global cultivars..."
                  className="w-full pl-20 pr-8 h-20 bg-white border border-emerald-100 rounded-[32px] font-bold text-emerald-950 shadow-xl focus:ring-4 focus:ring-emerald-500/10 outline-none"
                />
              </div>
              <button 
                onClick={() => setShowAddListing(true)}
                className="w-20 h-20 bg-emerald-500 rounded-[32px] flex items-center justify-center text-white shadow-xl hover:scale-105 hover:rotate-12 transition-all active:scale-95 border-4 border-white"
              >
                <Plus size={36} />
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
              {listings.map((list) => (
                <div key={list.id} className="bg-white rounded-[56px] overflow-hidden flex flex-col group transition-all hover:shadow-2xl border border-emerald-50 shadow-xl relative border-b-8 border-b-emerald-100 hover:border-b-emerald-500 hover:-translate-y-1">
                  <div className="w-full h-64 overflow-hidden relative">
                    <img 
                      src={list.image} 
                      alt={list.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      referrerPolicy="no-referrer"
                    />
                    {list.blockchainHash && (
                      <div className="absolute top-6 left-6 bg-emerald-600 text-white text-[10px] font-black px-5 py-3 rounded-[24px] uppercase tracking-widest flex items-center gap-3 shadow-2xl border-2 border-white/20 backdrop-blur-md">
                        <ShieldCheck size={18} /> Verified Matrix
                      </div>
                    )}
                  </div>
                  <div className="p-10 space-y-8 relative z-10">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display font-black text-3xl text-emerald-950 tracking-tighter uppercase">{list.title}</h3>
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full border-2",
                          list.type === 'sell' ? "bg-red-50 text-red-600 border-red-100" : "bg-blue-50 text-blue-600 border-blue-100"
                        )}>
                          Protocol: {list.type}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-8">
                        <MarketMeta icon={<Tag size={18} />} label={list.quantity} />
                        <MarketMeta icon={<MapPin size={18} />} label={list.location} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-10 mt-10 border-t border-emerald-50">
                      <p className="text-4xl font-display font-black text-emerald-950 tracking-tighter">৳{list.price}</p>
                      <div className="flex gap-4">
                        {list.blockchainHash && (
                          <button 
                            onClick={() => setTraceTarget(list)}
                            className="bg-emerald-50 text-emerald-400 w-16 h-16 rounded-[24px] hover:bg-emerald-100 transition-all border border-emerald-200 flex items-center justify-center active:scale-95 shadow-inner"
                            title="Traceability Protocol"
                          >
                            <History size={24} />
                          </button>
                        )}
                        <button className="flex items-center gap-4 bg-emerald-600 text-white h-16 px-10 rounded-[32px] text-[11px] font-black uppercase tracking-widest hover:scale-[1.03] transition-all shadow-xl active:translate-y-1 border-b-4 border-emerald-900">
                          <Phone size={20} /> Link Comms
                        </button>
                        {list.seller === currentUser && (
                          <button 
                            onClick={() => handleDeleteListing(list.id)}
                            className="bg-red-50 text-red-400 w-16 h-16 rounded-[24px] hover:bg-red-500 hover:text-white transition-all border border-red-100 flex items-center justify-center active:scale-95 shadow-sm"
                            title="X-Registry Listing"
                          >
                            <Trash2 size={24} />
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
    <div className="bg-white p-12 rounded-[64px] space-y-10 border border-emerald-100 relative overflow-hidden group shadow-xl">
      <div className="flex items-center justify-between relative z-10">
        <div className="space-y-1">
          <h3 className="text-3xl font-display font-black text-emerald-950 tracking-tighter uppercase">Price Matrix</h3>
          <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.5em]">Aggregated Cultivar Trends</p>
        </div>
        <div className="text-right">
          <p className="text-5xl font-display font-black text-emerald-600 tracking-tighter">+12.8%</p>
          <p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest mt-1">Q3 Protocol Variance</p>
        </div>
      </div>
      <div className="h-64 relative z-10">
        <Line data={data} options={options} />
      </div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none"></div>
    </div>
  );
};

