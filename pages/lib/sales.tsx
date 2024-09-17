'use client';

// lib/expenses.ts
import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';



// Función para agregar un gasto
export async function addSale(sale:Sales): Promise<void> {
  try {
    const salesRef = collection(db, 'sales');
    await addDoc(salesRef, sale);
  } catch (error) {
    console.error('Error adding sale:', error);
    throw error;
  }
}

// Función para obtener los gastos del usuario
export async function getSales(userId: string): Promise<Sales[]> {
  try {
    const salesRef = collection(db, 'sales');
    const q = query(salesRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const sales = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Sales, 'id'>)  // Asegúrate de que todos los campos están presentes
    }));
    return sales;
  } catch (error) {
    console.error('Error fetching sales:', error);
    throw error;
  }
}

// Función para eliminar un gasto
export async function deleteSaleById(id: string): Promise<void> {
    try {
      // Referencia a la colección de gastos
      const salesRef = collection(db, 'sales');
      
      // Consulta para encontrar el documento con el nombre proporcionado
      const q = query(salesRef, where('id', '==', id));
      
      // Ejecuta la consulta
      const querySnapshot = await getDocs(q);
  
      // Verifica si se encontró al menos un documento
      if (querySnapshot.empty) {
        console.error(`No sale found with name ${id}`);
        return;
      }
  
      // Elimina todos los documentos encontrados con el nombre proporcionado
      for (const docSnapshot of querySnapshot.docs) {
        const salesRef = doc(db, 'sales', docSnapshot.id);
        await deleteDoc(salesRef);
        console.log(`Sale with ID ${docSnapshot.id} deleted successfully.`);
      }
    } catch (error) {
      console.error('Error deleting sale:', error);
      throw error;
    }
}
  