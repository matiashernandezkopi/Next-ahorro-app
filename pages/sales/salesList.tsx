import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, parse, isValid, getYear } from 'date-fns';
import { es } from 'date-fns/locale'; // Importar locale en español
import React from 'react';

interface Sales {
  id: string;
  date: string; // Formato esperado: "dd/MM/yyyy"
  client: string;
  amount: number;
}

interface SalesListProps {
  sales: Sales[];
  selectedYear: number; // Añadir selectedYear como prop
  handleDeleteSale: (id: string) => void;
}

interface GroupedSales {
  [key: string]: Sales[]; // key será el mes/año, ej: "09/2024"
}

export const SalesList: React.FC<SalesListProps> = ({ sales, selectedYear, handleDeleteSale }) => {
  
  // Función para agrupar ventas por mes y año, filtrando por el año seleccionado
  const groupSalesByMonthYear = (sales: Sales[], year: number): GroupedSales => {
    return sales.reduce((groups, sale) => {
      const saleDate = parse(sale.date, 'dd/MM/yyyy', new Date());

      // Verifica si la fecha es válida y pertenece al año seleccionado
      if (!isValid(saleDate) || getYear(saleDate) !== year) {
        return groups; // Ignorar ventas con fecha inválida o de un año diferente
      }

      const monthYear = format(saleDate, 'MM/yyyy'); // Formato de mes/año
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(sale);
      return groups;
    }, {} as GroupedSales);
  };

  // Agrupamos y ordenamos las ventas por mes/año del año seleccionado
  const groupedSales = groupSalesByMonthYear(sales, selectedYear);

  // Obtener los meses ordenados en orden cronológico
  const sortedMonths = Object.keys(groupedSales).sort((a, b) => {
    const dateA = parse(`01/${a}`, 'dd/MM/yyyy', new Date());
    const dateB = parse(`01/${b}`, 'dd/MM/yyyy', new Date());
    return dateA.getTime() - dateB.getTime(); // Orden cronológico
  });

  // Calcular el total de ventas del año seleccionado
  const totalYearlySales = sales
    .filter(sale => isValid(parse(sale.date, 'dd/MM/yyyy', new Date())) && getYear(parse(sale.date, 'dd/MM/yyyy', new Date())) === selectedYear)
    .reduce((acc, sale) => acc + sale.amount, 0);

  // Calcular el total general de ventas
  const totalGeneralSales = sales.reduce((acc, sale) => acc + sale.amount, 0);

  return (
    <div>
      {/* Mostrar el total general */}
      <TotalNumber total={totalGeneralSales} size='text-xl'>Total general: $</TotalNumber>
      
      {/* Mostrar el total del año seleccionado */}
      <TotalNumber total={totalYearlySales} size='text-lg'>Total del año {selectedYear}: $</TotalNumber>
      
      {sortedMonths.map((monthYear) => {
        // Calcular el total de ventas para el mes actual
        const monthlySales = groupedSales[monthYear];
        const monthlyTotal = monthlySales.reduce((acc, sale) => acc + sale.amount, 0);

        return (
          <div key={monthYear} className="mb-6">
             <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white text-center">
              {format(parse(`01/${monthYear}`, 'dd/MM/yyyy', new Date()), 'MMMM yyyy', { locale: es })}
            </h2>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead className="text-right">Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlySales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.client}</TableCell>
                    <TableCell className="text-right">
                      ${sale.amount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {/* Formato en español */}
                    </TableCell>
                    <TableCell className="text-right">{sale.date}</TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={() => handleDeleteSale(sale.id)}
                        className="bg-red-600 dark:bg-red-500 hover:bg-red-500 dark:hover:bg-red-400 text-white font-semibold py-1 px-3 rounded"
                      >
                        Eliminar
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2}>Total del mes</TableCell>
                  <TableCell className="text-right">${monthlyTotal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  <TableCell />
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        );
      })}
    </div>
  );
}

interface TotalNumberProps {
  children: React.ReactNode; // Añadir children como prop
  total: number; // Añadir total como prop
  size?: string; // Añadir size opcional como prop (default: '')
}

const TotalNumber: React.FC<TotalNumberProps> = ({ children, total, size }) => {
  return (
    <div className={`mt-2 ${size} font-semibold text-black dark:text-white`}>
      {children}
      {total.toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} {/* Formato en español */}
    </div>
  );
}
