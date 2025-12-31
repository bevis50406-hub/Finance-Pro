
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Plus, BrainCircuit, Wallet, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { BankAccount, Transaction } from '../types';
import { CATEGORIES } from '../constants';
import { getAIFinanceAdvice } from '../gemini';
import { format } from 'date-fns';

interface DashboardProps {
  accounts: BankAccount[];
  transactions: Transaction[];
  onAddTransaction: (t: Transaction) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ accounts, transactions, onAddTransaction }) => {
  const [aiAdvice, setAiAdvice] = useState<string>("分析中...");
  const [showAddModal, setShowAddModal] = useState(false);

  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);
  const monthlyIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const monthlyExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // 分類支出數據
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* 頂部總覽卡片 */}
      <header className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 rounded-3xl text-white shadow-xl shadow-indigo-100">
          <p className="text-indigo-100 text-sm font-medium mb-1">資產總額</p>
          <h2 className="text-3xl font-bold">NT$ {totalBalance.toLocaleString()}</h2>
          <div className="mt-4 flex items-center gap-2 text-indigo-100 text-sm bg-white/10 w-fit px-3 py-1 rounded-full">
            <Wallet size={16} />
            <span>{accounts.length} 個啟用的帳戶</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="bg-emerald-100 p-4 rounded-2xl text-emerald-600">
            <ArrowUpCircle size={32} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">本月總收入</p>
            <p className="text-2xl font-bold text-slate-900">NT$ {monthlyIncome.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="bg-rose-100 p-4 rounded-2xl text-rose-600">
            <ArrowDownCircle size={32} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">本月總支出</p>
            <p className="text-2xl font-bold text-slate-900">NT$ {monthlyExpense.toLocaleString()}</p>
          </div>
        </div>
      </header>

      {/* AI 建議區塊 */}
      <section className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 relative overflow-hidden group">
        <div className="absolute -right-12 -top-12 bg-white/50 w-48 h-48 rounded-full blur-3xl group-hover:bg-indigo-200 transition-colors duration-500"></div>
        <div className="flex items-start gap-4 relative">
          <div className="bg-white p-3 rounded-2xl shadow-sm text-indigo-600">
            <BrainCircuit size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-indigo-900 mb-2">Gemini AI 財務觀察</h3>
            <p className="text-indigo-800 leading-relaxed text-sm whitespace-pre-wrap">
              {aiAdvice}
            </p>
          </div>
        </div>
      </section>

      {/* 圖表區塊 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-lg mb-6">支出結構分析</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColorFromClass(entry.color)} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {categoryData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span className="text-xs text-slate-600">{item.name}</span>
                <span className="text-xs font-bold ml-auto">{((item.value / monthlyExpense) * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">近期收支紀錄</h3>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-slate-900 text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {transactions.slice(0, 10).map((t) => {
              const category = CATEGORIES.find(c => c.id === t.categoryId);
              return (
                <div key={t.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${category?.color || 'bg-slate-200'}`}>
                    {category?.icon || '❓'}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">{t.note}</p>
                    <p className="text-xs text-slate-500">{format(new Date(t.date), 'MM/dd HH:mm')} • {category?.name}</p>
                  </div>
                  <div className={t.type === 'income' ? 'text-emerald-600 font-bold' : 'text-slate-900 font-bold'}>
                    {t.type === 'income' ? '+' : '-'} NT$ {t.amount.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* 簡易交易新增 Modal (實作略，此處僅放 UI 示意) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">新增財務紀錄</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              onAddTransaction({
                id: Math.random().toString(36),
                accountId: formData.get('accountId') as string,
                amount: Number(formData.get('amount')),
                type: formData.get('type') as any,
                categoryId: formData.get('categoryId') as string,
                date: new Date().toISOString(),
                note: formData.get('note') as string,
              });
              setShowAddModal(false);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">類型</label>
                  <select name="type" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="expense">支出</option>
                    <option value="income">收入</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">金額</label>
                  <input name="amount" type="number" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">帳戶</label>
                  <select name="accountId" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500">
                    {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">分類</label>
                  <select name="categoryId" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500">
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">備註</label>
                  <input name="note" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="例如：晚餐、薪水" />
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">取消</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">儲存紀錄</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// 輔助函式：將 Tailwind Class 轉為 Hex 色碼供 Chart 使用
function getColorFromClass(cls: string) {
  const map: Record<string, string> = {
    'bg-orange-500': '#f97316',
    'bg-blue-500': '#3b82f6',
    'bg-emerald-500': '#10b981',
    'bg-purple-500': '#a855f7',
    'bg-pink-500': '#ec4899',
    'bg-red-500': '#ef4444',
    'bg-indigo-500': '#6366f1',
    'bg-slate-500': '#64748b',
  };
  return map[cls] || '#cbd5e1';
}

export default Dashboard;
