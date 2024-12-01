import { Search } from "lucide-react";
import { useState } from "react";

const DashboardCustomerSearch = ({ setColumnFilters }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setColumnFilters([
      {
        id: "name",
        value: value,
      },
    ]);
  };

  return (
    <div className="sm:w-2/3 lg:w-1/3 relative">
      <input
        value={searchTerm}
        onChange={handleSearchChange}
        type="search"
        placeholder="Search"
        className="lg:px-4 px-2 py-2 border border-gray-300 rounded-lg w-full outline-0 bg-white"
      />
      <Search className="w-[20px] h-[20px] text-gray-600 absolute top-[10px] right-3 md:right-8" />
    </div>
  );
};

export default DashboardCustomerSearch;
