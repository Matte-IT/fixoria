import React from "react";
import * as XLSX from "xlsx";
import { FileSpreadsheet } from "lucide-react";

export default function ExcelData({ data }) {
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "sales_data.xlsx");
  };

  return (
    <div title="Download as excel format">
      <FileSpreadsheet
        className="cursor-pointer"
        onClick={() => downloadExcel()}
      />
      ;
    </div>
  );
}
