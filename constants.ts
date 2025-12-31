
import { Category, BankAccount, Transaction } from './types';

export const CATEGORIES: Category[] = [
  { id: '1', name: '餐飲飲食', icon: '🍔', color: 'bg-orange-500' },
  { id: '2', name: '交通出行', icon: '🚗', color: 'bg-blue-500' },
  { id: '3', name: '薪資收入', icon: '💰', color: 'bg-emerald-500' },
  { id: '4', name: '居家生活', icon: '🏠', color: 'bg-purple-500' },
  { id: '5', name: '娛樂休閒', icon: '🎮', color: 'bg-pink-500' },
  { id: '6', name: '醫療健康', icon: '🏥', color: 'bg-red-500' },
  { id: '7', name: '投資回報', icon: '📈', color: 'bg-indigo-500' },
  { id: '8', name: '其他支出', icon: '📦', color: 'bg-slate-500' },
];

export const MOCK_ACCOUNTS: BankAccount[] = [
  { id: 'acc-1', name: '國泰世華', balance: 50000, color: 'bg-green-600', type: '儲蓄帳戶' },
  { id: 'acc-2', name: '中信卡', balance: -2500, color: 'bg-red-600', type: '信用卡' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't-1', accountId: 'acc-1', amount: 120, type: 'expense', categoryId: '1', date: new Date().toISOString(), note: '午餐便當' },
  { id: 't-2', accountId: 'acc-1', amount: 45000, type: 'income', categoryId: '3', date: new Date().toISOString(), note: '1月薪資' },
  { id: 't-3', accountId: 'acc-2', amount: 35, type: 'expense', categoryId: '2', date: new Date().toISOString(), note: '捷運' },
];
