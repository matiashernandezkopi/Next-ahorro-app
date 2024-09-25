'use client';

// lib/expenses.ts
import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';



// Función para agregar un gasto
export async function addExpense(expense: Expense): Promise<void> {
  try {
    const expensesRef = collection(db, 'expenses');
    await addDoc(expensesRef, expense);
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
}

// Función para obtener los gastos del usuario
export async function getExpenses(userId: string): Promise<Expense[]> {
  try {
    const expensesRef = collection(db, 'expenses');
    const q = query(expensesRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const expenses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Expense, 'id'>)  // Asegúrate de que todos los campos están presentes
    }));
    return expenses;
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
}

// Función para eliminar un gasto
export async function deleteExpenseById(id: string): Promise<void> {
    try {
      // Referencia a la colección de gastos
      const expensesRef = collection(db, 'expenses');
      
      // Consulta para encontrar el documento con el nombre proporcionado
      const q = query(expensesRef, where('id', '==', id));
      
      // Ejecuta la consulta
      const querySnapshot = await getDocs(q);
  
      // Verifica si se encontró al menos un documento
      if (querySnapshot.empty) {
        console.error(`No expense found with name ${id}`);
        return;
      }
  
      // Elimina todos los documentos encontrados con el nombre proporcionado
      for (const docSnapshot of querySnapshot.docs) {
        const expenseRef = doc(db, 'expenses', docSnapshot.id);
        await deleteDoc(expenseRef);
        console.log(`Expense with ID ${docSnapshot.id} deleted successfully.`);
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
}
  