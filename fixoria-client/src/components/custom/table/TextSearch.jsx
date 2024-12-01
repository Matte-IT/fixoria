import { Search } from "lucide-react";

export default function TextSearch({ table }) {
  return (
    <div className="sm:w-2/3 lg:w-1/3 relative">
      <input
        type="text"
        placeholder="Search"
        value={table.getState().globalFilter || ""}
        onChange={(e) => table.setGlobalFilter(e.target.value)}
        className="w-full border p-2 rounded-md outline-0"
      />

      <Search className="absolute -[20px] h-[20px] text-gray-600 top-[10px] right-3 md:right-8" />
    </div>
  );
}
