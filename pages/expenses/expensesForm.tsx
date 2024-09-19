interface ExpensesFormProps {
    newExpense: Omit<Expense, 'id'>;
    handleAddExpense: (e: React.FormEvent) => void;
    setNewExpense: React.Dispatch<React.SetStateAction<Omit<Expense, 'id'>>>;
}

export const ExpensesForm: React.FC<ExpensesFormProps> = ({ handleAddExpense, newExpense, setNewExpense }) => {
    return (
        <form onSubmit={handleAddExpense} className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Agregar Gasto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                    type="text" 
                    placeholder="Nombre del Gasto" 
                    value={newExpense.name} 
                    onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                    className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 w-full text-black dark:text-white bg-white dark:bg-gray-800"
                />
                <input 
                    type="text" 
                    placeholder="Cantidad" 
                    value={newExpense.amount.toLocaleString('en-US', { maximumFractionDigits: 2 })} 
                    onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                    className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 w-full text-black dark:text-white bg-white dark:bg-gray-800"
                />
                <button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded col-span-2"
                >
                    Agregar Gasto
                </button>
            </div>
        </form>
    )
}
