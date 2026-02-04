
import React, { useState, useEffect } from 'react';
import { User, UserProfile, BusinessUnit } from '../types';

const AdminModule: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', profile: UserProfile.OPERATOR, unit: BusinessUnit.QA });

  useEffect(() => {
    const saved = localStorage.getItem('EQPS_USERS');
    if (saved) {
      setUsers(JSON.parse(saved));
    } else {
      const defaultUsers: User[] = [
        { id: '1', name: 'Admin Panasonic', email: 'admin@panasonic.com', profile: UserProfile.ADMIN, unit: BusinessUnit.QA, active: true, lastLogin: new Date().toLocaleDateString() },
      ];
      setUsers(defaultUsers);
      localStorage.setItem('EQPS_USERS', JSON.stringify(defaultUsers));
    }
  }, []);

  const addUser = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = {
      ...newUser,
      id: Math.random().toString(36).substr(2, 9),
      active: true,
      lastLogin: 'Primeiro Acesso'
    };
    const updated = [...users, user];
    setUsers(updated);
    localStorage.setItem('EQPS_USERS', JSON.stringify(updated));
    setNewUser({ name: '', email: '', profile: UserProfile.OPERATOR, unit: BusinessUnit.QA });
  };

  const deleteUser = (id: string) => {
    if(!window.confirm('Excluir este colaborador?')) return;
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    localStorage.setItem('EQPS_USERS', JSON.stringify(updated));
  };

  const exportData = () => {
    const allData: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('EQPS_')) {
        allData[key] = JSON.parse(localStorage.getItem(key) || '{}');
      }
    }
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EQPS_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        Object.keys(data).forEach(key => {
          localStorage.setItem(key, JSON.stringify(data[key]));
        });
        alert('Dados importados com sucesso! O sistema irá reiniciar.');
        window.location.reload();
      } catch (err) {
        alert('Erro ao importar arquivo. Verifique o formato.');
      }
    };
    reader.readAsText(file);
  };

  const resetDB = () => {
    if(window.confirm('Limpar banco de dados LOCAL? Esta ação não pode ser desfeita.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="bg-white p-10 rounded-[2.5rem] border shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Gestão de Sistemas</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Segurança e Portabilidade de Dados</p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
           <button onClick={exportData} className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2">
             <i className="fa-solid fa-file-export"></i> Backup Total
           </button>
           <label className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2 cursor-pointer">
             <i className="fa-solid fa-file-import"></i> Restaurar Dados
             <input type="file" className="hidden" accept=".json" onChange={importData} />
           </label>
           <button onClick={resetDB} className="px-6 py-3 border border-red-100 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all">
             <i className="fa-solid fa-trash-can"></i> Limpar Local
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border shadow-sm h-fit">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Cadastrar Colaborador</h3>
          <form onSubmit={addUser} className="space-y-4">
            <input 
              type="text" placeholder="Nome Completo" required value={newUser.name}
              onChange={e => setNewUser({...newUser, name: e.target.value})}
              className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-sm outline-none"
            />
            <input 
              type="email" placeholder="Email Corporativo" required value={newUser.email}
              onChange={e => setNewUser({...newUser, email: e.target.value})}
              className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-sm outline-none"
            />
            <select 
              value={newUser.profile}
              onChange={e => setNewUser({...newUser, profile: e.target.value as UserProfile})}
              className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-sm outline-none"
            >
              {Object.values(UserProfile).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <button className="w-full py-4 bg-[#005CB9] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-lg transition-all">
              Criar Credencial
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-[2rem] border shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-8 py-5 text-[9px] font-black text-blue-200 uppercase tracking-[0.2em]">Usuário</th>
                <th className="px-8 py-5 text-[9px] font-black text-blue-200 uppercase tracking-[0.2em]">Perfil</th>
                <th className="px-8 py-5 text-[9px] font-black text-blue-200 uppercase tracking-[0.2em] text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-xs">{user.name[0]}</div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{user.name}</p>
                        <p className="text-[10px] text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[9px] font-black px-3 py-1 bg-blue-50 text-blue-600 rounded-full uppercase">{user.profile}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button onClick={() => deleteUser(user.id)} className="text-slate-300 hover:text-red-600"><i className="fa-solid fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminModule;
