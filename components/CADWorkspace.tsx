
import React, { useState } from 'react';

const CADWorkspace: React.FC = () => {
  const [activeModel, setActiveModel] = useState('WM_CABINET_V2.step');
  
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">FreeCAD Integrated PLM</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">3D Environment & Parametric Design</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-blue-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/20">
             <i className="fa-solid fa-download mr-2"></i> Export Step
           </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Tree View */}
        <div className="col-span-12 lg:col-span-3 bg-white border rounded-3xl p-6 shadow-sm">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <i className="fa-solid fa-folder-tree"></i> Part Hierarchy
          </h3>
          <div className="space-y-2">
            {[
              { name: 'Base Assembly', active: true },
              { name: 'Internal Chassis', active: false },
              { name: 'Top Cover Plate', active: false },
              { name: 'Mounting Screws (x8)', active: false },
            ].map((item, i) => (
              <div key={i} className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${item.active ? 'bg-blue-50 border-blue-100 text-blue-900' : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100'}`}>
                <i className={`fa-solid ${item.name.includes('Assembly') ? 'fa-layer-group' : 'fa-cube'} text-xs`}></i>
                <span className="text-xs font-bold">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3D Viewport Placeholder */}
        <div className="col-span-12 lg:col-span-6 bg-slate-900 rounded-[2.5rem] relative overflow-hidden flex flex-col items-center justify-center min-h-[500px] border-[8px] border-white shadow-2xl">
           <div className="absolute top-6 left-6 flex flex-col gap-2">
             <span className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black text-white/50 uppercase tracking-widest border border-white/10">XYZ: 0.00, 45.2, -12.1</span>
             <span className="px-3 py-1 bg-green-500/20 rounded-full text-[9px] font-black text-green-400 uppercase tracking-widest border border-green-500/30">Mesh OK</span>
           </div>
           
           <div className="text-center group cursor-pointer">
              <i className="fa-solid fa-cube text-8xl text-blue-500/20 mb-6 group-hover:scale-110 group-hover:text-blue-500 transition-all duration-700 animate-bounce"></i>
              <p className="text-blue-400 font-black uppercase tracking-[0.4em] text-xs">3D Rendering Workspace</p>
              <p className="text-slate-500 text-[10px] mt-2 font-bold uppercase tracking-widest">FreeCAD WebGL API Connected</p>
           </div>

           <div className="absolute bottom-6 flex gap-3">
             <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-blue-600 transition-colors"><i className="fa-solid fa-rotate-left"></i></button>
             <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-blue-600 transition-colors"><i className="fa-solid fa-expand"></i></button>
             <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-blue-600 transition-colors"><i className="fa-solid fa-camera"></i></button>
           </div>
        </div>

        {/* Properties Panel */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-white border rounded-3xl p-6 shadow-sm">
             <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Parametric Data</h3>
             <div className="space-y-4">
                {[
                  { k: 'Material', v: 'SUS-304 Stainless' },
                  { k: 'Density', v: '7.85 g/cm³' },
                  { k: 'Tolerance', v: '+/- 0.05 mm' },
                  { k: 'Revision', v: 'B.04 (Stable)' }
                ].map((p, i) => (
                  <div key={i} className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{p.k}</span>
                    <span className="text-xs font-black text-gray-900">{p.v}</span>
                  </div>
                ))}
             </div>
          </div>
          
          <div className="bg-blue-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
             <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-2">Audit Status</p>
             <p className="text-sm font-bold">Aprovado para Produção (Fit Check OK)</p>
             <i className="fa-solid fa-check-double absolute -bottom-4 -right-4 text-6xl text-white/5"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CADWorkspace;
