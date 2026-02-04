
import React, { useState, useEffect } from 'react';
import { UserProfile, BusinessUnit, Tool, BusinessArea, User } from './types';
import { TOOLS_REGISTRY } from './constants';
import Dashboard from './components/Dashboard';
import SPCModule from './components/SPCModule';
import ManagementVisual from './components/ManagementVisual';
import DashboardViewer from './components/DashboardViewer';
import AdminModule from './components/AdminModule';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [activeArea, setActiveArea] = useState<BusinessArea | 'ALL'>('ALL');
  const [activeSystemView, setActiveSystemView] = useState<'APP' | 'ADMIN'>('APP');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const session = localStorage.getItem('EQPS_SESSION');
    if (session) setCurrentUser(JSON.parse(session));

    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);

    // Captura o evento de instalação para permitir o "Clique e Abra"
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const loginAs = (profile: UserProfile) => {
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Colaborador ${profile}`,
      email: `${profile.toLowerCase()}@panasonic.com`,
      profile,
      unit: BusinessUnit.QA,
      active: true,
      lastLogin: new Date().toLocaleString()
    };
    setCurrentUser(user);
    localStorage.setItem('EQPS_SESSION', JSON.stringify(user));
  };

  const handleLogout = () => {
    localStorage.removeItem('EQPS_SESSION');
    setCurrentUser(null);
    setSelectedTool(null);
    setActiveSystemView('APP');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#001A41] p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none text-white/5 text-[20rem] font-black select-none">EQPS</div>
        <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden border border-white/20 relative z-10 animate-in fade-in zoom-in duration-500">
          <div className="bg-[#002D72] p-12 text-center text-white relative">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/Panasonic_logo_%28Blue%29.svg" alt="Panasonic" className="h-6 mx-auto mb-6 brightness-0 invert" />
            <h1 className="text-5xl font-black tracking-tighter mb-2">EQPS</h1>
            <p className="text-blue-200 font-bold uppercase text-[10px] tracking-[0.4em] opacity-80">Industrial IQ Suite</p>
          </div>
          
          <div className="p-12 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {Object.values(UserProfile).map((profile) => (
                <button
                  key={profile}
                  onClick={() => loginAs(profile)}
                  className="group p-5 bg-slate-50 hover:bg-[#005CB9] border border-slate-200 rounded-2xl transition-all duration-300 flex flex-col items-center gap-3 active:scale-95"
                >
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#002D72] group-hover:scale-110 transition-transform">
                    <i className={`fa-solid ${profile === UserProfile.ADMIN ? 'fa-user-shield' : 'fa-user-gear'} text-lg`}></i>
                  </div>
                  <span className="text-[10px] font-black text-slate-500 group-hover:text-white uppercase tracking-widest">{profile}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (activeSystemView === 'ADMIN') return <AdminModule />;
    if (!selectedTool) return <Dashboard onSelectTool={setSelectedTool} activeArea={activeArea} onSelectArea={setActiveArea} userProfile={currentUser.profile} installPrompt={deferredPrompt} onInstall={handleInstallClick} />;
    
    switch (selectedTool.id) {
      case 'cep-stats': return <SPCModule />;
      case 'industrial-bi': return <ManagementVisual />;
      default: return <DashboardViewer toolId={selectedTool.id} toolName={selectedTool.name} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <aside className="w-72 glass-sidebar flex flex-col sticky top-0 h-screen z-50 bg-white border-r">
        <div className="p-8 border-b">
          <button onClick={() => {setSelectedTool(null); setActiveArea('ALL'); setActiveSystemView('APP');}} className="group">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/Panasonic_logo_%28Blue%29.svg" alt="Panasonic" className="h-4 mb-2 group-hover:scale-105 transition-transform" />
            <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">EQPS Suite</h1>
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto custom-scrollbar">
          <button 
            onClick={() => {setActiveArea('ALL'); setSelectedTool(null); setActiveSystemView('APP');}}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeArea === 'ALL' && activeSystemView === 'APP' && !selectedTool ? 'bg-[#002D72] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <i className="fa-solid fa-house-chimney"></i> Painel Geral
          </button>

          {Object.values(BusinessArea).map(area => (
            <button
              key={area}
              onClick={() => {setActiveArea(area); setSelectedTool(null); setActiveSystemView('APP');}}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeArea === area && !selectedTool ? 'bg-[#005CB9] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <i className="fa-solid fa-cube opacity-50 text-[10px]"></i>
              <span className="truncate">{area.split(' ')[0]}</span>
            </button>
          ))}

          {currentUser.profile === UserProfile.ADMIN && (
            <div className="mt-10 pt-10 border-t border-slate-100">
              <button 
                onClick={() => {setActiveSystemView('ADMIN'); setSelectedTool(null);}}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeSystemView === 'ADMIN' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:bg-red-50 hover:text-red-600'}`}
              >
                <i className="fa-solid fa-gears"></i> Admin Console
              </button>
            </div>
          )}
        </nav>

        <div className="p-6 bg-slate-50 border-t">
          <div className="flex items-center gap-4 bg-white p-4 rounded-[1.5rem] shadow-sm border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-[#002D72] flex items-center justify-center text-white font-black text-sm">{currentUser.name[0]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-slate-900 truncate uppercase tracking-tighter">{currentUser.name}</p>
              <p className="text-[8px] font-bold text-blue-600 uppercase tracking-widest">{currentUser.profile}</p>
            </div>
            <button onClick={handleLogout} className="text-slate-300 hover:text-red-600 transition-colors">
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b flex items-center justify-between px-10 sticky top-0 z-40">
           <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
               <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{isOnline ? 'Conectado' : 'Modo Offline'}</span>
             </div>
             {deferredPrompt && (
               <button 
                 onClick={handleInstallClick}
                 className="px-4 py-2 bg-[#002D72] text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 animate-bounce"
               >
                 <i className="fa-solid fa-download"></i> Instalar EQPS
               </button>
             )}
           </div>
           <div className="flex items-center gap-4">
             <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">v4.5.1 Desktop Ready</span>
           </div>
        </header>

        <main className="flex-1 overflow-auto p-10 custom-scrollbar">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
