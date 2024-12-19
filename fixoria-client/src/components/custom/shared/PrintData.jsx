import React from "react";
import { Printer } from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const PrintData = ({ data, type }) => {
  const handlePrintPDF = () => {
    const doc = new jsPDF();

    // Title based on type
    const title = type === "purchase" ? "PURCHASE REPORT" : "SALES REPORT";
    doc.setFontSize(16);
    doc.text(title, 105, 20, { align: "center" });

    // Date
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);

    // Table columns
    const columns =
      type === "purchase"
        ? ["Purchase ID", "Date", "Party Name", "Grand Total"]
        : ["Sales ID", "Date", "Party Name", "Grand Total"];

    // Table rows
    const rows = data.map((item) => [
      type === "purchase" ? item.purchase_id : item.sales_id,
      new Date(
        type === "purchase" ? item.purchase_date : item.sales_date
      ).toLocaleDateString(),
      item.party_name,
      item.grand_total,
    ]);

    // Add the table to the PDF
    doc.autoTable({
      startY: 40,
      head: [columns],
      body: rows,
      theme: "grid",
    });

    // Save the PDF
    doc.save(`${type}_report.pdf`);
  };

  return (
    <div>
      <Printer onClick={handlePrintPDF} style={{ cursor: "pointer" }} />
    </div>
  );
};

export default PrintData;
