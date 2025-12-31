
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  History, 
  Settings, 
  LogOut, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck,
  ShieldAlert,
  BrainCircuit,
  PieChart as PieChartIcon
} from 'lucide-react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth, isFirebaseEnabled } from './firebase';
import { BankAccount, Transaction, UserProfile } from './types';
import { MOCK_ACCOUNTS, MOCK_TRANSACTIONS, CATEGORIES } from './constants';
import Dashboard from './components/Dashboard';
import AccountsPage from './components/AccountsPage';
import TransactionsPage from './components/TransactionsPage';
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
  
  const [accounts, setAccounts] = useState<BankAccount[]>(MOCK_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
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
    if (auth && !isDemoMode) {
      await signOut(auth);
    }
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

  const deleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
    setTransactions(prev => prev.filter(t => t.accountId !== id));
  };

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  const isAuthenticated = user || isDemoMode;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {isAuthenticated && (
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 md:h-screen z-40">
          <div className="p-6 flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <TrendingUp className="text-white w-6 h-6" />
            </div>
            <h1 className="font-bold text-xl tracking-tight">FinancePro</h1>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            <NavLink to="/" icon={<LayoutDashboard size={20} />} label="主控面板" />
            <NavLink to="/accounts" icon={<Wallet size={20} />} label="銀行帳戶" />
            <NavLink to="/transactions" icon={<History size={20} />} label="財務記錄" />
          </nav>

          <div className="p-4 border-t border-slate-100">
            <div className={cn(
              "flex items-center gap-2 p-3 rounded-lg mb-4 text-xs font-medium uppercase tracking-wider",
              isDemoMode ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
            )}>
              {isDemoMode ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
              {isDemoMode ? "展示模式 (Demo)" : "正式模式 (Firebase)"}
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">登出系統</span>
            </button>
          </div>
        </aside>
      )}

      <main className="flex-1 min-w-0">
        <Routes>
          <Route path="/login" element={
            !isAuthenticated ? <LoginPage onLoginAsDemo={() => setIsDemoMode(true)} /> : <Navigate to="/" />
          } />
          <Route path="/" element={
            isAuthenticated ? 
            <Dashboard accounts={accounts} transactions={transactions} onAddTransaction={addTransaction} /> : 
            <Navigate to="/login" />
          } />
          <Route path="/accounts" element={
            isAuthenticated ? 
            <AccountsPage accounts={accounts} onAdd={(a) => setAccounts([...accounts, a])} onDelete={deleteAccount} /> : 
            <Navigate to="/login" />
          } />
          <Route path="/transactions" element={
            isAuthenticated ? 
            <TransactionsPage transactions={transactions} accounts={accounts} /> : 
            <Navigate to="/login" />
          } />
        </Routes>
      </main>
    </div>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, label }) => {
  const active = window.location.hash === `#${to}` || (to === '/' && window.location.hash === '');
  return (
    <a 
      href={`#${to}`}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
        active ? "bg-indigo-50 text-indigo-700 shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      {icon}
      <span className="font-semibold">{label}</span>
    </a>
  );
};

export default App;
