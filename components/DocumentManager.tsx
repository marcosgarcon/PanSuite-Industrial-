
import React, { useState } from 'react';

const FOLDER_STRUCTURE = [
  { name: 'Technical Drawings', type: 'folder', children: [
    { name: 'WM-DRW-2024-X1.pdf', type: 'file', size: '2.4 MB', date: '2024-03-01' },
    { name: 'RF-SHEET-P5.dwg', type: 'file', size: '15.8 MB', date: '2024-02-15' },
  ]},
  { name: 'FITs (Process Standards)', type: 'folder', children: [
    { name: 'FIT-WM-LINE-1.pdf', type: 'file', size: '0.8 MB', date: '2024-01-20' },
  ]},
  { name: 'Control Charts', type: 'folder', children: [] },
  { name: 'Archives (Legacy)', type: 'folder', children: [] },
];

const DocumentManager: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string[]>(['Home']);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Documental Management</h2>
          <p className="text-gray-500">Central repository for FIT, DWG, and Process Standards.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-50">
            <i className="fa-solid fa-upload mr-2"></i> Upload New
          </button>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
        {currentPath.map((path, i) => (
          <React.Fragment key={i}>
            <span className={i === currentPath.length - 1 ? 'text-blue-600' : ''}>{path}</span>
            {i < currentPath.length - 1 && <i className="fa-solid fa-chevron-right text-[8px]"></i>}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden flex-1">
        <div className="grid grid-cols-12 bg-gray-50 border-b p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <div className="col-span-6">Name</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Size</div>
          <div className="col-span-2 text-right">Last Modified</div>
        </div>

        <div className="divide-y overflow-auto">
          {FOLDER_STRUCTURE.map((folder, i) => (
            <React.Fragment key={i}>
              <div className="grid grid-cols-12 p-4 items-center hover:bg-blue-50/30 transition-colors cursor-pointer group">
                <div className="col-span-6 flex items-center gap-3">
                  <i className="fa-solid fa-folder text-yellow-500 text-lg"></i>
                  <span className="font-bold text-gray-800 text-sm">{folder.name}</span>
                </div>
                <div className="col-span-2 text-xs text-gray-400 uppercase font-bold tracking-tighter">Directory</div>
                <div className="col-span-2 text-xs text-gray-400 uppercase font-bold tracking-tighter">{folder.children.length} items</div>
                <div className="col-span-2 text-right text-xs text-gray-400">---</div>
              </div>
              
              {folder.children.map((file, j) => (
                <div key={j} className="grid grid-cols-12 p-4 items-center hover:bg-gray-50 transition-colors cursor-pointer pl-12 border-l-4 border-l-transparent hover:border-l-blue-900">
                  <div className="col-span-6 flex items-center gap-3">
                    <i className={`fa-solid ${file.name.includes('pdf') ? 'fa-file-pdf text-red-500' : 'fa-file-code text-blue-500'} text-lg`}></i>
                    <span className="font-medium text-gray-700 text-sm">{file.name}</span>
                  </div>
                  <div className="col-span-2 text-xs text-gray-400 uppercase font-bold tracking-tighter">{file.name.split('.').pop()}</div>
                  <div className="col-span-2 text-xs text-gray-400 uppercase font-bold tracking-tighter">{file.size}</div>
                  <div className="col-span-2 text-right text-xs text-gray-400">{file.date}</div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <div className="mt-6 flex justify-end gap-2">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
          <i className="fa-solid fa-lock text-green-500"></i> Corporate Encrypted Storage
        </p>
      </div>
    </div>
  );
};

export default DocumentManager;
