'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getExpenses } from '../lib/expenses';


interface AuthContextType {
  user: User | null;
  signOutUser: () => Promise<void>;
  expenses: Expense[];
  refreshExpenses: () => Promise<void>; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const refreshExpenses = useCallback(async () => {
    if (user) {
      try {
        const userExpenses = await getExpenses(user.uid);
        setExpenses(userExpenses);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await refreshExpenses(); 
      } else {
        setExpenses([]);
      }
    });
    return () => unsubscribe();
  }, [refreshExpenses]); 

  const signOutUser = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, signOutUser, expenses, refreshExpenses }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
