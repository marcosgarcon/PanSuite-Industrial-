
import React, { useState } from 'react';

const SimulationEngine: React.FC = () => {
  const [simRunning, setSimRunning] = useState(false);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
           <div>
             <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter">JaamSim Digital Twin</h2>
             <p className="text-blue-300 font-bold uppercase text-[10px] tracking-widest">Simulação de Eventos Discretos - Linha 04</p>
           </div>
           <button 
             onClick={() => setSimRunning(!simRunning)}
             className={`px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl ${simRunning ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-green-500 hover:bg-green-600 shadow-green-500/20'}`}
           >
             {simRunning ? <i className="fa-solid fa-stop mr-2"></i> : <i className="fa-solid fa-play mr-2"></i>}
             {simRunning ? 'Parar Simulação' : 'Iniciar Gêmeo Digital'}
           </button>
        </div>
        <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
           <i className="fa-solid fa-diagram-project text-[300px] absolute -bottom-20 -right-20"></i>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resource Monitor */}
        <div className="lg:col-span-2 bg-white border rounded-[2.5rem] p-8 shadow-sm">
           <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8">Process Flow Visualization</h3>
           <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-20 relative">
              {/* Connector lines simulation */}
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-100 -z-10"></div>
              
              {[
                { name: 'Inbound', icon: 'fa-truck-ramp-box', status: 'FLOWING' },
                { name: 'Buffer A', icon: 'fa-box-archive', status: '85% CAPACITY' },
                { name: 'Assembly', icon: 'fa-robot', status: 'PROCESSING', active: true },
                { name: 'Quality Hub', icon: 'fa-clipboard-check', status: 'WAITING' },
              ].map((node, i) => (
                <div key={i} className={`flex flex-col items-center gap-4 p-6 rounded-3xl bg-white border shadow-sm transition-all ${node.active && simRunning ? 'border-blue-500 scale-110 shadow-blue-100 ring-4 ring-blue-50' : 'border-gray-50'}`}>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${node.active && simRunning ? 'bg-blue-600 text-white animate-pulse' : 'bg-gray-100 text-gray-400'}`}>
                    <i className={`fa-solid ${node.icon}`}></i>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-gray-900 uppercase tracking-tighter">{node.name}</p>
                    <p className="text-[8px] font-bold text-blue-500 uppercase mt-1">{node.status}</p>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Bottleneck Analysis */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl">
           <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-8">Simulation Stats</h3>
           <div className="space-y-6">
              {[
                { label: 'Throughput', val: '450 u/hr', target: '500' },
                { label: 'Lead Time', val: '12.4 min', target: '10.0' },
                { label: 'Work-In-Process', val: '142 units', target: '120' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase">{stat.label}</span>
                    <span className="text-sm font-black">{stat.val}</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-2/3"></div>
                  </div>
                </div>
              ))}
           </div>

           <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <i className="fa-solid fa-triangle-exclamation"></i> Bottleneck Detected
              </p>
              <p className="text-xs font-medium text-slate-400 leading-relaxed">
                Resource "Assembly Robot B" is exceeding 94% utilization. Consider re-routing buffer overflow to Aux Line.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationEngine;
