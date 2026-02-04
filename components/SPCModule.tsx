
import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { calculateStats } from '../services/statsEngine';
import { generateRCA } from '../services/geminiService';

const SPCModule: React.FC = () => {
  const [measurements, setMeasurements] = useState<{name: string, value: number, machine: string, lot: string}[]>([]);
  const [newValue, setNewValue] = useState<string>('');
  const [lotNum, setLotNum] = useState<string>('LOT-2025-001');
  const [machineId, setMachineId] = useState<string>('WM-INJ-04');
  const [spec, setSpec] = useState({ usl: 10.5, lsl: 9.5, nominal: 10.0 });
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const stats = useMemo(() => {
    return calculateStats(measurements.map(m => m.value), spec.usl, spec.lsl);
  }, [measurements, spec]);

  const handleAdd = () => {
    const val = parseFloat(newValue);
    if (!isNaN(val)) {
      setMeasurements(prev => [...prev, { 
        name: (prev.length + 1).toString(), 
        value: val,
        machine: machineId,
        lot: lotNum
      }]);
      setNewValue('');
    }
  };

  const getRCA = async () => {
    if (measurements.length < 3) return;
    setIsAnalyzing(true);
    try {
      const res = await generateRCA(measurements, stats?.status || 'UNKNOWN');
      setAiAnalysis(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearData = () => {
    if (window.confirm('Clear all data points for this series?')) {
      setMeasurements([]);
      setAiAnalysis(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header Info */}
      <div className="bg-white p-6 rounded-3xl border shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center">
            <i className="fa-solid fa-microscope text-xl"></i>
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter leading-none">CEP - Controle Estatístico</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Análise de Capabilidade em Tempo Real</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Lot</p>
            <p className="text-sm font-bold text-gray-800">{lotNum}</p>
          </div>
          <div className="w-[1px] h-8 bg-gray-200 mx-2 self-center"></div>
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Machine ID</p>
            <p className="text-sm font-bold text-gray-800">{machineId}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sidebar: Entry & Parameters */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-3xl border shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
              <i className="fa-solid fa-sliders text-blue-600"></i> Setup de Parâmetros
            </h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 block">Nominal Spec (mm)</label>
                  <input 
                    type="number" step="0.001" value={spec.nominal} 
                    onChange={e => setSpec({...spec, nominal: parseFloat(e.target.value)})}
                    className="w-full p-4 bg-blue-50 border border-blue-100 rounded-2xl text-lg font-black text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 block">Tol. Inferior (LSL)</label>
                  <input 
                    type="number" step="0.001" value={spec.lsl} 
                    onChange={e => setSpec({...spec, lsl: parseFloat(e.target.value)})}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 block">Tol. Superior (USL)</label>
                  <input 
                    type="number" step="0.001" value={spec.usl} 
                    onChange={e => setSpec({...spec, usl: parseFloat(e.target.value)})}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="pt-6 border-t">
                 <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 block">Leitura do Paquímetro / Instrumento</label>
                 <div className="flex gap-2">
                    <input 
                      type="number" step="0.001" value={newValue} 
                      onChange={e => setNewValue(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && handleAdd()}
                      placeholder="0.000"
                      className="flex-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl text-2xl font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button 
                      onClick={handleAdd}
                      className="w-16 h-16 bg-blue-900 text-white rounded-2xl flex items-center justify-center text-xl hover:bg-blue-800 transition-all hover:scale-105 shadow-lg shadow-blue-900/20"
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button>
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border shadow-sm">
            <div className="flex justify-between items-center mb-4 px-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Log de Medições</h3>
              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{measurements.length} PTS</span>
            </div>
            <div className="max-h-80 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {measurements.map((m, i) => {
                const isNok = m.value < spec.lsl || m.value > spec.usl;
                return (
                  <div key={i} className={`p-4 rounded-2xl border flex items-center justify-between transition-all hover:translate-x-1 ${isNok ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] font-black text-gray-400 shadow-sm border">
                        {i + 1}
                      </span>
                      <span className={`font-black text-lg ${isNok ? 'text-red-600' : 'text-gray-900'}`}>{m.value.toFixed(3)}</span>
                    </div>
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${isNok ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
                      {isNok ? 'FORA' : 'OK'}
                    </span>
                  </div>
                );
              })}
              {measurements.length === 0 && (
                <div className="py-12 text-center text-gray-300 italic text-xs font-medium uppercase tracking-widest">Aguardando dados...</div>
              )}
            </div>
            <button 
              onClick={clearData}
              className="w-full mt-6 py-3 border border-dashed border-gray-200 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:border-red-300 hover:text-red-500 transition-all rounded-xl"
            >
              Limpar Lote Atual
            </button>
          </div>
        </div>

        {/* Content: Main Chart & Stats */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Indice Cp', val: stats?.cp || '---', icon: 'fa-chart-area', alert: parseFloat(stats?.cp || '0') < 1.33 },
              { label: 'Indice Cpk', val: stats?.cpk || '---', icon: 'fa-gauge-simple-high', alert: parseFloat(stats?.cpk || '0') < 1.33 },
              { label: 'Média (X)', val: stats?.mean || '---', icon: 'fa-calculator' },
              { label: 'Status Fit', val: stats?.status || 'EMPTY', icon: 'fa-shield-halved', status: true },
            ].map((kpi, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border shadow-sm relative overflow-hidden">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                <p className={`text-2xl font-black tracking-tighter ${kpi.alert ? 'text-red-600' : kpi.status && kpi.val === 'OPTIMAL' ? 'text-green-600' : 'text-gray-900'}`}>
                  {kpi.val}
                </p>
                <i className={`fa-solid ${kpi.icon} absolute -bottom-2 -right-2 text-4xl opacity-[0.03]`}></i>
              </div>
            ))}
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm h-[480px] flex flex-col relative">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
                 <i className="fa-solid fa-chart-line text-blue-600"></i> Gráfico de Tendência (X-Bar)
               </h3>
               <div className="flex gap-4">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-blue-900"></span> Medição
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span> Tolerâncias
                 </div>
               </div>
            </div>
            
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={measurements} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} 
                    dy={10}
                  />
                  <YAxis 
                    domain={[spec.lsl - 0.1, spec.usl + 0.1]} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '16px' }}
                    itemStyle={{ fontWeight: 'black', fontSize: '14px' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <ReferenceLine y={spec.usl} stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" label={{ value: 'USL', position: 'right', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
                  <ReferenceLine y={spec.lsl} stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" label={{ value: 'LSL', position: 'right', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
                  <ReferenceLine y={spec.nominal} stroke="#0ea5e9" strokeWidth={1} label={{ value: 'NOM', position: 'left', fill: '#0ea5e9', fontSize: 10, fontWeight: 'bold' }} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#004098" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: '#004098', strokeWidth: 3, stroke: '#fff' }} 
                    activeDot={{ r: 10, strokeWidth: 0 }} 
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                     <i className="fa-solid fa-wand-magic-sparkles"></i>
                   </div>
                   <h3 className="text-blue-400 text-xs font-black uppercase tracking-[0.3em]">IA Industrial Assistant</h3>
                </div>
                {isAnalyzing ? (
                  <div className="space-y-4">
                    <div className="h-4 bg-white/5 rounded-full w-full animate-pulse"></div>
                    <div className="h-4 bg-white/5 rounded-full w-4/5 animate-pulse"></div>
                    <div className="h-4 bg-white/5 rounded-full w-2/3 animate-pulse"></div>
                  </div>
                ) : aiAnalysis ? (
                  <div className="text-sm font-medium leading-relaxed prose prose-invert max-w-none">
                    <p className="whitespace-pre-wrap text-slate-300">{aiAnalysis}</p>
                  </div>
                ) : (
                  <p className="text-slate-500 italic text-sm font-medium">Capture ao menos 3 pontos para análise de causa raiz via Inteligência Artificial Panasonic.</p>
                )}
              </div>
              <button 
                onClick={getRCA}
                disabled={measurements.length < 3 || isAnalyzing}
                className="whitespace-nowrap px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-blue-500 disabled:opacity-30 transition-all flex items-center gap-3 shadow-xl shadow-blue-500/30 active:scale-95"
              >
                {isAnalyzing ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-robot"></i>}
                Executar RCA Engine
              </button>
            </div>
            {/* Background design */}
            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
               <i className="fa-solid fa-brain text-[250px] absolute -bottom-20 -right-20 rotate-12 text-blue-500"></i>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SPCModule;
