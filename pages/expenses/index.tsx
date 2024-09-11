'use client';

import { useState, useEffect} from 'react';
import { addExpense, deleteExpenseById } from './../lib/expenses';
import { useAuth } from './../context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';
import { ExpensesList } from './expensesList';
import { ExpensesForm } from './expensesForm';


export default function Expenses() {
  const { user, expenses, refreshExpenses } = useAuth();
  const [newExpense, setNewExpense] = useState<Omit<Expense,'id'>>({ name: '', amount: 0 });

  useEffect(() => {
    if (user) {
      refreshExpenses();
    }
  }, [user, refreshExpenses]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();



    // valoracion de datos
    if (!newExpense.name.trim()) {
      alert('Ingrese un nombre para el gasto');
      return;
    }
    if (newExpense.amount <= 0) {
      alert('Ingrese un monto válido para el gasto');
      return;
    }

    if (user) {
      try {
        await addExpense({ ...newExpense, userId: user.uid, id: uuidv4() });
        setNewExpense({ name: '', amount: 0 });
        await refreshExpenses(); // Actualiza los gastos después de agregar uno
      } catch (error) {
        console.error('Error adding expense:', error);
      }
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpenseById(id);
      await refreshExpenses(); // Actualiza los gastos después de eliminar uno
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-black p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Gastos del Usuario</h1>
          <Link href="/" className="bg-blue-800 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
            Home
          </Link>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <ExpensesForm newExpense={newExpense} handleAddExpense={handleAddExpense} setNewExpense={setNewExpense}/>
          <ExpensesList expenses={expenses} handleDeleteExpense={handleDeleteExpense} />
        </div>
      </main>
    </div>
  );
}
