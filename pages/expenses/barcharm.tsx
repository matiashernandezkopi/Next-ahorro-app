"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Cell, Tooltip, LabelList, TooltipProps } from "recharts"

import { useMemo } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"
import { useAuth } from "../context/AuthContext"

export const description = "A bar chart with expenses data"

/*const chartData = [
  {
    id: "22b3caf4-3255-487b-9bd3-ae86e080f27f",
    amount: 2.36,
    userId: "AIZ1yKA4sfZOMofKyV2WpqhlNQ83",
    name: "sdsd",
  },
  {
    id: "28e16a16-1156-4bea-add9-b9b68cd6602e",
    userId: "AIZ1yKA4sfZOMofKyV2WpqhlNQ83",
    amount: 250.5,
    name: "hhghg",
  },
  {
    id: "28e16a16-1156-4bea-02e",
    userId: "AIZ1yKA4sfZOMofKyV2WpqhlNQ83",
    amount: -250.5,
    name: "menos-g",
  },
  {
    id: "49a3332f-748c-482b-b38f-f78d162ce44b",
    amount: 22,
    name: "holaaa",
    userId: "AIZ1yKA4sfZOMofKyV2WpqhlNQ83",
  },
  // Incluye el resto de los objetos
]
*/

const chartConfig = {
  amount: {
    label: "Amount",
  },
} satisfies ChartConfig





// Función para renderizar el contenido del tooltip
const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip bg-white p-2 border rounded-md shadow-lg">
        <p className="label">{`Name: ${data.name}`}</p>
        <p className="intro">{`Amount: ${data.amount}`}</p>
      </div>
    );
  }
  return null;
};

export function ExpensesBarChart() {

    const { expenses } = useAuth();

  // Mapea los datos de expenses a la forma esperada por el gráfico
  const chartData = useMemo(() => 
    expenses.map(expense => ({
      name: expense.client || "Unknown",  // Usa un valor predeterminado si el nombre está vacío
      amount: expense.amount,
      id: expense.id
    })),
    [expenses]
  );



  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Expenses</CardTitle>
        <CardDescription>Overview of amounts</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount">

                <LabelList dataKey="name" position="top" fillOpacity={1} />
                <LabelList
                    dataKey="amount"
                    position="insideTop"
                    fill="#ffffff"
                    formatter={(value: number) => `${value}`}
                />
              {chartData.map((item) => (
                <Cell
                  key={item.id}
                  fill={item.amount > 0 ? "rgba(255, 99, 132, 0.6)" : "rgba(54, 162, 235, 0.6)"} // Colores suaves y transparentes
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
  )
}
