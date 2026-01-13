
export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface BankAccount {
  id: string;
  name: string;
  balance: number;
  color: string;
  type: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string;
  note: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  color: string;
  deadline?: string;
}

export interface Budget {
  categoryId: string;
  limit: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
}
