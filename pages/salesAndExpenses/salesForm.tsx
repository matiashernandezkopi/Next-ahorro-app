import { NumericFormat } from "react-number-format";
import { DatePickerDemo } from "../sales/datepiker";



interface SalesFormProps {
  newSale: Omit<Sales, 'id'|'userId'>;
  handleAddSale: (e: React.FormEvent) => void;
  setNewSale: React.Dispatch<React.SetStateAction<Omit<Sales, 'id'|'userId'>>>;
  type:string
}

export const SalesForm: React.FC<SalesFormProps> = ({ handleAddSale, newSale, setNewSale, type }) => {

  const handleChange = (value:number|undefined) => {
    if (typeof value === 'number' && !isNaN(value)) {
        setNewSale({ ...newSale, amount: value });
      }
    return
  }

  return (
    <form onSubmit={handleAddSale} className="mb-6">
      <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Agregar {type}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder={`Nombre del ${type}`}
          value={newSale.client}
          onChange={(e) => setNewSale({ ...newSale, client: e.target.value })}
          className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 w-full text-black dark:text-white bg-white dark:bg-gray-800"
        />
        <NumericFormat 
                value={newSale.amount} onValueChange={(values) => { handleChange(values.floatValue)}}  
                thousandSeparator="," allowNegative={false} decimalScale={2}
                className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 w-full text-black dark:text-white bg-white dark:bg-gray-800"/>
                
        <DatePickerDemo 
          onDateChange={(date) => setNewSale({ ...newSale, date })}
           // Actualiza newSale.date con la fecha formateada
        />
        <button
          type="submit"
          className="bg-chart-1  hover:bg-chart-1-hover  text-white font-semibold py-2 px-4 rounded col-span-2"
        >
          Agregar {type}
        </button>

      </div>
    </form>
  );
};
