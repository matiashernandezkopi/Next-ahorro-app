import { DatePickerDemo } from "./datepiker";

interface Sales {
  id: string;
  date: string;
  client: string;
  amount: number;
}

interface SalesFormProps {
  newSale: Omit<Sales, 'id'>;
  handleAddSale: (e: React.FormEvent) => void;
  setNewSale: React.Dispatch<React.SetStateAction<Omit<Sales, 'id'>>>;
}

export const SalesForm: React.FC<SalesFormProps> = ({ handleAddSale, newSale, setNewSale }) => {
  return (
    <form onSubmit={handleAddSale} className="mb-6">
      <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Agregar Venta</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Nombre del Venta"
          value={newSale.client}
          onChange={(e) => setNewSale({ ...newSale, client: e.target.value })}
          className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 w-full text-black dark:text-white bg-white dark:bg-gray-800"
        />
        <input
          type="number"
          placeholder="Cantidad"
          value={newSale.amount}
          onChange={(e) => setNewSale({ ...newSale, amount: Number(e.target.value) })}
          className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 w-full text-black dark:text-white bg-white dark:bg-gray-800"
        />
        <DatePickerDemo 
          onDateChange={(date) => setNewSale({ ...newSale, date })}
           // Actualiza newSale.date con la fecha formateada
        />
        <button
          type="submit"
          className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-500 dark:hover:bg-blue-400 text-white font-semibold py-2 px-4 rounded col-span-2"
        >
          Agregar Venta
        </button>
      </div>
    </form>
  );
};
