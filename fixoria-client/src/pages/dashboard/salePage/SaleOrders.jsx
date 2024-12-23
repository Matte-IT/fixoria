import PageName from "@/components/custom/PageName";
import PageTitle from "@/components/custom/PageTitle";
import AddItem from "@/components/custom/shared/AddItem";
import { SalePageHeader } from "./SalePageHeader";

import { createColumnHelper } from "@tanstack/react-table";
import DataTable from "@/components/custom/table/DataTable";
import { Button } from "@/components/ui/button";
import { Edit, MoreVertical, Printer, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useTanstackQuery from "@/hook/useTanstackQuery";
import Loading from "@/components/custom/Loading";
import { Link } from "react-router-dom";

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor("sales_order_date", {
    header: "Sales Order Date",
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

  columnHelper.accessor("sales_order_id", {
    header: "Invoice No.",
    cell: (info) => `INV-${info.getValue()}`,
  }),

  columnHelper.accessor("party_name", {
    header: "Party Name",
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor("grand_total", {
    header: "Grand Total",
    cell: (info) => `$${parseFloat(info.getValue()).toFixed(2)}`,
  }),

  columnHelper.accessor("status_name", {
    header: "Current Status",
    cell: (info) => info.getValue(),
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
              to={`/edit-sale-order/${row.original.sales_order_id}`}
              className="flex items-center gap-x-2 w-full"
            >
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              console.log("Delete", row.original.purchase_order_id)
            }
          >
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }),
];

export default function SaleOrders() {
  const { data, isLoading, error } = useTanstackQuery("/sales-order");

  return (
    <div>
      <PageTitle title="Sale Orders" />

      <SalePageHeader data={data} />

      <div className="flex gap-3 flex-wrap items-center justify-between my-6">
        <PageName pageName="Sale Orders" />
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <DataTable data={data} columns={columns}>
          <AddItem itemName={"Add Sale Order"} link={"/add-sale-order"} />
        </DataTable>
      )}
    </div>
  );
}
