
import React, { useState } from 'react';
import { generateRCA } from '../services/geminiService';

const AdvancedAnalytics: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const runAnalysis = async () => {
    setAnalyzing(true);
    // Simulate complex data analysis via Gemini
    const res = await generateRCA([], 'ADVANCED_RESEARCH_REQUEST');
    setReport(res);
    setAnalyzing(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Jamovi Advanced Analytics</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Industrial R&D Hypothesis Testing</p>
        </div>
        <button 
          onClick={runAnalysis}
          disabled={analyzing}
          className="px-8 py-4 bg-blue-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
        >
          {analyzing ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-bolt"></i>}
          Executar Teste ANOVA
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Spreadsheet Data View */}
        <div className="lg:col-span-8 bg-white border rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
           <div className="bg-gray-50 border-b p-4 flex gap-4">
             <span className="px-3 py-1 bg-white border rounded text-[10px] font-black text-gray-500 uppercase">Variable 1</span>
             <span className="px-3 py-1 bg-white border rounded text-[10px] font-black text-gray-500 uppercase">Yield Rate</span>
             <span className="px-3 py-1 bg-white border rounded text-[10px] font-black text-gray-500 uppercase">Temp. °C</span>
           </div>
           <div className="flex-1 p-8 text-center flex flex-col items-center justify-center">
             <div className="grid grid-cols-3 gap-2 opacity-10 mb-8">
               {[...Array(12)].map((_, i) => <div key={i} className="w-24 h-8 bg-slate-900 rounded-md"></div>)}
             </div>
             <p className="text-gray-400 text-sm font-bold uppercase tracking-[0.3em]">Data Matrix View (Standard Jamovi Format)</p>
             <p className="text-gray-300 text-[10px] mt-2 font-medium">Pronto para processamento de regressão linear múltipla</p>
           </div>
        </div>

        {/* Results Sidebar */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl min-h-[400px] relative overflow-hidden">
             <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-6 flex items-center gap-2">
               <i className="fa-solid fa-square-poll-vertical"></i> Statistical Output
             </h3>
             {report ? (
               <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                 {report}
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center h-full opacity-30 text-center">
                 <i className="fa-solid fa-magnifying-glass-chart text-5xl mb-4"></i>
                 <p className="text-xs font-black uppercase tracking-widest">Nenhum resultado gerado</p>
               </div>
             )}
             <i className="fa-solid fa-chart-area absolute -bottom-10 -left-10 text-[200px] opacity-5"></i>
           </div>

           <div className="bg-white border rounded-3xl p-6 shadow-sm">
             <h4 className="text-[10px] font-black text-gray-400 uppercase mb-4">Quick Stats (Correlations)</h4>
             <div className="space-y-3">
               <div className="flex items-center justify-between">
                 <span className="text-xs font-bold text-gray-600">P-Value</span>
                 <span className="text-xs font-black text-green-600">0.024</span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-xs font-bold text-gray-600">F-Statistic</span>
                 <span className="text-xs font-black text-blue-900">12.45</span>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
