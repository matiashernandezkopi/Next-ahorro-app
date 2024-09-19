interface ExpensesListProps {
    expenses: Expense[];
    handleDeleteExpense: (id: string) => void; // Función para eliminar un gasto por ID
}

export const ExpensesList: React.FC<ExpensesListProps> = ({ expenses, handleDeleteExpense }) => {
    const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);

    return (
        <ul className="list-none p-0">
            {expenses.map((expense) => (
                <li key={expense.id} className="flex justify-between items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mb-2 p-4 text-black dark:text-white">
                    <div>
                        <span className="font-medium">{expense.name}</span>: ${expense.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <button 
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="bg-red-600 hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-600 text-white font-semibold py-1 px-3 rounded"
                    >
                        Eliminar
                    </button>
                </li>
            ))}

            <div className="mt-4 text-xl font-semibold text-black dark:text-white">
                Total: ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
        </ul>
    )
}
