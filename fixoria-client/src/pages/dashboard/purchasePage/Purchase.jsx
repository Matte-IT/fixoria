import PageName from "@/components/custom/PageName";
import PageTitle from "@/components/custom/PageTitle";
import AddItem from "@/components/custom/shared/AddItem";

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
import PurchasePageHeader from "./PurchasePageHeader";

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor("date", {
    header: "DATE",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("invoiceNo", {
    header: "INVOICE NO.",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("partyName", {
    header: "PARTY NAME",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("transaction", {
    header: "TRANSACTION",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("paymentType", {
    header: "PAYMENT TYPE",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("amount", {
    header: "AMOUNT",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("balanceDue", {
    header: "BALANCE DUE",
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
          <DropdownMenuItem
            onClick={() => console.log("Edit", row.original.id)}
          >
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Delete", row.original.id)}
          >
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }),
];

export const data = [
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

export default function Purchase() {
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
