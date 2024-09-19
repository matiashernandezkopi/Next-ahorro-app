import { format, parse, isValid } from 'date-fns';
import { es } from 'date-fns/locale'; // Importar locale en español

interface Sales {
  id: string;
  date: string; // Formato esperado: "dd/MM/yyyy"
  client: string;
  amount: number;
}

interface SalesListProps {
  sales: Sales[];
  handleDeleteSale: (id: string) => void;
}

interface GroupedSales {
  [key: string]: Sales[]; // key será el mes/año, ej: "09/2024"
}

export const SalesList: React.FC<SalesListProps> = ({ sales, handleDeleteSale }) => {
  // Función para agrupar ventas por mes y año
  const groupSalesByMonthYear = (sales: Sales[]): GroupedSales => {
    return sales.reduce((groups, sale) => {
      const saleDate = parse(sale.date, 'dd/MM/yyyy', new Date());

      // Verifica si la fecha es válida
      if (!isValid(saleDate)) {
        console.error(`Fecha inválida: ${sale.date}`);
        return groups; // Ignorar ventas con fecha inválida
      }

      const monthYear = format(saleDate, 'MM/yyyy'); // Formato de mes/año
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(sale);
      return groups;
    }, {} as GroupedSales);
  };

  // Agrupamos y ordenamos las ventas por mes/año
  const groupedSales = groupSalesByMonthYear(sales);

  // Obtener los meses ordenados en orden descendente
  const sortedMonths = Object.keys(groupedSales).sort((a, b) => {
    const dateA = parse(`01/${a}`, 'dd/MM/yyyy', new Date());
    const dateB = parse(`01/${b}`, 'dd/MM/yyyy', new Date());
    return dateB.getTime() - dateA.getTime(); // Cambiar el orden aquí
  });

  return (
    <div>
      <div className="mt-4 text-xl font-semibold text-black dark:text-white">
        Total general: $
        {sales.reduce((acc, sale) => acc + sale.amount, 0).toLocaleString('es-ES', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} {/* Formato en español */}
      </div>
      
      {sortedMonths.map((monthYear) => {
        // Calcular el total de ventas para el mes actual
        const monthlyTotal = groupedSales[monthYear].reduce((acc, sale) => acc + sale.amount, 0);

        return (
          <div key={monthYear} className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-black dark:text-white">
              {format(parse(`01/${monthYear}`, 'dd/MM/yyyy', new Date()), 'MMMM yyyy', { locale: es })} {/* Formato en español */}
            </h2>
            <ul>
              {groupedSales[monthYear].map((sale) => (
                <li
                  key={sale.id}
                  className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mb-2 p-4 text-black dark:text-white"
                >
                  <div>
                    <span className="font-medium">{sale.client}</span>: $
                    {sale.amount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {/* Formato en español */}
                    <span className="text-gray-500 dark:text-gray-400"> - {sale.date}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteSale(sale.id)}
                    className="bg-red-600 dark:bg-red-500 hover:bg-red-500 dark:hover:bg-red-400 text-white font-semibold py-1 px-3 rounded"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-2 font-semibold text-black dark:text-white">
              Total del mes: $
              {monthlyTotal.toLocaleString('es-ES', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} {/* Formato en español */}
            </div>
          </div>
        );
      })}
    </div>
  );
};
