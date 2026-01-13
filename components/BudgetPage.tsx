
import React, { useState } from 'react';
import { PieChart, Settings2, AlertCircle } from 'lucide-react';
import { Budget, Transaction } from '../types';
import { CATEGORIES } from '../constants';

interface BudgetPageProps {
  budgets: Budget[];
  setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
  transactions: Transaction[];
}

const BudgetPage: React.FC<BudgetPageProps> = ({ budgets, setBudgets, transactions }) => {
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [tempLimit, setTempLimit] = useState("");

  const updateBudget = (catId: string, limit: number) => {
    const existing = budgets.find(b => b.categoryId === catId);
    if (existing) {
      setBudgets(budgets.map(b => b.categoryId === catId ? { ...b, limit } : b));
    } else {
      setBudgets([...budgets, { categoryId: catId, limit }]);
    }
    setEditingCategory(null);
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900">預算設定</h1>
        <p className="text-slate-500 mt-2">管控每月分類支出上限，維持財務健康</p>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-50">
          {CATEGORIES.map(cat => {
            const budget = budgets.find(b => b.categoryId === cat.id);
            const spent = transactions
              .filter(t => t.type === 'expense' && t.categoryId === cat.id)
              .reduce((sum, t) => sum + t.amount, 0);
            const percent = budget ? Math.min((spent / budget.limit) * 100, 100) : 0;

            return (
              <div key={cat.id} className="p-8 hover:bg-slate-50/50 transition-all flex flex-col md:flex-row gap-8 items-center">
                <div className="flex items-center gap-5 w-full md:w-64">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${cat.color} bg-opacity-10 ${cat.color.replace('bg-', 'text-')}`}>
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">{cat.name}</h3>
                    <p className="text-xs text-slate-400 font-bold">目前已支 {spent.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex-1 w-full">
                  {budget ? (
                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span>預算進度</span>
                        <span className={percent >= 100 ? 'text-rose-500' : 'text-slate-900'}>
                          {percent.toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${percent >= 100 ? 'bg-rose-500' : percent > 80 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-300 italic text-sm">
                      <AlertCircle size={16} />
                      尚未設定預算
                    </div>
                  )}
                </div>

                <div className="w-full md:w-48 text-right">
                  {editingCategory === cat.id ? (
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        autoFocus
                        className="w-full bg-white border border-indigo-200 rounded-xl px-3 py-2 text-sm font-bold outline-none"
                        value={tempLimit}
                        onChange={(e) => setTempLimit(e.target.value)}
                        onBlur={() => updateBudget(cat.id, Number(tempLimit))}
                        placeholder="輸入金額"
                      />
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        setEditingCategory(cat.id);
                        setTempLimit(budget?.limit.toString() || "");
                      }}
                      className="group flex items-center gap-2 ml-auto text-slate-400 hover:text-indigo-600 transition-colors font-bold text-sm"
                    >
                      <span className="text-slate-900">{budget ? `NT$ ${budget.limit.toLocaleString()}` : "設定預算"}</span>
                      <Settings2 size={16} className="group-hover:rotate-90 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BudgetPage;
