import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAgriDoc } from '../App';
import { PestReport } from '../types';
import { Bug, AlertTriangle, Info, MapPin, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

// Fix for Leaflet default icon issues in React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DUMMY_REPORTS: PestReport[] = [
  { id: '1', lat: 23.8103, lng: 90.4125, crop: 'Rice', pest: 'Brown Planthopper', severity: 'high', reportedAt: new Date().toISOString(), reporterName: 'Tanvir' },
  { id: '2', lat: 13.7563, lng: 100.5018, crop: 'Mango', pest: 'Fruit Fly', severity: 'medium', reportedAt: new Date().toISOString(), reporterName: 'Somchai' },
  { id: '3', lat: 39.9334, lng: 32.8597, crop: 'Wheat', pest: 'Rust', severity: 'low', reportedAt: new Date().toISOString(), reporterName: 'Ahmet' },
  { id: '4', lat: 24.3745, lng: 88.6042, crop: 'Chili', pest: 'Thrips', severity: 'high', reportedAt: new Date().toISOString(), reporterName: 'Karim' },
  { id: '5', lat: 18.7883, lng: 98.9853, crop: 'Tomato', pest: 'Leaf Miner', severity: 'medium', reportedAt: new Date().toISOString(), reporterName: 'Sireena' },
];

export const PestMap: React.FC = () => {
  const { state, addPoints } = useAgriDoc();
  const [reports, setReports] = useState<PestReport[]>(() => {
    const local = localStorage.getItem('agri_pest_reports');
    return local ? JSON.parse(local) : DUMMY_REPORTS;
  });
  const [isAdding, setIsAdding] = useState(false);
  const [newReport, setNewReport] = useState<{ crop: string; pest: string; severity: any }>({
    crop: 'Rice',
    pest: '',
    severity: 'medium'
  });

  useEffect(() => {
    localStorage.setItem('agri_pest_reports', JSON.stringify(reports));
  }, [reports]);

  const handleMapClick = (latlng: L.LatLng) => {
    if (!isAdding) return;
    const report: PestReport = {
      id: Math.random().toString(36).substr(2, 9),
      lat: latlng.lat,
      lng: latlng.lng,
      crop: newReport.crop,
      pest: newReport.pest || 'Unknown Pest',
      severity: newReport.severity,
      reportedAt: new Date().toISOString(),
      reporterName: 'Me'
    };
    setReports([...reports, report]);
    setIsAdding(false);
    addPoints(30);
  };

  return (
    <div className="space-y-8 h-full flex flex-col pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <h2 className="text-5xl font-display font-black text-emerald-950 tracking-tighter uppercase leading-none italic">Pathogen Radar</h2>
          <p className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.4em]">Real-time Global Incursion Mapping</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className={cn(
              "bg-emerald-600 text-white h-16 px-10 rounded-[32px] text-[11px] font-black uppercase tracking-widest flex items-center gap-4 shadow-xl border-b-4 border-emerald-900 active:translate-y-1 transition-all",
              isAdding ? "bg-red-600 border-red-900" : ""
            )}
          >
            {isAdding ? "Abort Radar Drop" : <>Report Incursion <Plus size={20} /></>}
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white p-10 rounded-[48px] shadow-2xl border border-emerald-100 grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-top-4 relative z-50">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-emerald-400 tracking-widest ml-4 italic">Cultivar Species</label>
            <input 
              className="w-full bg-emerald-50 border border-emerald-100 h-16 px-6 rounded-2xl text-sm font-bold text-emerald-950 focus:ring-4 focus:ring-emerald-500/10 outline-none" 
              placeholder="e.g. Rice" 
              value={newReport.crop}
              onChange={e => setNewReport({...newReport, crop: e.target.value})}
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-emerald-400 tracking-widest ml-4 italic">Pathogen Signature</label>
            <input 
              className="w-full bg-emerald-50 border border-emerald-100 h-16 px-6 rounded-2xl text-sm font-bold text-emerald-950 focus:ring-4 focus:ring-emerald-500/10 outline-none" 
              placeholder="e.g. Locust" 
              value={newReport.pest}
              onChange={e => setNewReport({...newReport, pest: e.target.value})}
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-emerald-400 tracking-widest ml-4 italic">Incursion Severity</label>
            <select 
              className="w-full bg-emerald-50 border border-emerald-100 h-16 px-6 rounded-2xl text-sm font-bold text-emerald-950 focus:ring-4 focus:ring-emerald-500/10 outline-none appearance-none"
              value={newReport.severity}
              onChange={e => setNewReport({...newReport, severity: e.target.value as any})}
            >
              <option value="low">Alpha (Low)</option>
              <option value="medium">Beta (Medium)</option>
              <option value="high">Gamma (High)</option>
            </select>
          </div>
          <div className="md:col-span-3 text-[11px] text-emerald-600 font-black flex items-center gap-4 mt-2 uppercase tracking-widest italic">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center animate-bounce text-emerald-600">
                <MapPin size={20} />
            </div>
            Drop Neural Pin on the geo-matrix to confirm deployment.
          </div>
        </div>
      )}

      <div className="flex-1 min-h-[500px] rounded-[64px] overflow-hidden border-8 border-white shadow-2xl relative shadow-glow">
        <MapContainer center={[20, 90]} zoom={4} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEventsHandler onMapClick={handleMapClick} />
          {reports.map((report) => (
            <Marker key={report.id} position={[report.lat, report.lng]} icon={getPestIcon(report.severity)}>
              <Popup className="pest-popup">
                <div className="p-6 space-y-4 min-w-[240px]">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-emerald-950 uppercase tracking-widest opacity-40">{report.crop}</span>
                    <span className={cn(
                      "text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm",
                      report.severity === 'high' ? "bg-red-500 text-white" : 
                      report.severity === 'medium' ? "bg-orange-500 text-white" : "bg-emerald-500 text-white"
                    )}>
                      {report.severity}
                    </span>
                  </div>
                  <h4 className="text-2xl font-display font-black text-emerald-950 flex items-center gap-3 uppercase tracking-tighter italic">
                    <Bug size={24} className={report.severity === 'high' ? "text-red-500" : "text-emerald-600"} /> {report.pest}
                  </h4>
                  <div className="text-[10px] text-emerald-400 font-black border-t border-emerald-50 pt-4 uppercase tracking-[0.2em] italic">
                    Reporter: {report.reporterName}<br/>
                    Matrix Sync: {new Date(report.reportedAt).toLocaleDateString()}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatBox label="Total Incursions" value={reports.length.toString()} />
        <StatBox label="Gamma Risk Zones" value={reports.filter(r => r.severity === 'high').length.toString()} />
        <StatBox label="Networked Regions" value="12" />
      </div>
    </div>
  );
};

const MapEventsHandler = ({ onMapClick }: { onMapClick: (latlng: L.LatLng) => void }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const getPestIcon = (severity: string) => {
  const color = severity === 'high' ? '#ef4444' : severity === 'medium' ? '#f97316' : '#15803d';
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 4px solid white; box-shadow: 0 10px 20px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; color: white;">
             <div style="width: 8px; height: 8px; background: white; border-radius: 50%; animation: pulse 2s infinite;"></div>
           </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

const StatBox = ({ label, value }: any) => (
  <div className="bg-white p-10 rounded-[48px] border border-emerald-100 flex flex-col items-center gap-3 shadow-xl hover:shadow-2xl transition-all group">
    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.3em] group-hover:tracking-[0.5em] transition-all italic">{label}</span>
    <span className="text-5xl font-display font-black text-emerald-950 tracking-tighter uppercase leading-none">{value}</span>
  </div>
);
