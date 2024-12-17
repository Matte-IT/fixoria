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
import { useState } from "react";
import GraphView from "./GraphView";
import useTanstackQuery from "@/hook/useTanstackQuery";
import Loading from "@/components/custom/Loading";
import { Link } from "react-router-dom";

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor("sales_date", {
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
  columnHelper.accessor("sales_id", {
    header: "INVOICE NO.",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("party_name", {
    header: "PARTY NAME",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("grand_total", {
    header: "Grand Total",
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: "print",
    cell: () => (
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Printer className="h-4 w-4" />
        <span className="sr-only">Print</span>
      </Button>
    ),
  }),
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Link to={`/edit-sale/${row.original.sales_id}`}>
            <DropdownMenuItem className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
          </Link>

          <DropdownMenuItem
            onClick={() => console.log("Delete", row.original.sales_id)}
            className="cursor-pointer"
          >
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }),
];

const SalePage = () => {
  const [view, setView] = useState("table");

  const { data, isLoading, error } = useTanstackQuery("/sales");

  if (view === "graph") {
    return <GraphView setView={setView} />;
  }

  return (
    <div>
      <PageTitle title="Sale Invoice" />

      <SalePageHeader setView={setView} data={data} />

      <div className="flex gap-3 flex-wrap items-center justify-between my-6">
        <PageName pageName="Sale Invoice" />
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <DataTable data={data} columns={columns}>
          <AddItem itemName={"Add Sale"} link={"/add-sale"} />
        </DataTable>
      )}
    </div>
  );
};

export default SalePage;
