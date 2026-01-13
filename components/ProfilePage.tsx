
import React, { useState } from 'react';
import { User as UserIcon, Mail, Calendar, Edit3, Shield, Key, LogOut, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
// Separate function and type imports for Firebase Auth
import { updateProfile } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';

interface ProfilePageProps {
  user: FirebaseUser | null;
  isDemoMode: boolean;
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, isDemoMode, onLogout }) => {
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemoMode) {
      setStatus({ type: 'error', message: '展示模式下無法修改個人資料。' });
      return;
    }
    if (!user) return;

    setLoading(true);
    setStatus(null);
    try {
      await updateProfile(user, { displayName });
      setIsEditing(false);
      setStatus({ type: 'success', message: '個人資料更新成功！' });
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || '更新失敗，請稍後再試。' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900">帳戶管理</h1>
        <p className="text-slate-500 mt-2">管理您的個人資訊與帳戶安全設定</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-indigo-100 mb-6">
              {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'D'}
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-1">
              {user?.displayName || (isDemoMode ? '展示使用者' : '未命名')}
            </h2>
            <p className="text-sm text-slate-400 mb-6 font-medium">{user?.email || 'demo@financepro.com'}</p>
            
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isDemoMode ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {isDemoMode ? 'Demo Account' : 'Verified User'}
            </div>
          </div>

          <div className="bg-indigo-600 p-8 rounded-[32px] text-white shadow-xl shadow-indigo-100">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Shield size={18} />
              <span>帳戶安全</span>
            </h3>
            <p className="text-indigo-100 text-sm leading-relaxed mb-6">
              您的財務數據已透過 Firebase 技術進行端對端加密儲存。
            </p>
            <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-2xl text-sm font-bold transition-all backdrop-blur-md">
              查看隱私政策
            </button>
          </div>
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-2 space-y-8">
          {status && (
            <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
              {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span className="text-sm font-bold">{status.message}</span>
            </div>
          )}

          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black text-slate-900">基本資料</h3>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:underline"
                >
                  <Edit3 size={16} />
                  <span>編輯</span>
                </button>
              )}
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">顯示名稱</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input 
                    disabled={!isEditing || loading}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-60 transition-all"
                    placeholder="輸入您的稱呼"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">電子郵件</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input 
                    disabled
                    value={user?.email || 'demo@financepro.com'}
                    className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none opacity-60"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => { setIsEditing(false); setDisplayName(user?.displayName || ''); }}
                    className="flex-1 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                  >
                    取消
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all"
                  >
                    {loading ? '更新中...' : '儲存變更'}
                  </button>
                </div>
              )}
            </form>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-6">帳戶操作</h3>
            <div className="space-y-4">
              <button className="w-full p-5 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-between group transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600 group-hover:scale-110 transition-transform">
                    <Key size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900">修改密碼</p>
                    <p className="text-xs text-slate-400">我們會發送重設郵件至您的信箱</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-300" />
              </button>

              <button 
                onClick={onLogout}
                className="w-full p-5 rounded-2xl bg-rose-50 hover:bg-rose-100 flex items-center justify-between group transition-all border border-rose-100/50"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-rose-600 group-hover:scale-110 transition-transform">
                    <LogOut size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-rose-700">登出此設備</p>
                    <p className="text-xs text-rose-400">登出後需重新輸入帳密進入</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-rose-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
