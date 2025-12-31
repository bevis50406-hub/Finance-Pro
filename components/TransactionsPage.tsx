
import React, { useState } from 'react';
import { Search, Filter, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Transaction, BankAccount } from '../types';
import { CATEGORIES } from '../constants';
import { format } from 'date-fns';

interface TransactionsPageProps {
  transactions: Transaction[];
  accounts: BankAccount[];
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({ transactions, accounts }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = transactions.filter(t => 
    t.note.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">財務歷史記錄</h1>
        <p className="text-slate-500 mt-1">追蹤您的每一筆收入與支出明細</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="搜尋備註內容..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-50 border border-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all">
            <Filter size={20} />
            <span>進階篩選</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">日期</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">分類與項目</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">來源帳戶</th>
                <th className="text-right px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">金額</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((t) => {
                const category = CATEGORIES.find(c => c.id === t.categoryId);
                const account = accounts.find(a => a.id === t.accountId);
                return (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <p className="text-sm font-medium text-slate-900">{format(new Date(t.date), 'yyyy/MM/dd')}</p>
                      <p className="text-xs text-slate-400">{format(new Date(t.date), 'HH:mm')}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${category?.color || 'bg-slate-200'}`}>
                          {category?.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{t.note}</p>
                          <p className="text-xs text-slate-500">{category?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                        {account?.name || '未知帳戶'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <span className={t.type === 'income' ? 'text-emerald-600 font-bold' : 'text-slate-900 font-bold'}>
                          {t.type === 'income' ? '+' : '-'} NT$ {t.amount.toLocaleString()}
                        </span>
                        {t.type === 'income' ? 
                          <ArrowUpRight size={16} className="text-emerald-500" /> : 
                          <ArrowDownLeft size={16} className="text-slate-300" />
                        }
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filtered.length === 0 && (
          <div className="p-20 text-center">
            <div className="inline-flex p-6 rounded-full bg-slate-50 text-slate-300 mb-4">
              <Search size={48} />
            </div>
            <h3 className="text-xl font-bold text-slate-400">找不到符合的紀錄</h3>
            <p className="text-slate-400 mt-1">請嘗試不同的關鍵字搜尋</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;
