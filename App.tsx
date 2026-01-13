
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  History, 
  LogOut, 
  TrendingUp, 
  ShieldCheck,
  ShieldAlert,
  Target,
  PieChart as PieChartIcon,
  MessageSquareText,
  User as UserIcon,
  Settings
} from 'lucide-react';
// Separate function and type imports for Firebase Auth
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, isFirebaseEnabled } from './firebase';
import { BankAccount, Transaction, Goal, Budget } from './types';
import { MOCK_ACCOUNTS, MOCK_TRANSACTIONS, CATEGORIES } from './constants';
import Dashboard from './components/Dashboard';
import AccountsPage from './components/AccountsPage';
import TransactionsPage from './components/TransactionsPage';
import GoalsPage from './components/GoalsPage';
import BudgetPage from './components/BudgetPage';
import ProfilePage from './components/ProfilePage';
import AIChatDrawer from './components/AIChatDrawer';
import LoginPage from './components/LoginPage';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(!isFirebaseEnabled());
  const [loading, setLoading] = useState(true);
  
  // States for data
  const [accounts, setAccounts] = useState<BankAccount[]>(MOCK_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [goals, setGoals] = useState<Goal[]>([
    { id: 'g1', name: '日本旅遊基金', targetAmount: 50000, currentAmount: 12500, color: 'bg-pink-500' },
    { id: 'g2', name: '緊急預備金', targetAmount: 100000, currentAmount: 85000, color: 'bg-blue-500' }
  ]);
  const [budgets, setBudgets] = useState<Budget[]>([
    { categoryId: '1', limit: 8000 },
    { categoryId: '2', limit: 2000 }
  ]);
  
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (u) => {
        setUser(u);
        setLoading(false);
      });
      return unsubscribe;
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = async () => {
    if (auth && !isDemoMode) await signOut(auth);
    setUser(null);
    setIsDemoMode(true);
    navigate('/login');
  };

  const addTransaction = (t: Transaction) => {
    setTransactions(prev => [t, ...prev]);
    setAccounts(prev => prev.map(acc => {
      if (acc.id === t.accountId) {
        return {
          ...acc,
          balance: t.type === 'income' ? acc.balance + t.amount : acc.balance - t.amount
        };
      }
      return acc;
    }));
  };

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  const isAuthenticated = user || isDemoMode;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-['Inter','Noto_Sans_TC']">
      {isAuthenticated && (
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 md:h-screen z-40">
          <div className="p-6 flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <TrendingUp className="text-white w-6 h-6" />
            </div>
            <h1 className="font-bold text-xl tracking-tight">FinancePro</h1>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            <NavLink to="/" icon={<LayoutDashboard size={20} />} label="主控面板" />
            <NavLink to="/accounts" icon={<Wallet size={20} />} label="銀行帳戶" />
            <NavLink to="/transactions" icon={<History size={20} />} label="財務記錄" />
            <div className="pt-4 pb-2 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">理財計畫</div>
            <NavLink to="/goals" icon={<Target size={20} />} label="儲蓄目標" />
            <NavLink to="/budget" icon={<PieChartIcon size={20} />} label="預算管理" />
          </nav>

          <div className="p-4 border-t border-slate-100 space-y-4">
            {/* User Profile Summary */}
            <Link to="/profile" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-105 transition-transform">
                {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'D'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {user?.displayName || (isDemoMode ? '展示使用者' : '未設定名稱')}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {user?.email || 'demo-mode@financepro.com'}
                </p>
              </div>
              <Settings size={16} className="text-slate-300 group-hover:text-indigo-600 group-hover:rotate-45 transition-all" />
            </Link>

            <div className={cn(
              "flex items-center gap-2 p-3 rounded-lg text-xs font-medium uppercase tracking-wider",
              isDemoMode ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
            )}>
              {isDemoMode ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
              {isDemoMode ? "展示模式" : "正式模式"}
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
            >
              <LogOut size={20} />
              <span className="font-medium">登出系統</span>
            </button>
          </div>
        </aside>
      )}

      <main className="flex-1 min-w-0 relative">
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <LoginPage onLoginAsDemo={() => setIsDemoMode(true)} /> : <Navigate to="/" />} />
          <Route path="/" element={isAuthenticated ? <Dashboard accounts={accounts} transactions={transactions} budgets={budgets} onAddTransaction={addTransaction} /> : <Navigate to="/login" />} />
          <Route path="/accounts" element={isAuthenticated ? <AccountsPage accounts={accounts} onAdd={(a) => setAccounts([...accounts, a])} onDelete={(id) => setAccounts(accounts.filter(acc => acc.id !== id))} /> : <Navigate to="/login" />} />
          <Route path="/transactions" element={isAuthenticated ? <TransactionsPage transactions={transactions} accounts={accounts} /> : <Navigate to="/login" />} />
          <Route path="/goals" element={isAuthenticated ? <GoalsPage goals={goals} setGoals={setGoals} /> : <Navigate to="/login" />} />
          <Route path="/budget" element={isAuthenticated ? <BudgetPage budgets={budgets} setBudgets={setBudgets} transactions={transactions} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <ProfilePage user={user} isDemoMode={isDemoMode} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        </Routes>

        {/* AI Chat Toggle Button */}
        {isAuthenticated && (
          <button 
            onClick={() => setIsAIChatOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 animate-bounce-slow"
          >
            <MessageSquareText size={24} />
          </button>
        )}

        {/* AI Chat Drawer */}
        <AIChatDrawer 
          isOpen={isAIChatOpen} 
          onClose={() => setIsAIChatOpen(false)} 
          transactions={transactions}
          accounts={accounts}
        />
      </main>
    </div>
  );
};

const NavLink: React.FC<{ to: string, icon: React.ReactNode, label: string }> = ({ to, icon, label }) => {
  const active = window.location.hash === `#${to}` || (to === '/' && window.location.hash === '');
  return (
    <a href={`#${to}`} className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
        active ? "bg-indigo-50 text-indigo-700 shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      )}>
      {icon}
      <span className="font-semibold">{label}</span>
    </a>
  );
};

export default App;
