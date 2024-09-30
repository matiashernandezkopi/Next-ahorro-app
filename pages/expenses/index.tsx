'use client';

import { useState, useEffect } from 'react';
import { addExpense, deleteExpenseById } from './../lib/expenses';
import { useAuth } from './../context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';
import { ExpensesBarChart } from './barcharm';
import { format, getYear } from 'date-fns';
import { SalesList } from '../salesAndExpenses/salesList';
import { SalesForm } from '../salesAndExpenses/salesForm';
//import { SalesChart } from '../sales/barchar';





const BASIC_DATA: Omit<Expense, 'id' | 'date' | 'userId'> = { amount: 0, client: '' };
const initialDate = format(new Date(), 'dd/MM/yyyy'); // Establecer la fecha inicial en formato "día/mes/año"
const RESET: Omit<Expense, 'id' | 'userId'> = {
  ...BASIC_DATA,
  date: initialDate, // Asegúrate de que 'date' esté aquí
};


export default function Expenses() {
  const { user, expenses, refreshExpenses } = useAuth();
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id' | 'userId'>>(RESET);
  const [selectedYear, setSelectedYear] = useState(getYear(new Date())); // Estado para el año seleccionado
  

  useEffect(() => {
    if (user) {
      refreshExpenses();
    }
  }, [user, refreshExpenses]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación de datos
    if (!newExpense.client.trim()) {
      alert('Ingrese un nombre para el gasto');
      return;
    }

    if (user) {
      try {
        await addExpense({ ...newExpense, userId: user.uid, id: uuidv4() });
        setNewExpense(RESET);
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

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(event.target.value)); // Actualiza el año seleccionado
  };

  // Obtener los años disponibles de las ventas
  const availableYears = Array.from(new Set(expenses.map((sale) => getYear(new Date(sale.date)))));


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <header className="bg-blue-600 dark:bg-blue-800 text-black dark:text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gastos del Usuario</h1>
          <Link href="/" className="bg-blue-800 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
            Home
          </Link>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          {/** Botón para consol.log(expenses) */}
          <button onClick={() => { console.log(expenses) }} className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-400 dark:hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded mb-4">
            Click
          </button>
          <div>
            <label htmlFor="year-select" className="block mb-2">
              Selecciona el año:
            </label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={handleYearChange}
              className="border p-2 rounded dark:bg-gray-700 dark:text-white"
            >
              {availableYears.map((year) => {
                if (isNaN(year)) {
                  return
                }
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                )
              })}
            
            </select>

            {/* Puedes agregar más gráficos de barras aquí y pasar el mismo selectedYear */}
          </div>

          <ExpensesBarChart />
          <SalesForm newSale={newExpense} handleAddSale={handleAddExpense} setNewSale={setNewExpense} type={'Gasto'}/>
          <SalesList sales={expenses} selectedYear={selectedYear} handleDeleteSale={handleDeleteExpense} negative={true}/>
          {/** <SalesChart sales={expenses} selectedYear={} /> */}
        </div>
      </main>
    </div>
  );
}
