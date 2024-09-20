'use client';

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { format, isValid, parse, getYear } from "date-fns";
import { es } from "date-fns/locale";

interface Sales {
  id: string;
  date: string;
  client: string;
  amount: number;
}

interface SalesChartProps {
  sales: Sales[];
  selectedYear: number; // Recibe el año seleccionado como prop
}

export function SalesChart({ sales, selectedYear }: SalesChartProps) {
  // Función para agrupar ventas por mes y calcular totales solo del año seleccionado
  const getMonthlySalesData = (sales: Sales[], year: number) => {
    const monthlyData: { month: string; total: number; date: Date }[] = [];

    sales.forEach((sale) => {
      const saleDate = parse(sale.date, "dd/MM/yyyy", new Date());

      // Verifica si la fecha es válida y pertenece al año seleccionado
      if (!isValid(saleDate) || getYear(saleDate) !== year) {
        return; // Ignorar la venta si la fecha es inválida o no es del año seleccionado
      }

      const month = format(saleDate, "MMMM", { locale: es }).toLowerCase();
      const existingMonth = monthlyData.find((data) => data.month === month);

      if (existingMonth) {
        existingMonth.total += sale.amount;
      } else {
        monthlyData.push({ month, total: sale.amount, date: saleDate });
      }
    });

    // Ordenar los meses de acuerdo a la fecha (cronológicamente)
    return monthlyData.sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const chartData = getMonthlySalesData(sales, selectedYear); // Filtrar las ventas por el año seleccionado

  const chartConfig = {
    total: {
      label: "Total Ventas",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <div className="w-3/4">
      <Card>
        <CardHeader>
          <CardTitle>Gráfico de Ventas por Mes</CardTitle>
          <CardDescription>Resumen de ventas</CardDescription>
        </CardHeader>
        <CardContent className="bg-gray-50 dark:bg-gray-800">
          <ChartContainer config={chartConfig}>
            <BarChart data={chartData} layout="vertical" margin={{ right: 50, left: 20 }}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" className="dark:stroke-gray-600" />
              <YAxis dataKey="month" type="category" tickLine={false} tickMargin={10} axisLine={false} />
              <XAxis dataKey="total" type="number" />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <Bar dataKey="total" fill="hsl(var(--chart-1))" radius={4}>
                <LabelList
                  dataKey="month"
                  position="insideLeft"
                  offset={8}
                  className="fill-[--color-label] dark:fill-gray-200"
                  fontSize={12}
                />
                <LabelList
                  dataKey="total"
                  position="right"
                  offset={8}
                  className="fill-foreground dark:fill-gray-200"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm"></CardFooter>
      </Card>
    </div>
  );
}
