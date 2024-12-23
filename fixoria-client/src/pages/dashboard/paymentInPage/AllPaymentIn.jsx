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
import { Edit, MoreVertical, Printer, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const columnHelper = createColumnHelper();

const generatePDF = (paymentData) => {
  try {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text("Payment Receipt", 105, 15, { align: "center" });

    // Add basic details
    doc.setFontSize(12);
    doc.text(`Receipt No: PAY-${paymentData.payment_in_id}`, 15, 30);
    doc.text(
      `Date: ${new Date(paymentData.payment_date).toLocaleDateString("en-GB")}`,
      15,
      40
    );

    // Add payment details table
    const tableColumn = ["Description", "Details"];
    const tableRows = [
      ["Party Name", paymentData.party_name],
      ["Payment Type", paymentData.payment_type_name],
      ["Amount", `$${parseFloat(paymentData.received_amount).toFixed(2)}`],
    ];

    doc.autoTable({
      startY: 50,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 10,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 10,
        textColor: 50,
      },
      columnStyles: {
        0: { fontStyle: "bold" },
        1: { cellWidth: 100 },
      },
    });

    // Add notes if exists
    if (paymentData.notes) {
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.setFont(undefined, "bold");
      doc.text("Notes:", 15, finalY);
      doc.setFont(undefined, "normal");
      doc.text(paymentData.notes, 15, finalY + 10);
    }

    // Add footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.text("This is a computer generated receipt", 105, pageHeight - 10, {
      align: "center",
    });

    // Open PDF in new tab
    window.open(doc.output("bloburl"), "_blank");
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Error generating PDF");
  }
};

const AllPaymentIn = () => {
  const { data, isLoading, error, refetch } = useTanstackQuery("/payment-in");

  if (isLoading) return <Loading />;
  if (error) return <p>Error</p>;

  const handleDelete = async (id) => {
    try {
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
        try {
          const response = await axiosInstance.delete(`/payment-in/${id}`);
          if (response.status === 200) {
            toast.success("Payment deleted successfully");
            refetch();
          }
        } catch (error) {
          toast.error(
            error.response?.data?.error || "Failed to delete payment"
          );
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  const columns = [
    columnHelper.accessor("payment_date", {
      header: "DATE",
      cell: (info) => {
        const date = new Date(info.getValue());
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
    }),

    columnHelper.accessor("party_name", {
      header: "PARTY NAME",
    }),

    columnHelper.accessor("payment_type_name", {
      header: "PAYMENT TYPE",
    }),

    columnHelper.accessor("received_amount", {
      header: "AMOUNT",
      cell: (info) => `$${parseFloat(info.getValue()).toFixed(2)}`,
    }),

    columnHelper.accessor("notes", {
      header: "NOTES",
      cell: (info) => info.getValue() || "N/A",
    }),

    columnHelper.display({
      header: "PDF",
      id: "pdf",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => generatePDF(row.original)}
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
              className="h-8 w-8 p-0 focus:ring-0 focus:ring-offset-0"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link
                to={`/edit-payment-in/${row.original.payment_in_id}`}
                className="flex items-center w-full cursor-pointer gap-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(row.original.payment_in_id)}
              className="cursor-pointer"
            >
              <Trash className="h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
  ];

  return (
    <div>
      <div className="flex gap-3 flex-wrap items-center justify-between my-6">
        <PageName pageName="All Payment In" />
        <PageTitle title="All Payment In" />
      </div>

      <DataTable data={data} columns={columns}>
        <AddItem itemName="Add Payment-In" link="/add-payment-in" />
      </DataTable>
    </div>
  );
};

export default AllPaymentIn;
