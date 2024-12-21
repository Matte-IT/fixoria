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
import { Edit, MoreVertical, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import PurchasePageHeader from "../purchasePage/PurchasePageHeader";

const ExpenseItems = () => {
  const { data, isLoading, error, refetch } =
    useTanstackQuery("/expense-items");

  // Column definitions inside the component
  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => {
        const value = info.getValue();
        return <span className="capitalize">{value}</span>;
      },
    }),

    columnHelper.accessor("unit_name", {
      header: "Unit Name",
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("price", {
      header: "Item Price",
      cell: (info) => `$${info.getValue()}`,
    }),

    columnHelper.accessor("description", {
      header: "Description",
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
                to={`/edit-expense-item/${row.original.expense_item_id}`}
                className="flex items-center gap-x-2 w-full"
              >
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => deleteExpenseItem(row.original.expense_item_id)}
            >
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
  ];

  // deleteExpenseItem function inside the component
  const deleteExpenseItem = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this item!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.delete(`/expense-items/${id}`);
        toast.success(`${response.data.message}`);
        refetch(); // Trigger the refetch after successful deletion
      } catch (error) {
        toast.error("Failed to delete expense item");
      }
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <p>Error</p>;
  }

  return (
    <div>
      <PageTitle title="All Expense Items" />

      <PurchasePageHeader data={data} />

      <div className="flex gap-3 flex-wrap items-center justify-between my-6">
        <PageName pageName="All Expense Items" />
      </div>

      <DataTable data={data} columns={columns}>
        <AddItem
          itemName={"Create An Expense Item"}
          link={"/create-expense-item"}
        />
      </DataTable>
    </div>
  );
};

export default ExpenseItems;
