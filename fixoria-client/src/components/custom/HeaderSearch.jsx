import { Search } from "lucide-react";

const HeaderSearch = () => {
  return (
    <div className="sm:w-2/3 lg:w-1/3 relative">
      <input
        type="search"
        placeholder="Search"
        className="lg:px-4 px-2 py-2 border border-gray-300 rounded-lg w-full outline-0 bg-white"
      />
      <button className="absolute top-[10px] right-3 md:right-8 bg-white md:bg-transparent">
        <Search className="w-[20px] h-[20px] text-gray-600" />
      </button>
    </div>
  );
};

export default HeaderSearch;
