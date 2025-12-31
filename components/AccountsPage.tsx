
import React, { useState } from 'react';
import { Plus, Trash2, Landmark, CreditCard } from 'lucide-react';
import { BankAccount } from '../types';

interface AccountsPageProps {
  accounts: BankAccount[];
  onAdd: (a: BankAccount) => void;
  onDelete: (id: string) => void;
}

const AccountsPage: React.FC<AccountsPageProps> = ({ accounts, onAdd, onDelete }) => {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">銀行帳戶管理</h1>
          <p className="text-slate-500 mt-1">管理您的現金、銀行與信用卡帳戶</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <Plus size={20} />
          <span>新增帳戶</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 ${acc.color} opacity-10 rounded-full group-hover:scale-125 transition-transform duration-500`}></div>
            <div className="flex justify-between items-start relative">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-inner ${acc.color}`}>
                  {acc.type === '信用卡' ? <CreditCard size={28} /> : <Landmark size={28} />}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{acc.name}</h3>
                  <p className="text-sm text-slate-500 uppercase tracking-wider">{acc.type}</p>
                </div>
              </div>
              <button 
                onClick={() => onDelete(acc.id)}
                className="text-slate-400 hover:text-rose-600 p-2 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <div className="mt-8">
              <p className="text-xs text-slate-400 font-medium mb-1">目前餘額</p>
              <h4 className={`text-2xl font-bold ${acc.balance < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                NT$ {acc.balance.toLocaleString()}
              </h4>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold mb-6">新增帳戶</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              onAdd({
                id: Math.random().toString(36),
                name: formData.get('name') as string,
                balance: Number(formData.get('balance')),
                type: formData.get('type') as string,
                color: formData.get('color') as string,
              });
              setShowAdd(false);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">帳戶名稱</label>
                  <input name="name" type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="例如：中信數位帳戶" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">帳戶類型</label>
                  <select name="type" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="儲蓄帳戶">儲蓄帳戶</option>
                    <option value="信用卡">信用卡</option>
                    <option value="現金">現金</option>
                    <option value="投資帳戶">投資帳戶</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">初始餘額</label>
                  <input name="balance" type="number" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">代表顏色</label>
                  <div className="flex gap-3">
                    {['bg-blue-600', 'bg-emerald-600', 'bg-rose-600', 'bg-indigo-600', 'bg-slate-700'].map(c => (
                      <label key={c} className="cursor-pointer">
                        <input type="radio" name="color" value={c} className="sr-only peer" defaultChecked={c === 'bg-indigo-600'} />
                        <div className={`w-8 h-8 rounded-full ${c} peer-checked:ring-2 ring-offset-2 ring-slate-400 transition-all`}></div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 px-4 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">取消</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">建立帳戶</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsPage;
