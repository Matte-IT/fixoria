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
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Edit, MoreVertical, Printer, Trash, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import PurchasePageHeader from "./PurchasePageHeader";
import { baseURL } from "@/utils/baseUrl";

const AllExpenses = () => {
  const { data, isLoading, error, refetch } = useTanstackQuery("/expense");

  const generatePDF = async (expenseId) => {
    try {
      const response = await axiosInstance.get(`/expense/${expenseId}`);
      const data = response.data;

      // Fetch the units
      const unitsResponse = await axiosInstance.get("/unit");
      const units = unitsResponse.data;

      // Fetch the items
      const itemsResponse = await axiosInstance.get("/expense-items");
      const items = itemsResponse.data;

      const doc = new jsPDF();

      // Add title
      doc.setFontSize(20);
      doc.text("Expense Invoice", 105, 15, { align: "center" });

      // Add order details
      doc.setFontSize(12);
      doc.text(`Invoice No: INV-${data.expense_id}`, 15, 30);
      doc.text(
        `Date: ${new Date(data.expense_date).toLocaleDateString("en-GB")}`,
        15,
        40
      );

      // Add items table (expense_details with unit data)
      const tableColumn = ["Item", "Quantity", "Unit", "Price", "AMOUNT"];
      const tableRows = data.expense_details.map((item) => {
        // Find the corresponding item and unit data
        const itemData = items.find(
          (i) => i.expense_item_id === item.expense_item_id
        );
        const unitData = units.find((u) => u.unit_id === itemData?.unit_id);

        const unitName = unitData ? unitData.unit_name : "N/A";

        return [
          item.item_name,
          item.quantity,
          unitName,
          `$${item.price.toFixed(2)}`,
          `$${item.total.toFixed(2)}`,
        ];
      });

      doc.autoTable({
        startY: 70,
        head: [tableColumn],
        body: tableRows,
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      });

      // Add totals
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.text(
        `Total: $${parseFloat(data.total_amount).toFixed(2)}`,
        140,
        finalY
      );
      doc.text(
        `Grand Total: $${parseFloat(data.grand_total).toFixed(2)}`,
        140,
        finalY + 10
      );

      // Add notes if any
      if (data.notes) {
        doc.text("Notes:", 15, finalY + 40);
        doc.text(data.notes, 15, finalY + 50);
      }

      // Open PDF in new tab
      window.open(doc.output("bloburl"), "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Error generating PDF");
    }
  };

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("expense_date", {
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

    columnHelper.accessor("total_amount", {
      header: "Total Amount",
      cell: (info) => {
        const totalAmount = parseFloat(info.getValue()).toFixed(2);

        return `$${totalAmount}`;
      },
    }),

    columnHelper.accessor("grand_total", {
      header: "Grand Total",
      cell: (info) => `$${parseFloat(info.getValue()).toFixed(2)}`,
    }),

    columnHelper.accessor("notes", {
      header: "Notes",
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("uploaded_file_path", {
      header: "View File",
      cell: ({ row }) => {
        const filePath = row.original.uploaded_file_path;
        
        return filePath ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => window.open(`${baseURL}/${filePath}`, '_blank')}
          >
            <FileText className="h-4 w-4" />
          </Button>
        ) : (
          <span className="text-gray-400">No file</span>
        );
      },
    }),

    columnHelper.display({
      header: "PDF",
      id: "pdf",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => generatePDF(row.original.expense_id)}
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
                to={`/edit-expense/${row.original.expense_id}`}
                className="flex items-center gap-x-2 w-full"
              >
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={async () => {
                const result = await Swal.fire({
                  title: "Are you sure?",
                  text: "You won't be able to revert this!",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Yes, delete it!",
                });

                if (result.isConfirmed) {
                  const response = await axiosInstance.delete(
                    `/expense/${row.original.expense_id}`
                  );
                  if (response.status === 200) {
                    toast.success("Expense deleted successfully");
                    refetch();
                  }
                }
              }}
            >
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
  ];

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <p>Error</p>;
  }

  return (
    <div>
      <PageTitle title="All Expenses" />

      <PurchasePageHeader data={data} />

      <div className="flex gap-3 flex-wrap items-center justify-between my-6">
        <PageName pageName="All Expenses" />
      </div>

      <DataTable data={data} columns={columns}>
        <AddItem itemName={"Add Expense"} link={"/add-expense"} />
      </DataTable>
    </div>
  );
};

export default AllExpenses;
