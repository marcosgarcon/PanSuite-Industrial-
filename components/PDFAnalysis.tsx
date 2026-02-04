
import React, { useState } from 'react';
import { parseTechnicalDrawing } from '../services/geminiService';
import { DrawingData } from '../types';

const PDFAnalysis: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<DrawingData | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreview(base64);
    };
    reader.readAsDataURL(file);

    setIsScanning(true);
    setResult(null);

    // Prepare base64 for Gemini (remove data:image/jpeg;base64, prefix)
    const base64ForAI = await new Promise<string>((resolve) => {
      const r = new FileReader();
      r.onloadend = () => {
        const str = r.result as string;
        resolve(str.split(',')[1]);
      };
      r.readAsDataURL(file);
    });

    try {
      const data = await parseTechnicalDrawing(base64ForAI);
      if (data) setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Technical Drawing AI Extraction</h2>
        <p className="text-gray-500">Upload a PDF drawing or photo to automatically extract nominal values and tolerances.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Area */}
        <div className="space-y-6">
          <div className={`relative border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center min-h-[400px] bg-white
            ${isScanning ? 'border-blue-400 bg-blue-50/30' : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'}`}>
            
            {preview ? (
              <div className="relative w-full h-full flex flex-col items-center">
                <img src={preview} alt="Preview" className="max-h-[300px] object-contain rounded-lg shadow-md mb-4" />
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Selected Image</p>
                <button 
                  onClick={() => {setPreview(null); setResult(null);}}
                  className="mt-4 px-4 py-2 text-xs font-bold text-red-500 bg-red-50 rounded-lg hover:bg-red-100"
                >
                  REMOVE
                </button>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                  <i className="fa-solid fa-cloud-arrow-up text-2xl"></i>
                </div>
                <p className="text-gray-600 font-bold text-center">Drag and drop or click to upload</p>
                <p className="text-gray-400 text-sm mb-6 uppercase tracking-widest font-semibold text-[10px]">PDF, PNG, JPG accepted</p>
                <input 
                  type="file" 
                  accept="image/*,application/pdf" 
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </>
            )}

            {isScanning && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl z-20">
                <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-blue-900 font-bold animate-pulse">Scanning Drawing with Gemini AI...</p>
                <p className="text-gray-500 text-xs mt-2">Extracting specs, nominals and part metadata</p>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 overflow-hidden relative">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
            <i className="fa-solid fa-microchip"></i> Extracted Data
          </h3>

          {result ? (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Part Code</p>
                  <p className="text-lg font-bold text-gray-800 uppercase tracking-wider">{result.partCode}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Model Name</p>
                  <p className="text-lg font-bold text-gray-800 uppercase tracking-wider">{result.modelName}</p>
                </div>
              </div>

              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-xs font-bold text-blue-900 uppercase tracking-widest mb-4">Dimensional Reference</p>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">LSL</p>
                    <p className="text-2xl font-black text-blue-900">{result.lsl.toFixed(3)}</p>
                  </div>
                  <div className="text-center border-x border-blue-200">
                    <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">NOMINAL</p>
                    <p className="text-3xl font-black text-blue-900">{result.nominal.toFixed(3)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">USL</p>
                    <p className="text-2xl font-black text-blue-900">{result.usl.toFixed(3)}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button className="flex-1 py-3 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 transition-colors uppercase text-xs tracking-widest">
                  Import to CEP Chart
                </button>
                <button className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors uppercase text-xs tracking-widest">
                  Save to FIT File
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
              <i className="fa-solid fa-magnifying-glass text-4xl mb-4 opacity-20"></i>
              <p className="font-medium">Waiting for technical document...</p>
            </div>
          )}

          <div className="absolute bottom-4 right-4 opacity-5 pointer-events-none">
            <i className="fa-solid fa-file-invoice text-9xl"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFAnalysis;
