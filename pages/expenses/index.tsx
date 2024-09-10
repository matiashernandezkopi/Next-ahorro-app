// pages/expenses/index.tsx
import { useState, useEffect, useCallback } from 'react';
import { addExpense, deleteExpenseById, getExpenses } from '../lib/expenses';
import { useAuth } from '../context/AuthContext';
import router from 'next/router';
import { v4 as uuidv4 } from 'uuid';

interface Expense {
  id: string;
  name: string;
  amount: number;
}

export default function Expenses() {
  const { user } = useAuth();
  const [newExpense, setNewExpense] = useState<{ name: string; amount: number }>({ name: '', amount: 0 });
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const fetchExpenses = useCallback(async () => {
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
    fetchExpenses();
  }, [fetchExpenses]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      try {
        await addExpense({ ...newExpense, userId: user.uid, id: uuidv4() });
        setNewExpense({ name: '', amount: 0 });
        fetchExpenses();
      } catch (error) {
        console.error('Error adding expense:', error);
      }
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpenseById(id);
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-black p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Gastos del Usuario</h1>
          <button 
            onClick={() => router.push('/')} 
            className="bg-blue-800 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Home
          </button>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleAddExpense} className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-black">Agregar Gasto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Nombre del Gasto" 
                value={newExpense.name} 
                onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full text-black"
              />
              <input 
                type="number" 
                placeholder="Cantidad" 
                value={newExpense.amount} 
                onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full text-black"
              />
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded col-span-2"
              >
                Agregar Gasto
              </button>
            </div>
          </form>
          <ul>
            {expenses.map((expense) => (
              <li key={expense.id} className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-lg mb-2 p-4 text-black">
                <div>
                  <span className="font-medium">{expense.name}</span>: ${expense.amount}
                </div>
                <button 
                  onClick={() => handleDeleteExpense(expense.id)}
                  className="bg-red-600 hover:bg-red-500 text-white font-semibold py-1 px-3 rounded"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
