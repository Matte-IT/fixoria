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
import useTanstackQuery from "@/hook/useTanstackQuery";
import { createColumnHelper } from "@tanstack/react-table";
import { Edit, MoreVertical, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import PurchasePageHeader from "../purchasePage/PurchasePageHeader";

const columnHelper = createColumnHelper();

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

const AllPaymentIn = () => {
  const { data, isLoading, error } = useTanstackQuery("/purchase/all");

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <p>Error</p>;
  }

  return (
    <div>
      <PageTitle title="All Payment In" />

      <PurchasePageHeader data={data} />

      <div className="flex gap-3 flex-wrap items-center justify-between my-6">
        <PageName pageName="All Payment In" />
      </div>

      <DataTable data={data} columns={columns}>
        <AddItem itemName={"Add Payment-In"} link={"/add-paymentIn"} />
      </DataTable>
    </div>
  );
};

export default AllPaymentIn;
