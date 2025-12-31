
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Mail, Lock, LogIn, UserPlus, PlayCircle, ShieldCheck } from 'lucide-react';

interface LoginPageProps {
  onLoginAsDemo: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginAsDemo }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setError('Firebase 未啟用，請使用展示模式。');
      return;
    }

    setError('');
    setLoading(true);
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message || '認證失敗，請檢查電子郵件與密碼。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[40px] shadow-2xl overflow-hidden">
        {/* 左側：品牌形象區 */}
        <div className="hidden lg:flex flex-col justify-between bg-indigo-600 p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/20 rounded-full -ml-48 -mb-48 blur-3xl"></div>
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-12">
              <div className="bg-white p-2 rounded-xl">
                <LogIn className="text-indigo-600 w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight italic">FinancePro</span>
            </div>
            
            <h2 className="text-5xl font-bold leading-tight mb-6">
              聰明理財，<br />從每一筆記錄開始。
            </h2>
            <p className="text-indigo-100 text-lg leading-relaxed max-w-md">
              透過 AI 智慧分析，為您的財務狀況提供最具價值的洞察與建議。隨時隨地掌控您的資產流向。
            </p>
          </div>

          <div className="relative mt-auto">
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
              <div className="bg-white p-2 rounded-lg text-indigo-600">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="font-bold">安全加密技術</p>
                <p className="text-sm text-indigo-100">採用 Firebase 雲端加密儲存您的數據</p>
              </div>
            </div>
          </div>
        </div>

        {/* 右側：登入表單區 */}
        <div className="p-8 md:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {isRegistering ? '加入我們' : '歡迎回來'}
            </h1>
            <p className="text-slate-500 mb-10">
              {isRegistering ? '立即建立您的帳戶，開啟智慧理財之旅' : '請登入您的帳戶以存取您的財務資訊'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm font-medium border border-rose-100">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">電子郵件</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="email" 
                    required 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="example@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">登入密碼</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="password" 
                    required 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="至少 6 位字元"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0"
              >
                {loading ? '處理中...' : (isRegistering ? '註冊帳戶' : '立即登入')}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100">
              <button 
                onClick={onLoginAsDemo}
                className="w-full flex items-center justify-center gap-3 bg-amber-50 text-amber-700 font-bold py-4 rounded-2xl hover:bg-amber-100 transition-colors"
              >
                <PlayCircle size={20} />
                <span>切換至「展示模式」 (無需登入)</span>
              </button>

              <div className="mt-6 text-center">
                <button 
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-indigo-600 font-bold hover:underline"
                >
                  {isRegistering ? '已經有帳戶了？點此登入' : '還沒有帳戶？立即註冊一個'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
