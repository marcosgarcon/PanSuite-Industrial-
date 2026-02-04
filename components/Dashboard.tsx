
import React from 'react';
import { Tool, UserProfile, BusinessArea } from '../types';
import { TOOLS_REGISTRY } from '../constants';

interface DashboardProps {
  onSelectTool: (tool: Tool) => void;
  activeArea: BusinessArea | 'ALL';
  onSelectArea: (area: BusinessArea | 'ALL') => void;
  userProfile: UserProfile;
  installPrompt?: any;
  onInstall?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectTool, activeArea, userProfile, installPrompt, onInstall }) => {
  const filteredTools = TOOLS_REGISTRY.filter(tool => {
    const areaMatch = activeArea === 'ALL' || tool.area === activeArea;
    const profileMatch = tool.allowedProfiles.includes(userProfile);
    return areaMatch && profileMatch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      
      {/* Hero Modernizado */}
      <div className="relative bg-[#001A41] rounded-[3.5rem] p-16 overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-8">
             <span className="px-4 py-1.5 bg-blue-500 text-white rounded-full text-[9px] font-black uppercase tracking-[0.3em]">v4.5 Stable</span>
             <span className="text-blue-300/50 text-[9px] font-bold uppercase tracking-widest">PWA Instalado OK</span>
          </div>
          <h1 className="text-7xl font-black text-white leading-[1.1] tracking-tighter mb-8">
            Engenharia de <br/> <span className="text-[#005CB9] italic">Precisão Total.</span>
          </h1>
          <p className="text-xl text-blue-100/60 font-medium leading-relaxed mb-12 max-w-xl">
            Clique no ícone na sua área de trabalho para abrir instantaneamente. O EQPS funciona offline e sincroniza seus dados localmente.
          </p>
          
          {installPrompt && (
            <button 
              onClick={onInstall}
              className="px-10 py-5 bg-white text-[#002D72] rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center gap-4 shadow-2xl shadow-white/10 active:scale-95 mb-10"
            >
              <i className="fa-solid fa-desktop text-lg"></i>
              Adicionar Atalho à Área de Trabalho
            </button>
          )}

          <div className="flex flex-wrap gap-8">
             <div className="bg-white/5 p-6 rounded-3xl border border-white/10 min-w-[200px]">
               <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Acesso Rápido</p>
               <p className="text-3xl font-black text-white">INSTALÁVEL</p>
             </div>
             <div className="bg-white/5 p-6 rounded-3xl border border-white/10 min-w-[200px]">
               <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Modo Offline</p>
               <p className="text-3xl font-black text-white">ATIVO</p>
             </div>
          </div>
        </div>
      </div>

      {/* Grid de Ferramentas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredTools.map(tool => (
          <div 
            key={tool.id}
            onClick={() => onSelectTool(tool)}
            className="tool-card group bg-white rounded-[2.5rem] border border-slate-100 p-10 flex flex-col h-full cursor-pointer relative overflow-hidden active:scale-95"
          >
            <div className="mb-8 w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-[#002D72] group-hover:bg-[#002D72] group-hover:text-white transition-all duration-500 shadow-sm">
              <i className={`fa-solid ${tool.icon} text-2xl`}></i>
            </div>
            <h3 className="font-black text-xl mb-3 text-slate-900 tracking-tighter uppercase leading-none">{tool.name}</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 flex-1">{tool.description}</p>
            
            <div className="flex items-center justify-between mt-auto">
               <span className="text-[9px] font-black px-4 py-2 bg-slate-900 text-white rounded-xl uppercase tracking-widest">
                 {tool.area.split(' ')[0]}
               </span>
               <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                 <i className="fa-solid fa-chevron-right"></i>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
