'use client';

import { useState, useEffect } from 'react';
import { addSale, deleteSaleById } from './../lib/sales';
import { useAuth } from './../context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';
import { SalesList } from './salesList';
import { SalesForm } from './salesForm';
import { format } from 'date-fns';
import { SalesChart } from './barchar';

interface Sales {
  id: string;
  date: string;
  client: string;
  amount: number;
}

const BASIC_DATA: Omit<Sales, 'id' | 'date'> = { amount: 0, client: '' };
const initialDate = format(new Date(), 'dd/MM/yyyy'); // Establecer la fecha inicial en formato "día/mes/año"
const RESET:Omit<Sales, 'id'> = {
  ...BASIC_DATA,
  date: initialDate, // Asegúrate de que 'date' esté aquí
}

export default function Sales() {
  const { user, sales, refreshSales } = useAuth();
  const [newSale, setNewSale] = useState<Omit<Sales, 'id'>>(RESET);
  

  useEffect(() => {
    if (user) {
      refreshSales();
    }
  }, [user, refreshSales]);

  const handleAddSale = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación de datos
    if (!newSale.client.trim()) {
      alert('Ingrese un nombre para el gasto');
      return;
    }

    if (user) {
      try {
        await addSale({ ...newSale, userId: user.uid, id: uuidv4() });
        setNewSale(RESET);
        await refreshSales(); // Actualiza las ventas después de agregar una
      } catch (error) {
        console.error('Error adding Sale:', error);
      }
    }
  };

  const handleDeleteSale = async (id: string) => {
    try {
      await deleteSaleById(id);
      await refreshSales(); // Actualiza las ventas después de eliminar una
    } catch (error) {
      console.error('Error deleting Sale:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white flex flex-col">
      <header className="bg-blue-600 dark:bg-gray-800 text-black dark:text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Gastos del Usuario</h1>
          <Link href="/" className="bg-blue-800 dark:bg-gray-700 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
            Home
          </Link>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 flex w-full justify-between gap-5">
          <div>
            <SalesForm newSale={newSale} handleAddSale={handleAddSale} setNewSale={setNewSale} />
            <button onClick={() => { console.log(sales); }} className="mb-4 bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded">
              Click
            </button>
            <SalesList sales={sales} handleDeleteSale={handleDeleteSale} />
          
          </div>
          <SalesChart sales={sales} />

        </div>
      </main>
    </div>
  );
}
