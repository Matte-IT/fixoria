import React from "react";
import { Printer } from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const PrintData = () => {
  const data = [
    {
      id: "1",
      date: "03/12/2024",
      invoiceNo: 2,
      partyName: "Jahid",
      transaction: "Sale",
      paymentType: "Cash",
      amount: 500,
      balanceDue: 200,
    },
    {
      id: "2",
      date: "02/12/2024",
      invoiceNo: 1,
      partyName: "Noman",
      transaction: "Sale",
      paymentType: "Check",
      amount: 200,
      balanceDue: 100,
    },
  ];

  const handlePrintPDF = () => {
    const doc = new jsPDF();

    // Invoice Header
    doc.setFontSize(16);
    doc.text("INVOICE", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text("Invoice No: #001", 14, 40);
    doc.text("Party Name: John Doe", 14, 50);
    doc.text("Transaction Type: Sale", 14, 60);

    // Table
    const tableColumn = [
      "ID",
      "Date",
      "Invoice No",
      "Party Name",
      "Payment Type",
      "Amount",
      "Balance Due",
    ];

    const tableRows = data.map((item) => [
      item.id,
      item.date,
      item.invoiceNo,
      item.partyName,
      item.paymentType,
      item.amount,
      item.balanceDue,
    ]);

    doc.autoTable({
      startY: 70,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
    });

    // Footer
    const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
    const totalBalanceDue = data.reduce(
      (sum, item) => sum + item.balanceDue,
      0
    );

    doc.setFontSize(12);
    doc.text(
      `Total Amount: ${totalAmount} BDT`,
      14,
      doc.lastAutoTable.finalY + 10
    );
    doc.text(
      `Total Balance Due: ${totalBalanceDue} BDT`,
      14,
      doc.lastAutoTable.finalY + 20
    );

    doc.text(
      "Thank you for your business!",
      105,
      doc.lastAutoTable.finalY + 40,
      {
        align: "center",
      }
    );

    // Save PDF
    doc.save("invoice.pdf");
  };

  return (
    <div>
      <Printer onClick={handlePrintPDF} style={{ cursor: "pointer" }} />
    </div>
  );
};

export default PrintData;
