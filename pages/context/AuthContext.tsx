'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getExpenses } from '../lib/expenses';
import { getSales } from '../lib/sales'; // Importar la función de ventas

interface AuthContextType {
  user: User | null;
  signOutUser: () => Promise<void>;
  expenses: Expense[];
  sales: Sales[]; // Nuevo estado para las ventas
  refreshExpenses: () => Promise<void>;
  refreshSales: () => Promise<void>; // Nueva función para refrescar las ventas
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [sales, setSales] = useState<Sales[]>([]); // Estado para las ventas

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

  const refreshSales = useCallback(async () => {
    if (user) {
      try {
        const userSales = await getSales(user.uid); // Obtener las ventas del usuario
        setSales(userSales);
      } catch (error) {
        console.error('Error fetching sales:', error);
      }
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await refreshExpenses(); 
        await refreshSales(); // Refrescar las ventas cuando el usuario inicia sesión
      } else {
        setExpenses([]);
        setSales([]); // Limpiar las ventas cuando el usuario cierra sesión
      }
    });
    return () => unsubscribe();
  }, [refreshExpenses, refreshSales]);

  const signOutUser = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, signOutUser, expenses, sales, refreshExpenses, refreshSales }}>
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
