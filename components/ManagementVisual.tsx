
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const PARETO_DATA = [
  { name: 'Scratch', count: 45 },
  { name: 'Dent', count: 32 },
  { name: 'Dim. Error', count: 18 },
  { name: 'Coating', count: 12 },
  { name: 'Others', count: 5 },
];

const BU_PERFORMANCE = [
  { name: 'Washing M.', score: 92 },
  { name: 'Ref.', score: 88 },
  { name: 'Cooking', score: 95 },
  { name: 'QA Lab', score: 99 },
];

const COLORS = ['#004098', '#E11D48', '#0F172A', '#64748B', '#94A3B8'];

const ManagementVisual: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Gestão à Vista (BI)</h2>
          <p className="text-gray-500">Corporate Quality Dashboard - Real-time monitoring</p>
        </div>
        <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
          <span className="text-xs font-bold uppercase tracking-widest">Live Updates</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Yield Rate', val: '98.2%', icon: 'fa-chart-pie', color: 'text-green-600' },
          { label: 'Avg Cpk', val: '1.45', icon: 'fa-compass', color: 'text-blue-600' },
          { label: 'Total Defects', val: '112', icon: 'fa-bug', color: 'text-red-600' },
          { label: 'Uptime', val: '94.5%', icon: 'fa-bolt', color: 'text-yellow-600' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border shadow-sm">
            <div className="flex justify-between mb-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{kpi.label}</span>
              <i className={`fa-solid ${kpi.icon} ${kpi.color}`}></i>
            </div>
            <p className="text-3xl font-black text-gray-900">{kpi.val}</p>
            <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-900 w-3/4"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pareto Defects */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-8 flex justify-between items-center">
            Defects Pareto Analysis
            <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded">TOP 5</span>
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PARETO_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {PARETO_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BU Performance */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
           <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-8">Process Compliance by BU</h3>
           <div className="space-y-6">
             {BU_PERFORMANCE.map((bu, i) => (
               <div key={i}>
                 <div className="flex justify-between mb-2">
                   <span className="text-sm font-bold text-gray-700 uppercase tracking-tight">{bu.name}</span>
                   <span className="text-sm font-black text-blue-900">{bu.score}%</span>
                 </div>
                 <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-blue-900 transition-all duration-1000" 
                     style={{ width: `${bu.score}%` }}
                   ></div>
                 </div>
               </div>
             ))}
           </div>
           
           <div className="mt-12 p-4 bg-gray-900 rounded-xl text-white flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                 <i className="fa-solid fa-award"></i>
               </div>
               <div>
                 <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Global Top BU</p>
                 <p className="text-sm font-bold">QA Laboratory Cluster</p>
               </div>
             </div>
             <i className="fa-solid fa-chevron-right text-gray-500"></i>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementVisual;
