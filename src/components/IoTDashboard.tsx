import React, { useState, useEffect } from 'react';
import { Activity, Thermometer, Droplets, Wind, AlertCircle, Play, Pause, Zap, BarChart3, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useAgriDoc } from '../App';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export const IoTDashboard: React.FC = () => {
  const { addPoints } = useAgriDoc();
  const [data, setData] = useState({
    moisture: 45,
    temp: 28,
    humidity: 65
  });
  const [history, setHistory] = useState<any[]>([]);
  const [isIrrigating, setIsIrrigating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        moisture: Math.max(10, Math.min(90, prev.moisture + (Math.random() - 0.5) * 5)),
        temp: Math.max(15, Math.min(45, prev.temp + (Math.random() - 0.5) * 2)),
        humidity: Math.max(30, Math.min(90, prev.humidity + (Math.random() - 0.5) * 3))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setHistory(prev => [...prev.slice(-11), {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      moisture: data.moisture
    }]);
  }, [data]);

  const handleAutoIrrigate = () => {
    setIsIrrigating(true);
    addPoints(20);
    setTimeout(() => {
      setData(prev => ({ ...prev, moisture: Math.min(80, prev.moisture + 30) }));
      setIsIrrigating(false);
    }, 3000);
  };

  const chartData = {
    labels: history.map(h => h.time),
    datasets: [{
      label: 'Soil Moisture %',
      data: history.map(h => h.moisture),
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 0
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { min: 0, max: 100, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 10, weight: 'bold' as const } } },
      x: { ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 10, weight: 'bold' as const } } }
    }
  };

  return (
    <div className="space-y-10 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[24px] bg-emerald-600 flex items-center justify-center text-white shadow-xl border-4 border-white">
            <Activity size={32} />
          </div>
          <div className="space-y-1">
            <h2 className="text-5xl font-display font-black text-emerald-950 tracking-tighter uppercase leading-none">IoT Telemetry</h2>
            <p className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.4em]">Real-time Satellite-Linked Node Data</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-5 py-3 bg-emerald-50 rounded-full border border-emerald-100">
           <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-glow" />
           <span className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.4em]">Node Synced</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <SensorCard 
          icon={<Droplets size={32} />} 
          label="Hydro Level" 
          value={`${data.moisture.toFixed(0)}%`} 
          color="emerald" 
          alert={data.moisture < 30}
        />
        <SensorCard 
          icon={<Thermometer size={32} />} 
          label="Thermal Index" 
          value={`${data.temp.toFixed(1)}°C`} 
          color="orange" 
        />
        <SensorCard 
          icon={<Wind size={32} />} 
          label="Atmospheric Saturation" 
          value={`${data.humidity.toFixed(0)}%`} 
          color="blue" 
        />
      </div>

      {data.moisture < 30 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="bg-red-50 border-4 border-red-100 p-10 rounded-[48px] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden"
        >
          <div className="flex items-center gap-6 relative z-10">
             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 animate-pulse">
                <AlertCircle size={32} />
             </div>
             <div className="space-y-1">
                <p className="text-3xl font-display font-black text-red-950 tracking-tighter uppercase leading-none">CRITICAL: Hydro Depletion</p>
                <p className="text-sm font-bold text-red-600 uppercase tracking-widest">Soil moisture nodes reporting below 30% threshold.</p>
             </div>
          </div>
          <button 
            onClick={handleAutoIrrigate}
            disabled={isIrrigating}
            className="bg-red-600 text-white px-10 py-6 rounded-3xl text-xs font-black uppercase tracking-widest flex items-center gap-4 hover:bg-red-700 transition-all shadow-xl disabled:opacity-50 relative z-10 active:translate-y-1 border-b-4 border-red-900"
          >
            {isIrrigating ? <RefreshCcw size={20} className="animate-spin" /> : <Play size={20} />} Initiate Auto-Hydration
          </button>
          <div className="absolute right-[-40px] top-[-40px] w-64 h-64 bg-red-100/30 rounded-full blur-[80px]"></div>
        </motion.div>
      )}

      <div className="bg-white p-12 rounded-[64px] border border-emerald-100 shadow-2xl space-y-10">
        <div className="flex items-center justify-between">
           <div className="space-y-1">
              <h3 className="text-3xl font-display font-black text-emerald-950 flex items-center gap-4 uppercase tracking-tighter">
                <BarChart3 size={32} className="text-emerald-600" /> Hydrographic Pulse
              </h3>
              <p className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.4em] italic leading-none">Last 10 Cycle Telemetry Data</p>
           </div>
        </div>
        <div className="h-[300px] w-full">
          <Line 
            data={chartData} 
            options={{
              ...chartOptions,
              scales: {
                y: { min: 0, max: 100, grid: { color: 'rgba(0,0,0,0.05)' }, border: { display: false }, ticks: { color: '#065f46', font: { family: 'Space Grotesk', size: 10, weight: 'bold' } } },
                x: { grid: { display: false }, border: { display: false }, ticks: { color: '#065f46', font: { family: 'Space Grotesk', size: 10, weight: 'bold' } } }
              }
            }} 
          />
        </div>
      </div>
    </div>
  );
};

const SensorCard = ({ icon, label, value, color, alert }: any) => (
  <div className={cn(
    "bg-white p-10 rounded-[48px] space-y-6 border-2 transition-all shadow-xl group hover:scale-[1.02] duration-500",
    alert ? "border-red-500 bg-red-50/50 animate-pulse" : "border-emerald-50 hover:border-emerald-200"
  )}>
    <div className={cn(
      "w-20 h-20 rounded-[32px] flex items-center justify-center transition-transform group-hover:rotate-12 duration-500 border border-emerald-50 shadow-sm transition-all",
      color === 'emerald' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
      color === 'orange' ? "bg-orange-50 text-orange-600 border-orange-100" : "bg-blue-50 text-blue-600 border-blue-100"
    )}>
      {icon}
    </div>
    <div className="space-y-1">
      <p className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.2em]">{label}</p>
      <p className="text-5xl font-display font-black text-emerald-950 tracking-tighter uppercase">{value}</p>
    </div>
  </div>
);
