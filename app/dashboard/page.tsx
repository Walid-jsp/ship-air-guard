'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler 
} from 'chart.js';
import { AlertOctagon, CheckCircle, Activity, ThermometerSun, Gauge, Wind, Utensils, Coffee, DoorOpen, AlertTriangle } from 'lucide-react';
import Navbar from '../components/Navbar';
import ReportPdfButton from '../components/ReportPdfButton';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

const STATIONS = ['Cuisine', 'Restaurant', 'Couloir 1'];
const REFRESH_MS = 10000; // 10 secondes
const POINTS = 20;

// --- GÉNÉRATEUR DE VALEURS INDÉPENDANTES (70/15/15) ---
function getSmartValue(current: number, type: 'co2' | 'voc' | 'temp') {
  // Tirage aléatoire propre à chaque appel de paramètre
  const r = Math.random(); 
  const speed = 0.8; // Vitesse de transition identique pour tous
  let target;

  if (type === 'co2') {
    if (r < 0.80) target = 650 + Math.random() * 140;      // 70% Sain (650-790)
    else if (r < 0.9) target = 850 + Math.random() * 140; // 15% Orange (850-990)
    else target = 1050 + Math.random() * 250;             // 15% Rouge (1050-1300)
  } 
  else if (type === 'voc') {
    if (r < 0.80) target = 60 + Math.random() * 80;       // 70% Sain (60-140)
    else if (r < 0.9) target = 170 + Math.random() * 70;  // 15% Orange (170-240)
    else target = 260 + Math.random() * 140;              // 15% Rouge (260-400)
  } 
  else { // Température
    if (r < 0.80) target = 28 + Math.random() * 6;        // 70% Sain (28-34)
    else if (r < 0.9) target = 35.5 + Math.random() * 2; // 15% Orange (35.5-37.5)
    else target = 38.5 + Math.random() * 4;               // 15% Rouge (38.5-42.5)
  }

  // Application du lissage fluide vers la cible individuelle
  return current + (target - current) * speed;
}

// --- COMPOSANT JAUGE ---
function GaugeCard({ title, value, unit, orangeThreshold, redThreshold, icon }: {
  title: string; value: number; unit: string; orangeThreshold: number; redThreshold: number; icon: ReactNode;
}) {
  const safeValue = value || 0;
  let currentColor = '#10b981'; 
  let statusText = "Sain";

  if (safeValue >= redThreshold) { currentColor = '#ef4444'; statusText = "DANGER"; }
  else if (safeValue >= orangeThreshold) { currentColor = '#f59e0b'; statusText = "Vigilance"; }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl relative">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white font-mono">{Math.round(safeValue)}</span>
            <span className="text-[10px] text-slate-500">{unit}</span>
          </div>
        </div>
        <div className="text-slate-500">{icon}</div>
      </div>
      <div className="relative h-32 w-full flex items-center justify-center">
        <Doughnut 
          data={{
            datasets: [
              // CORRECTION ICI : Ajout de "as any" pour éviter l'erreur TypeScript sur 'cutout'
              { 
                data: [Math.min(safeValue, redThreshold), Math.max(0, redThreshold - safeValue)], 
                backgroundColor: [currentColor, 'rgba(255, 255, 255, 0.05)'], 
                borderWidth: 0, 
                cutout: '85%' 
              } as any,
              { 
                data: [orangeThreshold, redThreshold - orangeThreshold], 
                backgroundColor: ['rgba(16, 185, 129, 0.1)', 'rgba(245, 158, 11, 0.15)'], 
                borderWidth: 0, 
                cutout: '92%' 
              } as any
            ]
          }} 
          options={{ responsive: true, maintainAspectRatio: false, plugins: { tooltip: { enabled: false } } }} 
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-1">
          <p className="text-[10px] font-black uppercase" style={{ color: currentColor }}>{statusText}</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-800/50 flex justify-between items-center text-[9px] font-bold uppercase">
        <div className="flex flex-col text-orange-400"><span>Vigilance</span><span>{orangeThreshold}{unit}</span></div>
        <div className="flex flex-col text-right text-red-500"><span>Alerte</span><span>{redThreshold}{unit}</span></div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState('Cuisine');
  const [allStationsData, setAllStationsData] = useState<Record<string, any>>({});
  const [allHistories, setAllHistories] = useState<Record<string, any>>({});
  const [lastUpdate, setLastUpdate] = useState<string>('--:--');
  const [isPaused, setIsPaused] = useState(false);
  const [pausedIndex, setPausedIndex] = useState<number | null>(null);
  const [pausedLabel, setPausedLabel] = useState<string | null>(null);
  const lineChartRef = useRef<any>(null);
  const isPausedRef = useRef(false);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const initialData: Record<string, any> = {};
    const initialHist: Record<string, any> = {};
    const now = Date.now();

    STATIONS.forEach(name => {
      let c = 700, v = 100, t = 30;
      const history = { labels: [] as string[], co2: [] as number[], voc: [] as number[], temp: [] as number[] };
      for (let i = 0; i < POINTS; i++) {
        const time = new Date(now - (POINTS - i) * REFRESH_MS).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        c = getSmartValue(c, 'co2'); v = getSmartValue(v, 'voc'); t = getSmartValue(t, 'temp');
        history.labels.push(time); history.co2.push(c); history.voc.push(v); history.temp.push(t);
      }
      initialHist[name] = history;
      initialData[name] = { co2: c, voc: v, temp: t, co2Threshold: 1000, vocThreshold: 250, tempThreshold: 38 };
    });

    setAllHistories(initialHist);
    setAllStationsData(initialData);
    setLastUpdate(new Date().toLocaleTimeString());
    setLoading(false);

    const interval = setInterval(() => {
      if (isPausedRef.current) return;
      const nextTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setAllStationsData(prev => {
        const nextData = { ...prev };
        setAllHistories(prevHist => {
          const nextHist = { ...prevHist };

          STATIONS.forEach(name => {
            const newCO2 = getSmartValue(prev[name]?.co2 || 700, 'co2');
            const newVOC = getSmartValue(prev[name]?.voc || 100, 'voc');
            const newTemp = getSmartValue(prev[name]?.temp || 30, 'temp');
            nextData[name] = { ...prev[name], co2: newCO2, voc: newVOC, temp: newTemp };
            nextHist[name] = {
              labels: [...prevHist[name].labels.slice(1), nextTime],
              co2: [...prevHist[name].co2.slice(1), newCO2],
              voc: [...prevHist[name].voc.slice(1), newVOC],
              temp: [...prevHist[name].temp.slice(1), newTemp],
            };
          });
          return nextHist;
        });
        return nextData;
      });
      setLastUpdate(new Date().toLocaleTimeString());
    }, REFRESH_MS);

    return () => clearInterval(interval);
  }, []);

  const readings = allStationsData[selectedStation];
  const history = allHistories[selectedStation];

  const displayedReadings = (() => {
    if (!isPaused || pausedIndex === null) return readings;
    if (!history || !readings) return readings;

    return {
      ...readings,
      co2: history.co2?.[pausedIndex] ?? readings.co2,
      voc: history.voc?.[pausedIndex] ?? readings.voc,
      temp: history.temp?.[pausedIndex] ?? readings.temp,
    };
  })();

  const snapshotByStation: Record<string, any> = (() => {
    if (!isPaused || pausedIndex === null) return allStationsData;

    const snap: Record<string, any> = { ...allStationsData };
    STATIONS.forEach(name => {
      const base = allStationsData[name];
      const h = allHistories[name];
      if (!base || !h) return;
      snap[name] = {
        ...base,
        co2: h.co2?.[pausedIndex] ?? base.co2,
        voc: h.voc?.[pausedIndex] ?? base.voc,
        temp: h.temp?.[pausedIndex] ?? base.temp,
      };
    });
    return snap;
  })();

  const handleReturnToLive = () => {
    setIsPaused(false);
    setPausedIndex(null);
    setPausedLabel(null);
  };

  const handleChartClick = (event: any) => {
    const chart = lineChartRef.current;
    if (!chart || !history || !readings) return;

    const elements = chart.getElementsAtEventForMode(
      event?.nativeEvent ?? event,
      'nearest',
      { intersect: false },
      true
    );

    if (!elements || elements.length === 0) return;
    const index = elements[0].index as number;
    if (!Number.isFinite(index) || index < 0) return;

    const label = history.labels[index] ?? null;

    setIsPaused(true);
    setPausedIndex(index);
    setPausedLabel(label);
  };

  // LOGIQUE DE STATUT GLOBAL (Rouge > Orange > Vert)
  const redAlertZones = STATIONS.filter(name => {
    const s = snapshotByStation[name];
    return s && (s.co2 >= 1000 || s.temp >= 38 || s.voc >= 250);
  });
  const orangeAlertZones = STATIONS.filter(name => {
    const s = snapshotByStation[name];
    return s && !redAlertZones.includes(name) && (s.co2 >= 800 || s.temp >= 35 || s.voc >= 150);
  });

  const bannerVariant: 'green' | 'orange' | 'red' =
    redAlertZones.length > 0 ? 'red' : orangeAlertZones.length > 0 ? 'orange' : 'green';

  let bannerClass = "bg-emerald-950/10 border-emerald-500/30";
  let bannerIcon = <CheckCircle className="text-emerald-500" />;
  let bannerTitle = "Système Opérationnel";
  let bannerDesc = "Aucune anomalie détectée sur le navire.";

  if (redAlertZones.length > 0) {
    bannerClass = "bg-red-950/30 border-red-500/50 shadow-lg";
    bannerIcon = <AlertOctagon className="text-red-500 animate-pulse" />;
    bannerTitle = "DANGER : SEUIL CRITIQUE";
    bannerDesc = `Zone(s) en alerte rouge : ${redAlertZones.join(', ')}`;
  } else if (orangeAlertZones.length > 0) {
    bannerClass = "bg-orange-950/30 border-orange-500/50 shadow-md";
    bannerIcon = <AlertTriangle className="text-orange-500" />;
    bannerTitle = "VIGILANCE : SEUIL ATTEINT";
    bannerDesc = `Zone(s) en vigilance orange : ${orangeAlertZones.join(', ')}`;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* BANDEAU STATUT GLOBAL TRI-ÉTATS */}
          {bannerVariant === 'red' ? (
            <div className="relative overflow-hidden rounded-2xl border-2 border-red-500 bg-red-950/90 backdrop-blur-md px-6 py-4 shadow-[0_0_30px_rgba(220,38,38,0.6)] animate-pulse">
              <div className="pointer-events-none absolute inset-0 opacity-25 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.18)_0px,rgba(255,255,255,0.18)_6px,transparent_6px,transparent_14px)]" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)]" />

              <div className="relative flex items-center justify-between gap-6">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex-shrink-0">
                    <AlertTriangle size={40} className="text-red-300 drop-shadow-[0_0_14px_rgba(248,113,113,0.9)] animate-bounce" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-white font-black tracking-wide uppercase text-sm md:text-base">
                      ALERTE CRITIQUE : {redAlertZones.join(', ')}
                    </p>
                    <p className="text-red-100/90 text-xs md:text-sm mt-1">
                      {(() => {
                        const zone = redAlertZones[0];
                        const s = zone ? snapshotByStation[zone] : null;
                        if (!s) return 'Seuil critique dépassé - intervention immédiate.';

                        const parts: string[] = [];
                        if (s.co2 > 1000) parts.push(`Niveau CO2 > ${Math.round(s.co2)} ppm`);
                        if (s.voc > 250) parts.push(`Niveau VOC > ${Math.round(s.voc)} ppb`);
                        if (s.temp > 40) parts.push(`Température > ${Math.round(s.temp)} °C`);

                        const riskParts: string[] = [];
                        if (s.co2 > 1000) riskParts.push('ATMOSPHÈRE CONFINÉE');
                        if (s.voc > 250) riskParts.push('RISQUE TOXIQUE DÉTECTÉ');
                        if (s.temp > 40) riskParts.push('RISQUE DE SURCHAUFFE');

                        const suffix = riskParts.length ? `   —   ${riskParts.join('   •   ')}` : '';
                        return `${parts.join('   •   ')}${suffix}`;
                      })()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="hidden sm:block text-[10px] font-mono text-red-100/70 tracking-widest uppercase">Live: {lastUpdate}</div>
                  <div className="bg-white text-red-700 font-black text-[10px] md:text-xs px-4 py-2 rounded-xl shadow-lg">
                    ⚠️ INTERVENTION REQUISE
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`rounded-2xl border px-6 py-4 flex items-center justify-between transition-all duration-500 ${bannerClass}`}>
              <div className="flex items-center gap-4">
                {bannerIcon}
                <div>
                  <p className="font-bold text-sm uppercase">{bannerTitle}</p>
                  <p className="text-[11px] text-slate-400">{bannerDesc}</p>
                </div>
              </div>
              <div className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">Live: {lastUpdate}</div>
            </div>
          )}

          {isPaused ? (
            <div className="rounded-2xl border border-blue-700/40 bg-blue-950/20 px-5 py-3 flex items-center justify-between gap-4 shadow-lg">
              <p className="text-xs text-slate-200">
                Mode Historique : Affichage des données de {pausedLabel ?? '--:--:--'}
              </p>
              <button
                type="button"
                onClick={handleReturnToLive}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-300"
              >
                RETOUR AU DIRECT
              </button>
            </div>
          ) : null}

          {/* JAUGES */}
          {displayedReadings && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GaugeCard title="CO2" value={displayedReadings.co2} unit="ppm" orangeThreshold={800} redThreshold={1000} icon={<Wind size={18}/>} />

              <GaugeCard title="VOC" value={displayedReadings.voc} unit="ppb" orangeThreshold={150} redThreshold={250} icon={<Gauge size={18}/>} />
              <GaugeCard title="Température" value={displayedReadings.temp} unit="°C" orangeThreshold={35} redThreshold={38} icon={<ThermometerSun size={18}/>} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-3xl p-6 shadow-lg h-[450px] flex flex-col">
              <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-2"><Activity size={14} className="text-blue-500"/> Analyse temporelle : {selectedStation}</h2>
                <ReportPdfButton zoneName={selectedStation} history={history} />
              </div>
              <div className="flex-1 min-h-0">
                {history && (
                  <Line 
                    ref={lineChartRef}
                    data={{
                      labels: history.labels,
                      datasets: [
                        { label: 'CO2', data: history.co2, borderColor: '#ef4444', yAxisID: 'y', tension: 0.4, pointRadius: 0, pointHitRadius: 12, pointHoverRadius: 5, fill: false },
                        { label: 'VOC', data: history.voc, borderColor: '#a855f7', yAxisID: 'y', tension: 0.4, pointRadius: 0, pointHitRadius: 12, pointHoverRadius: 5, fill: false },
                        { label: 'Temp', data: history.temp, borderColor: '#f59e0b', yAxisID: 'y1', tension: 0.4, pointRadius: 0, pointHitRadius: 12, pointHoverRadius: 5, fill: false }
                      ]
                    }} 
                    options={{ 
                      responsive: true, 
                      maintainAspectRatio: false, 
                      animation: { duration: 0 }, 
                      interaction: { mode: 'nearest', intersect: false },
                      scales: { 
                        x: {
                          ticks: {
                            color: '#94a3b8',
                            maxTicksLimit: 8,
                            maxRotation: 0,
                            minRotation: 0,
                          },
                          grid: { color: 'rgba(255,255,255,0.03)' },
                        },
                        y: { min: 0, max: 1300, grid: { color: 'rgba(255,255,255,0.05)' } }, 
                        y1: { position: 'right', min: 10, max: 50, grid: { display: false } } 
                      }, 
                      plugins: { 
                        legend: { display: true, position: 'top', labels: { color: '#94a3b8', font: { size: 10 } } }, 
                        tooltip: { enabled: false } 
                      }, 
                      onClick: handleChartClick 
                    }} 
                  />
                )}
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-lg flex flex-col">
              <h2 className="text-[10px] font-bold uppercase text-slate-500 mb-6 tracking-widest">Capteurs</h2>
              <div className="space-y-3">
                {STATIONS.map(name => {
                  const data = snapshotByStation[name];
                  const isRed = data && (data.co2 >= 1000 || data.temp >= 38 || data.voc >= 250);
                  const isOrange = data && !isRed && (data.co2 >= 800 || data.temp >= 35 || data.voc >= 150);
                  
                  let dotClass = "bg-emerald-500 shadow-[0_0_8px_#10b981]";
                  if (isRed) dotClass = "bg-red-500 animate-pulse shadow-[0_0_10px_#ef4444]";
                  else if (isOrange) dotClass = "bg-orange-500 shadow-[0_0_10px_#f59e0b]";

                  return (
                    <button key={name} onClick={() => setSelectedStation(name)} className={`w-full p-5 rounded-2xl border transition-all text-left flex justify-between items-center ${selectedStation === name ? 'bg-blue-600/20 border-blue-500 shadow-md' : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${selectedStation === name ? 'bg-blue-500 text-white' : 'bg-slate-700/50 text-slate-400'}`}>
                          {name === 'Cuisine' && <Utensils size={18}/>} {name === 'Restaurant' && <Coffee size={18}/>} {name === 'Couloir 1' && <DoorOpen size={18}/>}
                        </div>
                        <span className={`text-sm font-bold tracking-tight ${selectedStation === name ? 'text-white' : 'text-slate-400'}`}>{name}</span>
                      </div>
                      <span className={`w-2.5 h-2.5 rounded-full transition-colors duration-500 ${dotClass}`}></span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}