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
import { es } from 'date-fns/locale';
import React, { useState } from 'react';
import { Input } from "@/components/ui/input"; // Importar Input

interface Sales {
  id: string;
  date: string; // Formato esperado: "dd/MM/yyyy"
  client: string;
  amount: number;
}

interface SalesListProps {
  sales: Sales[];
  selectedYear: number; 
  handleDeleteSale: (id: string) => void;
}

interface GroupedSales {
  [key: string]: Sales[]; 
}

export const SalesList: React.FC<SalesListProps> = ({ sales, selectedYear, handleDeleteSale }) => {
  const [searchTerm, setSearchTerm] = useState(""); 

  const groupSalesByMonthYear = (sales: Sales[], year: number): GroupedSales => {
    return sales.reduce((groups, sale) => {
      const saleDate = parse(sale.date, 'dd/MM/yyyy', new Date());
      if (!isValid(saleDate) || getYear(saleDate) !== year) {
        return groups;
      }
      const monthYear = format(saleDate, 'MM/yyyy');
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(sale);
      return groups;
    }, {} as GroupedSales);
  };

  const groupedSales = groupSalesByMonthYear(sales, selectedYear);
  const sortedMonths = Object.keys(groupedSales).sort((a, b) => {
    const dateA = parse(`01/${a}`, 'dd/MM/yyyy', new Date());
    const dateB = parse(`01/${b}`, 'dd/MM/yyyy', new Date());
    return dateA.getTime() - dateB.getTime();
  });

  const filteredSales = (monthYear: string) => {
    return groupedSales[monthYear].filter((sale) =>
      sale.client.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const totalYearlySales = sales
    .filter(sale => isValid(parse(sale.date, 'dd/MM/yyyy', new Date())) && getYear(parse(sale.date, 'dd/MM/yyyy', new Date())) === selectedYear)
    .reduce((acc, sale) => acc + sale.amount, 0);

  const totalGeneralSales = sales.reduce((acc, sale) => acc + sale.amount, 0);

  return (
    <div>
      <TotalNumber total={totalGeneralSales} size='text-xl'>Total general: $</TotalNumber>
      <TotalNumber total={totalYearlySales} size='text-lg'>Total del año {selectedYear}: $</TotalNumber>

      <div className="mb-4">
      <Input
        placeholder="Buscar por cliente..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 border rounded border-chart-1 focus:border-chart-1 focus:outline-none"
      />
      </div>

      {sortedMonths.map((monthYear) => {
      const monthlySales = filteredSales(monthYear);

      // Verificar si hay ventas para el mes y el filtro actual
      if (monthlySales.length === 0) return null;

      const monthlyTotal = monthlySales.reduce((acc, sale) => acc + sale.amount, 0);

      return (
        <div key={monthYear} className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white text-center">
            {format(parse(`01/${monthYear}`, 'dd/MM/yyyy', new Date()), 'MMMM', { locale: es })}
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
                    ${sale.amount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
};

interface TotalNumberProps {
  children: React.ReactNode; 
  total: number; 
  size?: string; 
}

const TotalNumber: React.FC<TotalNumberProps> = ({ children, total, size }) => {
  return (
    <div className={`mt-2 ${size} font-semibold text-black dark:text-white`}>
      {children}
      {total.toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </div>
  );
}
