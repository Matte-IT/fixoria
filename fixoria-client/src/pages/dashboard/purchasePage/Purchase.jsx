import PageName from "@/components/custom/PageName";
import PageTitle from "@/components/custom/PageTitle";
import AddItem from "@/components/custom/shared/AddItem";

import Loading from "@/components/custom/Loading";
import DataTable from "@/components/custom/table/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useTanstackQuery, { axiosInstance } from "@/hook/useTanstackQuery";
import { createColumnHelper } from "@tanstack/react-table";
import { Edit, MoreVertical, Trash, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import PurchasePageHeader from "./PurchasePageHeader";
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const columnHelper = createColumnHelper();

const generatePDF = async (purchaseId) => {
  try {
    const response = await axiosInstance.get(`/purchase/${purchaseId}`);
    const data = response.data;
    console.log('Purchase Data:', data);

    const unitsResponse = await axiosInstance.get('/unit');
    const units = unitsResponse.data;
    console.log('Units Data:', units);

    const itemsResponse = await axiosInstance.get('/product/all');
    const items = itemsResponse.data;
    console.log('Items Data:', items);

    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Purchase Bill Invoice', 105, 15, { align: 'center' });
    
    // Add invoice details
    doc.setFontSize(12);
    doc.text(`Invoice No: INV-${data.purchase_id}`, 15, 30);
    doc.text(`Date: ${new Date(data.purchase_date).toLocaleDateString('en-GB')}`, 15, 40);
    doc.text(`Party: ${data.party_name}`, 15, 50);
    
    // Add items table
    const tableColumn = ["Item", "Quantity", "Unit", "Price", "Tax", "Discount", "Total"];
    const tableRows = data.purchase_details.map(item => {
      const itemData = items.find(i => i.item_id === item.item_id);
      console.log('Item Data:', itemData);
      
      const unit = units.find(u => u.unit_id === itemData?.unit_id);
      console.log('Unit Found:', unit);
      
      const unitName = unit ? unit.unit_name : '';

      return [
        item.item_name,
        item.quantity,
        unitName,
        `$${item.price}`,
        `$${item.tax_amount}`,
        `$${item.discount_amount}`,
        `$${item.total}`
      ];
    });

    doc.autoTable({
      startY: 60,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      columnStyles: {
        0: { cellWidth: 40 }, // Item
        1: { cellWidth: 20 }, // Quantity
        2: { cellWidth: 20 }, // Unit
        3: { cellWidth: 20 }, // Price
        4: { cellWidth: 20 }, // Tax
        5: { cellWidth: 20 }, // Discount
        6: { cellWidth: 30 }  // Total
      }
    });
    
    // Add totals
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Sub Total: $${data.total_amount}`, 140, finalY);
    doc.text(`Tax: $${data.tax_amount}`, 140, finalY + 10);
    doc.text(`Discount: $${data.discount_amount}`, 140, finalY + 20);
    doc.text(`Grand Total: $${data.grand_total}`, 140, finalY + 30);
    
    // Add notes if any
    if (data.notes) {
      doc.text('Notes:', 15, finalY + 45);
      doc.text(data.notes, 15, finalY + 55);
    }

    // Open PDF in new tab
    window.open(doc.output('bloburl'), '_blank');
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error('Error generating PDF');
  }
};

export const columns = [
  columnHelper.accessor("purchase_date", {
    header: "DATE",
    cell: (info) => {
      const date = new Date(info.getValue());

      // Format the date into the desired format
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      // Extract the day from the date
      const day = date.getDate();

      // Add the correct suffix for the day
      const suffix =
        day % 10 === 1 && day !== 11
          ? "st"
          : day % 10 === 2 && day !== 12
          ? "nd"
          : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";

      // Return the formatted date with the suffix
      return formattedDate.replace(day.toString(), `${day}${suffix}`);
    },
  }),

  columnHelper.accessor("purchase_id", {
    header: "INVOICE NO.",
    cell: (info) => `INV-${info.getValue()}`,
  }),

  columnHelper.accessor("party_name", {
    header: "PARTY NAME",
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor("grand_total", {
    header: "Grand Total",
    cell: (info) => `$${parseFloat(info.getValue()).toFixed(2)}`,
  }),

  columnHelper.display({
    header: "PDF",
    id: "pdf",
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => generatePDF(row.original.purchase_id)}
      >
        <Printer className="h-4 w-4" />
      </Button>
    ),
  }),

  columnHelper.display({
    header: "Action",
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 focus-visible:ring-offset-0 focus-visible:ring-0"
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link
              to={`/edit-purchase/${row.original.purchase_id}`}
              className="flex items-center gap-x-2 w-full"
            >
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Delete", row.original.purchase_id)}
          >
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }),
];

export default function Purchase() {
  const { data, isLoading, error } = useTanstackQuery("/purchase/all");

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <p>Error</p>;
  }

  return (
    <div>
      <PageTitle title="Purchase Bills" />

      <PurchasePageHeader data={data} />

      <div className="flex gap-3 flex-wrap items-center justify-between my-6">
        <PageName pageName="Purchase Bills" />
      </div>

      <DataTable data={data} columns={columns}>
        <AddItem itemName={"Add Purchase"} link={"/add-purchase"} />
      </DataTable>
    </div>
  );
}
