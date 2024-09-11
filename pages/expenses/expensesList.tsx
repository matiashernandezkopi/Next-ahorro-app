interface expensesListProps {
    expenses: Expense[];
    handleDeleteExpense: (id: string) => void; // Función para eliminar un gasto por ID

}


export const ExpensesList:React.FC<expensesListProps> = ({expenses,handleDeleteExpense}) =>{
    const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);

    return(
        <ul>
            {expenses.map((expense) => (
                <li key={expense.id} className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-lg mb-2 p-4 text-black">
                <div>
                    <span className="font-medium">{expense.name}</span>: ${expense.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <button 
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="bg-red-600 hover:bg-red-500 text-white font-semibold py-1 px-3 rounded"
                >
                    Eliminar
                </button>
                </li>
            ))}

            <div className="mt-4 text-xl font-semibold text-black">
                Total: ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
        </ul>
    )
}