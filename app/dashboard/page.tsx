'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import axios from 'axios';
import { Doughnut, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import { AlertOctagon, CheckCircle, Activity, ThermometerSun, Gauge, Wind } from 'lucide-react';
import Navbar from '../components/Navbar';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

interface PollutionData {
  nom_station: string;
  nom_polluant: string;
  valeur: number;
  unite: string;
  seuil_danger?: number;
}

type LiveReadings = {
  stationName: string;
  co2: number;
  co2Unit: string;
  co2Threshold: number;
  voc: number;
  vocUnit: string;
  vocThreshold: number;
  temp: number;
  tempUnit: string;
  tempThreshold: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function buildSimulatedHistory(current: number, points: number, min: number, max: number) {
  // Dernier point = valeur réelle API. Les points précédents sont un bruit réaliste autour.
  const out: number[] = new Array(points).fill(0);
  let v = current;
  for (let i = points - 1; i >= 0; i -= 1) {
    if (i === points - 1) {
      out[i] = clamp(current, min, max);
      continue;
    }

    const range = max - min;
    const noise = (Math.random() - 0.5) * (range * 0.03);
    v = clamp(v + noise, min, max);
    out[i] = Math.round(v * 10) / 10;
  }
  return out;
}

function formatMinuteLabels(points: number) {
  const now = new Date();
  const labels: string[] = [];
  for (let i = points - 1; i >= 0; i -= 1) {
    const d = new Date(now.getTime() - i * 60_000);
    labels.push(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }
  return labels;
}

function normalizeReadings(raw: PollutionData[]): LiveReadings | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const findBy = (predicate: (p: PollutionData) => boolean) =>
    raw.find(p => {
      try {
        return predicate(p);
      } catch {
        return false;
      }
    });

  const co2 = findBy(p => p?.nom_polluant?.toLowerCase().includes('co2'));
  const voc = findBy(p => p?.nom_polluant?.toLowerCase().includes('voc'));
  const temp = findBy(p => p?.nom_polluant?.toLowerCase().includes('temp'));

  if (!co2 || !voc || !temp) return null;

  return {
    stationName: co2.nom_station ?? 'Station',
    co2: Number.isFinite(co2.valeur) ? co2.valeur : 0,
    co2Unit: co2.unite ?? 'ppm',
    co2Threshold: Number.isFinite(co2.seuil_danger) ? (co2.seuil_danger as number) : 1000,
    voc: Number.isFinite(voc.valeur) ? voc.valeur : 0,
    vocUnit: voc.unite ?? 'ppb',
    vocThreshold: Number.isFinite(voc.seuil_danger) ? (voc.seuil_danger as number) : 250,
    temp: Number.isFinite(temp.valeur) ? temp.valeur : 0,
    tempUnit: temp.unite ?? '°C',
    tempThreshold: Number.isFinite(temp.seuil_danger) ? (temp.seuil_danger as number) : 40,
  };
}

function GaugeCard(props: {
  title: string;
  value: number;
  unit: string;
  max: number;
  threshold: number;
  baseColor: string;
  icon: ReactNode;
}) {
  const { title, value, unit, max, threshold, baseColor, icon } = props;
  const safeValue = Number.isFinite(value) ? value : 0;
  const isDanger = safeValue > threshold;
  const ringColor = isDanger ? '#ef4444' : '#10b981';
  const remainder = clamp(max - safeValue, 0, max);

  const chartData = {
    labels: [title, 'Reste'],
    datasets: [
      {
        data: [clamp(safeValue, 0, max), remainder],
        backgroundColor: [ringColor, 'rgba(148, 163, 184, 0.15)'],
        borderWidth: 0,
        hoverOffset: 0,
      },
    ],
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 tracking-wider">{title}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-2xl font-bold text-white font-mono">{Math.round(safeValue * 10) / 10}</p>
            <p className="text-xs text-slate-400">{unit}</p>
          </div>
          <p className={`mt-1 text-xs ${isDanger ? 'text-red-400' : 'text-emerald-400'}`}>
            {isDanger ? `Seuil dépassé (> ${threshold})` : `OK (≤ ${threshold})`}
          </p>
        </div>
        <div className="text-slate-300">{icon}</div>
      </div>

      <div className="mt-4 relative h-44">
        <Doughnut
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
              legend: { display: false },
              tooltip: { enabled: false },
            },
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-sm font-semibold" style={{ color: ringColor }}>
            {Math.round((clamp(safeValue, 0, max) / max) * 100)}%
          </p>
          <p className="text-[11px] text-slate-400">de {max}</p>
        </div>
        <div
          className="absolute bottom-3 right-3 h-2 w-2 rounded-full"
          style={{ backgroundColor: baseColor }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [rawData, setRawData] = useState<PollutionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readings, setReadings] = useState<LiveReadings | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const fetchInFlightRef = useRef(false);
  const POINTS = 20;
  const REFRESH_MS = 3000;
  const [history, setHistory] = useState<{
    labels: string[];
    co2: number[];
    voc: number[];
    temp: number[];
  } | null>(null);

  const fetchData = useCallback(async () => {
    if (fetchInFlightRef.current) return;
    fetchInFlightRef.current = true;

    try {
      setError(null);
      const response = await axios.get<PollutionData[]>('/api/pollution');
      const normalized = normalizeReadings(response.data);
      setRawData(response.data);

      if (!normalized) {
        setReadings(null);
        setHistory(null);
        setError("Données capteurs incomplètes.");
        setLoading(false);
        return;
      }

      setReadings(normalized);
      const now = new Date();
      setLastUpdatedAt(now);

      const nextLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setHistory(prev => {
        if (
          !prev ||
          prev.labels.length !== POINTS ||
          prev.co2.length !== POINTS ||
          prev.voc.length !== POINTS ||
          prev.temp.length !== POINTS
        ) {
          const labels = Array.from({ length: POINTS }, (_, i) => {
            const d = new Date(now.getTime() - (POINTS - 1 - i) * REFRESH_MS);
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          });

          return {
            labels,
            co2: buildSimulatedHistory(normalized.co2, POINTS, 0, 2000),
            voc: buildSimulatedHistory(normalized.voc, POINTS, 0, 2000),
            temp: buildSimulatedHistory(normalized.temp, POINTS, 0, 50),
          };
        }

        const next = {
          labels: [...prev.labels.slice(1), nextLabel],
          co2: [...prev.co2.slice(1), Math.round(clamp(normalized.co2, 0, 2000) * 10) / 10],
          voc: [...prev.voc.slice(1), Math.round(clamp(normalized.voc, 0, 2000) * 10) / 10],
          temp: [...prev.temp.slice(1), Math.round(clamp(normalized.temp, 0, 50) * 10) / 10],
        };

        return next;
      });

      setLoading(false);
    } catch (error) {
      console.error(error);
      setError("Impossible de contacter l'API /api/pollution.");
      setLoading(false);
    } finally {
      fetchInFlightRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, REFRESH_MS);
    return () => clearInterval(intervalId);
  }, [fetchData]);

  const isDanger =
    readings != null &&
    (readings.co2 > readings.co2Threshold || readings.temp > readings.tempThreshold || readings.voc > readings.vocThreshold);

  const lineChartData =
    history && readings
      ? {
          labels: history.labels,
          datasets: [
            {
              label: `CO2 (${readings.co2Unit})`,
              data: history.co2,
              yAxisID: 'y',
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              pointRadius: 2,
              pointHoverRadius: 4,
              tension: 0.35,
              fill: true,
            },
            {
              label: `VOC (${readings.vocUnit})`,
              data: history.voc,
              yAxisID: 'y',
              borderColor: '#a855f7',
              backgroundColor: 'rgba(168, 85, 247, 0.12)',
              pointRadius: 2,
              pointHoverRadius: 4,
              tension: 0.35,
              fill: true,
            },
            {
              label: `Température (${readings.tempUnit})`,
              data: history.temp,
              yAxisID: 'y1',
              borderColor: '#f59e0b',
              backgroundColor: 'rgba(245, 158, 11, 0.10)',
              pointRadius: 2,
              pointHoverRadius: 4,
              tension: 0.35,
              fill: false,
            },
          ],
        }
      : null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      
        {/* CONTENU PRINCIPAL */}
        <div className="max-w-7xl mx-auto p-6 space-y-8">
        
          {loading ? (
             <div className="flex flex-col items-center justify-center h-64 gap-4">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
               <p className="animate-pulse text-slate-400">Connexion aux capteurs...</p>
             </div>
          ) : (
            <>
              {/* Bandeau Statut Global */}
              <div
                className={`rounded-2xl border px-5 py-4 flex items-center justify-between gap-4 shadow-lg ${
                  isDanger ? 'bg-red-950/30 border-red-700/60' : 'bg-emerald-950/20 border-emerald-700/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isDanger ? (
                    <AlertOctagon className="text-red-400" />
                  ) : (
                    <CheckCircle className="text-emerald-400" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {isDanger ? 'Danger' : 'Air Sain'}
                    </p>
                    <p className="text-xs text-slate-300">
                      {readings?.stationName ?? 'Station'}
                      {isDanger
                        ? " — au moins un seuil est dépassé (ventilation recommandée)"
                        : " — tous les seuils sont sous contrôle"}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  Dernière mise à jour:{' '}
                  {lastUpdatedAt
                    ? lastUpdatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : '--:--'}
                </div>
              </div>

              {error ? (
                <div className="rounded-2xl border border-amber-700/40 bg-amber-950/20 p-5 text-amber-200 text-sm">
                  {error}
                </div>
              ) : null}

              {/* Jauges (Doughnut) */}
              {readings ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <GaugeCard
                    title="CO2"
                    value={readings.co2}
                    unit={readings.co2Unit}
                    max={2000}
                    threshold={readings.co2Threshold}
                    baseColor="#ef4444"
                    icon={<Wind className="h-8 w-8" />}
                  />
                  <GaugeCard
                    title="VOC"
                    value={readings.voc}
                    unit={readings.vocUnit}
                    max={2000}
                    threshold={readings.vocThreshold}
                    baseColor="#a855f7"
                    icon={<Gauge className="h-8 w-8" />}
                  />
                  <GaugeCard
                    title="Température"
                    value={readings.temp}
                    unit={readings.tempUnit}
                    max={50}
                    threshold={readings.tempThreshold}
                    baseColor="#f59e0b"
                    icon={<ThermometerSun className="h-8 w-8" />}
                  />
                </div>
              ) : null}

              {/* GRAPHIQUE ET LISTE */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[500px]">
                
                {/* Colonne Gauche : Graphique principal */}
                <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col">
                  <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Activity className="text-blue-500"/> Analyse des polluants
                  </h2>
                  <div className="flex-1 min-h-0">
                    {lineChartData ? (
                      <Line
                        data={lineChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          animation: false,
                          interaction: { mode: 'index', intersect: false },
                          plugins: {
                            legend: {
                              display: true,
                              labels: { color: '#cbd5e1', boxWidth: 10, boxHeight: 10 },
                            },
                            tooltip: {
                              enabled: true,
                              backgroundColor: 'rgba(2, 6, 23, 0.9)',
                              borderColor: 'rgba(148, 163, 184, 0.25)',
                              borderWidth: 1,
                              titleColor: '#e2e8f0',
                              bodyColor: '#e2e8f0',
                            },
                          },
                          scales: {
                            x: {
                              grid: { display: false },
                              ticks: { color: '#94a3b8', maxTicksLimit: 8, minRotation: 0, maxRotation: 0 },
                            },
                            y: {
                              position: 'left',
                              min: 0,
                              max: 2000,
                              grid: { color: 'rgba(51, 65, 85, 0.6)' },
                              ticks: { color: '#94a3b8' },
                              title: { display: true, text: 'CO2 / VOC', color: '#94a3b8' },
                            },
                            y1: {
                              position: 'right',
                              min: 0,
                              max: 50,
                              grid: { drawOnChartArea: false },
                              ticks: { color: '#94a3b8' },
                              title: { display: true, text: 'Température (°C)', color: '#94a3b8' },
                            },
                          },
                        }}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400">
                        Données indisponibles.
                      </div>
                    )}
                  </div>
                </div>

                {/* Colonne Droite : Liste détaillée */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg overflow-hidden flex flex-col">
                  <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Wind className="text-blue-500"/> Détails (instant T)
                  </h2>
                  <div className="overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {rawData.map((item, idx) => {
                      const v = Number.isFinite(item?.valeur) ? item.valeur : 0;
                      const threshold = Number.isFinite(item?.seuil_danger) ? (item.seuil_danger as number) : undefined;
                      const itemDanger = threshold != null ? v > threshold : false;

                      return (
                        <div
                          key={idx}
                          className="p-3 bg-slate-800/50 rounded-lg flex justify-between items-center hover:bg-slate-800 transition-colors"
                        >
                          <div>
                            <p className="font-medium text-sm text-white">{item.nom_polluant}</p>
                            <p className="text-xs text-slate-400">{item.nom_station}</p>
                          </div>
                          <div className={`text-right ${itemDanger ? 'text-red-400' : 'text-sky-300'}`}>
                            <p className="font-bold font-mono text-lg">{Math.round(v * 10) / 10}</p>
                            <p className="text-[10px] text-slate-500">
                              {item.unite}
                              {threshold != null ? ` • seuil ${threshold}` : ''}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
