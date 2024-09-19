"use client";

import * as React from "react";
import { format} from "date-fns";
import { es } from "date-fns/locale"; // Importa el locale en español
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";


interface DatePickerDemoProps {
  onDateChange: (date: string) => void;
  initialDate?: Date; // Añade una prop para la fecha inicial
}

export function DatePickerDemo({ onDateChange, initialDate }: DatePickerDemoProps) {
  const [date, setDate] = React.useState<Date | undefined>(initialDate || new Date()); // Usa la fecha inicial si está disponible

  // Actualiza la fecha en el formato deseado cuando se selecciona una nueva fecha
  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      const formattedDate = format(selectedDate, "dd/MM/yyyy"); // Formatear la fecha
      onDateChange(formattedDate); // Pasar la fecha formateada al padre
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal text-muted-foreground",
            "dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd/MM/yyyy") : <span>Selecciona una fecha</span>} {/* Cambiado a español */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 dark:bg-gray-900 dark:text-gray-100">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          initialFocus
          locale={es} // Asegúrate de que el componente Calendar acepte la prop 'locale'
          
          className="dark:bg-gray-900 dark:text-gray-100"
        />
      </PopoverContent>
    </Popover>
  );
}
