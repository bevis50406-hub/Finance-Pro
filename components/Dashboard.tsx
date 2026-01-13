
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Plus, BrainCircuit, Wallet, ArrowUpCircle, ArrowDownCircle, AlertTriangle } from 'lucide-react';
import { BankAccount, Transaction, Budget } from '../types';
import { CATEGORIES } from '../constants';
import { getAIFinanceAdvice } from '../gemini';
import { format } from 'date-fns';

interface DashboardProps {
  accounts: BankAccount[];
  transactions: Transaction[];
  budgets: Budget[];
  onAddTransaction: (t: Transaction) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ accounts, transactions, budgets, onAddTransaction }) => {
  const [aiAdvice, setAiAdvice] = useState<string>("AI 財務顧問正在分析您的收支趨勢...");
  const [showAddModal, setShowAddModal] = useState(false);

  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);
  const monthlyIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const monthlyExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const categoryData = CATEGORIES.map(cat => {
    const value = transactions
      .filter(t => t.type === 'expense' && t.categoryId === cat.id)
      .reduce((sum, t) => sum + t.amount, 0);
    return { name: cat.name, value, color: cat.color };
  }).filter(c => c.value > 0);

  useEffect(() => {
    const fetchAdvice = async () => {
      const advice = await getAIFinanceAdvice(transactions, accounts, CATEGORIES);
      setAiAdvice(advice);
    };
    fetchAdvice();
  }, [transactions, accounts]);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-8 rounded-[32px] text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <p className="text-indigo-100 text-sm font-medium mb-1 relative">資產總額</p>
          <h2 className="text-4xl font-bold relative">NT$ {totalBalance.toLocaleString()}</h2>
          <div className="mt-6 flex items-center gap-2 text-indigo-100 text-xs bg-white/20 w-fit px-4 py-1.5 rounded-full relative backdrop-blur-md">
            <Wallet size={14} />
            <span>{accounts.length} 個啟用的帳戶</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="bg-emerald-50 p-5 rounded-2xl text-emerald-600">
            <ArrowUpCircle size={36} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">本月總收入</p>
            <p className="text-2xl font-black text-slate-900">NT$ {monthlyIncome.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="bg-rose-50 p-5 rounded-2xl text-rose-600">
            <ArrowDownCircle size={36} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">本月總支出</p>
            <p className="text-2xl font-black text-slate-900">NT$ {monthlyExpense.toLocaleString()}</p>
          </div>
        </div>
      </header>

      {/* AI & Budget Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 bg-indigo-50 border border-indigo-100 rounded-[32px] p-8 relative group overflow-hidden">
          <div className="flex items-start gap-5">
            <div className="bg-white p-4 rounded-2xl shadow-sm text-indigo-600 flex-shrink-0">
              <BrainCircuit size={28} />
            </div>
            <div>
              <h3 className="font-bold text-indigo-900 text-lg mb-2">Gemini AI 智慧建議</h3>
              <p className="text-indigo-800/80 leading-relaxed text-sm whitespace-pre-wrap italic">
                "{aiAdvice}"
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
          <h3 className="font-bold text-lg mb-6">預算警示</h3>
          <div className="space-y-4">
            {budgets.length > 0 ? budgets.map(b => {
              const cat = CATEGORIES.find(c => c.id === b.categoryId);
              const spent = transactions
                .filter(t => t.type === 'expense' && t.categoryId === b.categoryId)
                .reduce((sum, t) => sum + t.amount, 0);
              const percent = Math.min((spent / b.limit) * 100, 100);
              
              return (
                <div key={b.categoryId} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600">{cat?.name}</span>
                    <span className={percent >= 100 ? 'text-rose-600' : percent > 80 ? 'text-amber-600' : 'text-slate-400'}>
                      {spent.toLocaleString()} / {b.limit.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${percent >= 100 ? 'bg-rose-500' : percent > 80 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            }) : (
              <p className="text-slate-400 text-sm text-center py-4">尚未設定類別預算</p>
            )}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <h3 className="font-bold text-lg mb-8">支出比例</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColorFromClass(entry.color)} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4">
            {categoryData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span className="text-xs font-bold text-slate-500 flex-1">{item.name}</span>
                <span className="text-xs font-black text-slate-900">{((item.value / monthlyExpense) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-lg">近期明細</h3>
            <button onClick={() => setShowAddModal(true)} className="bg-indigo-600 text-white p-2.5 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
              <Plus size={20} />
            </button>
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {transactions.slice(0, 10).map((t) => {
              const category = CATEGORIES.find(c => c.id === t.categoryId);
              return (
                <div key={t.id} className="flex items-center gap-5 p-4 hover:bg-slate-50 rounded-[24px] transition-all group">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${category?.color || 'bg-slate-200'}`}>
                    {category?.icon || '❓'}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-sm">{t.note}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                      {format(new Date(t.date), 'MMM dd')} • {category?.name}
                    </p>
                  </div>
                  <div className={`font-black text-sm ${t.type === 'income' ? 'text-emerald-500' : 'text-slate-900'}`}>
                    {t.type === 'income' ? '+' : '-'} NT$ {t.amount.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {showAddModal && <AddTransactionModal onClose={() => setShowAddModal(false)} onAdd={onAddTransaction} accounts={accounts} />}
    </div>
  );
};

const AddTransactionModal = ({ onClose, onAdd, accounts }: any) => (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
    <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl">
      <h2 className="text-2xl font-black mb-8">紀錄收支</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        onAdd({
          id: Math.random().toString(36),
          accountId: formData.get('accountId') as string,
          amount: Number(formData.get('amount')),
          type: formData.get('type') as any,
          categoryId: formData.get('categoryId') as string,
          date: new Date().toISOString(),
          note: formData.get('note') as string,
        });
        onClose();
      }}>
        <div className="space-y-5">
          <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
            <label className="flex-1">
              <input type="radio" name="type" value="expense" defaultChecked className="sr-only peer" />
              <div className="text-center py-2.5 rounded-xl peer-checked:bg-white peer-checked:shadow-sm peer-checked:text-indigo-600 text-slate-500 font-bold text-sm cursor-pointer">支出</div>
            </label>
            <label className="flex-1">
              <input type="radio" name="type" value="income" className="sr-only peer" />
              <div className="text-center py-2.5 rounded-xl peer-checked:bg-white peer-checked:shadow-sm peer-checked:text-indigo-600 text-slate-500 font-bold text-sm cursor-pointer">收入</div>
            </label>
          </div>
          <input name="amount" type="number" required className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 text-lg font-bold" placeholder="金額 0.00" />
          <select name="accountId" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700">
            {accounts.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <select name="categoryId" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700">
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input name="note" type="text" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" placeholder="備註（例如：晚餐）" />
        </div>
        <div className="mt-10 flex gap-4">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-4 text-slate-400 font-bold hover:bg-slate-50 rounded-2xl transition-all">取消</button>
          <button type="submit" className="flex-1 px-4 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">儲存</button>
        </div>
      </form>
    </div>
  </div>
);

function getColorFromClass(cls: string) {
  const map: Record<string, string> = {
    'bg-orange-500': '#f97316', 'bg-blue-500': '#3b82f6', 'bg-emerald-500': '#10b981',
    'bg-purple-500': '#a855f7', 'bg-pink-500': '#ec4899', 'bg-red-500': '#ef4444',
    'bg-indigo-500': '#6366f1', 'bg-slate-500': '#64748b',
  };
  return map[cls] || '#cbd5e1';
}

export default Dashboard;
