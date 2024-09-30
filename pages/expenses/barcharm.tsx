import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Tooltip, LabelList, TooltipProps } from "recharts";
import { useMemo } from "react";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale"; // Importamos el locale español

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart";
import { useAuth } from "../context/AuthContext";

// Configuración del gráfico
const chartConfig = {
  amount: {
    label: "Amount",
  },
} satisfies ChartConfig;

type Transaction = {
  amount: number;
  date: string; // Formato 'dd/MM/yyyy'
};


// Tooltip personalizado
const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip bg-white dark:bg-black p-2 border rounded-md shadow-lg dark:text-white">
        <p className="label">{`Month: ${data.month}`}</p> {/* Muestra el nombre del mes */}
        <p className="intro">{`Difference: ${data.amount.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

// Función para agrupar datos por mes
const groupDataByMonth = (data: Transaction[], type: 'sales' | 'expenses') => {
  return data.reduce((acc, item) => {
    // Parseamos la fecha y formateamos el mes en texto largo
    const month = format(parse(item.date, 'dd/MM/yyyy', new Date()), 'MMMM', { locale: es });
    if (!acc[month]) {
      acc[month] = { sales: 0, expenses: 0 };
    }
    acc[month][type] += item.amount;
    return acc;
  }, {} as Record<string, { sales: number, expenses: number }>);
};

export function ExpensesBarChart() {
  const { expenses, sales } = useAuth();

  // Combina los datos de ventas y gastos mes a mes
  const chartData = useMemo(() => {
    const groupedSales = groupDataByMonth(sales, 'sales');
    const groupedExpenses = groupDataByMonth(expenses, 'expenses');

    // Combina los resultados y calcula la diferencia (sales - expenses)
    const allMonths = new Set([...Object.keys(groupedSales), ...Object.keys(groupedExpenses)]);
    return Array.from(allMonths).map(month => ({
      month,
      amount: (groupedSales[month]?.sales || 0) - (groupedExpenses[month]?.expenses || 0),
    }));
  }, [expenses, sales]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Sales - Expenses Difference</CardTitle>
        <CardDescription>Overview of sales minus expenses by month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount">
              <LabelList dataKey="month" position="top" fillOpacity={1} />
              {chartData.map((item) => (
                <Cell
                  key={item.month}
                  fill={item.amount > 0 ? "rgba(54, 162, 235, 0.6)" : "rgba(255, 99, 132, 0.6)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total amounts for selected data
        </div>
      </CardFooter>
    </Card>
  );
}
