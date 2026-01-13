
import React, { useState } from 'react';
import { Plus, Target, Trash2, TrendingUp } from 'lucide-react';
import { Goal } from '../types';

interface GoalsPageProps {
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

const GoalsPage: React.FC<GoalsPageProps> = ({ goals, setGoals }) => {
  const [showAdd, setShowAdd] = useState(false);

  const addGoal = (g: Goal) => setGoals([...goals, g]);
  const deleteGoal = (id: string) => setGoals(goals.filter(g => g.id !== id));

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900">儲蓄目標</h1>
          <p className="text-slate-500 mt-2">為您的夢想設定具體的儲蓄計畫</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-indigo-100"
        >
          <Plus size={20} />
          <span>建立新目標</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {goals.map(goal => {
          const percent = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
          return (
            <div key={goal.id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-2 h-full ${goal.color}`}></div>
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${goal.color} bg-opacity-10 flex items-center justify-center text-2xl ${goal.color.replace('bg-', 'text-')}`}>
                    <Target size={28} />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-slate-900">{goal.name}</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Savings Goal</p>
                  </div>
                </div>
                <button onClick={() => deleteGoal(goal.id)} className="text-slate-300 hover:text-rose-500 p-2 transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-slate-400 font-bold mb-1">目前進度</p>
                    <p className="text-2xl font-black text-slate-900">NT$ {goal.currentAmount.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-bold mb-1">目標金額</p>
                    <p className="text-lg font-bold text-slate-400">/ NT$ {goal.targetAmount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${goal.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center text-xs font-black">
                  <span className={`${goal.color.replace('bg-', 'text-')}`}>{percent.toFixed(1)}% 已達成</span>
                  <span className="text-slate-400">剩餘 NT$ {(goal.targetAmount - goal.currentAmount).toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl">
            <h2 className="text-2xl font-black mb-8">新儲蓄計畫</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              addGoal({
                id: Math.random().toString(36),
                name: formData.get('name') as string,
                targetAmount: Number(formData.get('target')),
                currentAmount: 0,
                color: formData.get('color') as string,
              });
              setShowAdd(false);
            }}>
              <div className="space-y-6">
                <input name="name" required className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" placeholder="目標名稱（例如：購屋頭期款）" />
                <input name="target" type="number" required className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" placeholder="目標金額 0.00" />
                <div className="flex gap-4 justify-center">
                  {['bg-pink-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-indigo-500'].map(c => (
                    <label key={c} className="cursor-pointer">
                      <input type="radio" name="color" value={c} className="sr-only peer" defaultChecked={c === 'bg-indigo-500'} />
                      <div className={`w-10 h-10 rounded-full ${c} peer-checked:ring-4 ring-offset-2 ring-slate-200 transition-all`}></div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-10 flex gap-4">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 px-4 py-4 text-slate-400 font-bold hover:bg-slate-50 rounded-2xl">取消</button>
                <button type="submit" className="flex-1 px-4 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100">建立目標</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;
