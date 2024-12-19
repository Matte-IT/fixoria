import { FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";

export default function ExcelData({ data, type }) {
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${type}_data.xlsx`);
  };

  return (
    <div title="Download as excel format">
      <FileSpreadsheet
        className="cursor-pointer"
        onClick={() => downloadExcel()}
      />
    </div>
  );
}
