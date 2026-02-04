
import React, { useState, useEffect } from 'react';
import { TOOL_TEMPLATES } from '../constants';
import { SpreadsheetData } from '../types';

interface DashboardViewerProps {
  toolId: string;
  toolName: string;
}

const DashboardViewer: React.FC<DashboardViewerProps> = ({ toolId, toolName }) => {
  const [data, setData] = useState<SpreadsheetData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      const saved = localStorage.getItem(`EQPS_DATA_${toolId}`);
      
      if (saved) {
        setData(JSON.parse(saved));
      } else {
        const template = TOOL_TEMPLATES[toolId] || { headers: ['COL 1', 'COL 2'], rows: [['Data 1', 'Data 2']] };
        const processed = processLogic(template, toolId);
        setData(processed);
        localStorage.setItem(`EQPS_DATA_${toolId}`, JSON.stringify(processed));
      }
      setLoading(false);
    };
    loadData();
  }, [toolId]);

  const processLogic = (currentData: SpreadsheetData, id: string): SpreadsheetData => {
    const updatedRows = [...currentData.rows];
    if (id === 'fmea-dashboard') {
      return {
        ...currentData,
        rows: updatedRows.map(row => {
          const s = Number(row[3]) || 0;
          const o = Number(row[4]) || 0;
          const d = Number(row[5]) || 0;
          const newRow = [...row];
          newRow[6] = s * o * d;
          return newRow;
        })
      };
    }
    if (id === 'pareto-dashboard') {
      const sorted = [...updatedRows].sort((a, b) => Number(b[1]) - Number(a[1]));
      const total = sorted.reduce((acc, row) => acc + Number(row[1]), 0);
      let runningSum = 0;
      return {
        ...currentData,
        rows: sorted.map(row => {
          runningSum += Number(row[1]);
          const newRow = [...row];
          newRow[2] = total > 0 ? ((runningSum / total) * 100).toFixed(1) + '%' : '0%';
          return newRow;
        })
      };
    }
    return currentData;
  };

  const handleCellEdit = (rowIndex: number, colIndex: number, value: any) => {
    if (!data) return;
    const newRows = [...data.rows];
    newRows[rowIndex][colIndex] = value;
    const updatedData = processLogic({ ...data, rows: newRows }, toolId);
    setData(updatedData);
    localStorage.setItem(`EQPS_DATA_${toolId}`, JSON.stringify(updatedData));
  };

  const addRow = () => {
    if (!data) return;
    const emptyRow = new Array(data.headers.length).fill('');
    setData({ ...data, rows: [...data.rows, emptyRow] });
  };

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-6">
        <div className="w-16 h-16 border-4 border-[#002D72] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Sincronizando Módulo Operacional...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[1.5rem] bg-[#002D72] text-white flex items-center justify-center shadow-xl shadow-blue-900/20">
             <i className="fa-solid fa-table-columns text-2xl"></i>
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">{toolName}</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-3">Módulo de Entrada de Dados Digitais</p>
          </div>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={addRow}
             className="px-8 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3 shadow-sm"
           >
             <i className="fa-solid fa-plus text-[#005CB9]"></i> Novo Registro
           </button>
           <button className="px-8 py-4 bg-[#002D72] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:bg-[#001A41] transition-all">
             <i className="fa-solid fa-file-export mr-2"></i> Exportar Dados
           </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-900">
                {data.headers.map((header, i) => (
                  <th key={i} className="px-8 py-6 text-[9px] font-black text-blue-200 uppercase tracking-[0.3em] text-left border-b border-white/5">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="group hover:bg-blue-50/30 transition-all">
                  {row.map((cell, colIndex) => {
                    const isReadOnly = (toolId === 'fmea-dashboard' && colIndex === 6) || (toolId === 'pareto-dashboard' && colIndex === 2);
                    return (
                      <td key={colIndex} className="px-8 py-5">
                        <input 
                          type={typeof cell === 'number' ? 'number' : 'text'}
                          value={cell}
                          disabled={isReadOnly}
                          onChange={(e) => handleCellEdit(rowIndex, colIndex, e.target.value)}
                          className={`w-full bg-transparent font-bold text-sm outline-none transition-all border-b border-transparent focus:border-[#005CB9] pb-1
                            ${isReadOnly ? 'text-[#002D72] font-black' : 'text-slate-600'}
                          `}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {data.rows.length === 0 && (
            <div className="p-32 text-center flex flex-col items-center gap-6 text-slate-200">
              <i className="fa-solid fa-database text-8xl opacity-10"></i>
              <p className="font-black uppercase tracking-[0.5em] text-xs">Banco de Dados Vazio</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-900 p-8 rounded-[2.5rem] flex items-center justify-between shadow-2xl">
         <div className="flex gap-12">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Registros</span>
              <span className="text-xl font-black text-white">{data.rows.length}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Status Local</span>
              <span className="text-xl font-black text-green-400 flex items-center gap-2">
                <i className="fa-solid fa-cloud-check text-xs"></i> Salvo
              </span>
            </div>
         </div>
         <div className="text-right">
            <p className="text-[9px] text-blue-200/40 font-bold uppercase tracking-[0.2em] mb-1 italic">
              Panasonic Industrial Intelligence Engine v4.2
            </p>
            <p className="text-[8px] text-blue-200/20 font-black uppercase tracking-widest">
              Sincronizado via LocalStorage em: {new Date().toLocaleTimeString()}
            </p>
         </div>
      </div>
    </div>
  );
};

export default DashboardViewer;
