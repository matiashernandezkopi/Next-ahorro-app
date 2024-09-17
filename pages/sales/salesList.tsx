interface salesListProps {
    sales: Sales[];
    handleDeleteSale: (id: string) => void; // Función para eliminar un gasto por ID

}


export const SalesList:React.FC<salesListProps> = ({sales,handleDeleteSale}) =>{
    const totalsales = sales.reduce((acc, sale) => acc + sale.amount, 0);

    return(
        <ul>
            {sales.map((sale) => (
                <li key={sale.id} className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-lg mb-2 p-4 text-black">
                <div>
                    <span className="font-medium">{sale.client}</span>: ${sale.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    
                </div>
                <button 
                    onClick={() => handleDeleteSale(sale.id)}
                    className="bg-red-600 hover:bg-red-500 text-white font-semibold py-1 px-3 rounded"
                >
                    Eliminar
                </button>
                </li>
            ))}

            <div className="mt-4 text-xl font-semibold text-black">
                Total: ${totalsales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
        </ul>
    )
}