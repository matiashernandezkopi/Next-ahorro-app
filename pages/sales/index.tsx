'use client';

import { useState, useEffect} from 'react';
import { addSale, deleteSaleById } from './../lib/sales';
import { useAuth } from './../context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';
import { SalesList } from './salesList';
import { SalesForm } from './salesForm';


interface Sales {
  id: string;
  date: string;
  client: string;
  amount: number;
}

const BASIC_DATA:Omit<Sales,'id'> = { amount: 0, client: '',date: '' }


export default function Sales() {
  const { user, sales, refreshSales } = useAuth();
  const [newSale, setNewSale] = useState<Omit<Sales,'id'>>(BASIC_DATA);

  useEffect(() => {
    if (user) {
      refreshSales();
    }
  }, [user, refreshSales]);

  const handleAddSale = async (e: React.FormEvent) => {
    e.preventDefault();



    // valoracion de datos
    if (!newSale.client.trim()) {
      alert('Ingrese un nombre para el gasto');
      return;
    }
    

    if (user) {
      try {
        await addSale({ ...newSale, userId: user.uid, id: uuidv4() });
        setNewSale(BASIC_DATA);
        await refreshSales(); // Actualiza los gastos después de agregar uno
      } catch (error) {
        console.error('Error adding Sale:', error);
      }
    }
  };

  const handleDeleteSale = async (id: string) => {
    try {
      await deleteSaleById(id);
      await refreshSales(); // Actualiza los gastos después de eliminar uno
    } catch (error) {
      console.error('Error deleting Sale:', error);
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


          {/** boton para consol.log(sales) */}

          <button onClick={()=>{console.log(sales)}}>
            click
          </button>



          <SalesForm newSale={newSale} handleAddSale={handleAddSale} setNewSale={setNewSale}/>
          <SalesList sales={sales} handleDeleteSale={handleDeleteSale} />
        </div>
      </main>
    </div>
  );
}
