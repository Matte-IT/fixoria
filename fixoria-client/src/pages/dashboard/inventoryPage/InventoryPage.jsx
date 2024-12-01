import Loading from "@/components/custom/Loading";
import PageName from "@/components/custom/PageName";
import PageTitle from "@/components/custom/PageTitle";
import DataTable from "@/components/custom/table/DataTable";
import StatusFilter from "@/components/custom/table/StatusFilter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useTanstackQuery from "@/hook/useTanstackQuery";
import {
  ArrowDownToLine,
  Ellipsis,
  FileChartColumnIncreasing,
  Plus,
} from "lucide-react";
import { useState } from "react";
import AddModal from "./AddModal";

const InventoryPage = () => {
  const { data, isLoading, error } = useTanstackQuery("./inventory.json");
  const [selectedStatus, setSelectedStatus] = useState("");

  const columns = [
    {
      accessorKey: "product_name",
      header: "Product Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <img
            src={row.original.product_image}
            alt={row.original.product_name}
            className="w-8 h-8 rounded-md object-cover"
          />
          <span>{row.original.product_name}</span>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <div>
          <span>{row.original.category}</span>
        </div>
      ),
    },
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => (
        <div>
          <span>{row.original.sku}</span>
        </div>
      ),
    },
    {
      accessorKey: "incoming",
      header: "Incoming",
      cell: ({ row }) => (
        <div>
          <span>{row.original.incoming}</span>
        </div>
      ),
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const stock = row.original.stock;

        if (stock === 0) {
          return (
            <span className="text-red-500 font-semibold">Out of Stock</span>
          );
        } else {
          return <span>{stock}</span>;
        }
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;

        const getStatus = (status) => {
          switch (status) {
            case "in stock":
              return (
                <span className="px-3 py-2 rounded-full font-semibold flex items-center w-[90px] gap-1 text-green-700 bg-green-100">
                  <span className="text-xl">•</span>
                  In Stock
                </span>
              );
            case "low stock":
              return (
                <span className="px-3 py-2 rounded-full font-semibold flex items-center w-[105px] gap-1 text-yellow-700 bg-yellow-100">
                  <span className="text-xl">•</span>
                  Low Stock
                </span>
              );
            case "out of stock":
              return (
                <span className="px-3 py-2 rounded-full font-semibold flex items-center w-[125px] gap-1 text-red-700 bg-red-100">
                  <span className="text-xl">•</span>
                  Out Of Stock
                </span>
              );
            default:
              return "text-black";
          }
        };

        return <div>{getStatus(status)}</div>;
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => <span>${row.original.price}</span>,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="text-gray-600">
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Edit</DropdownMenuLabel>
            <DropdownMenuLabel>Delete</DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <p>Error</p>;
  }

  // Filtering Options For StatusFilter Component
  const filteringOptions = [...new Set(data.map((item) => item.status))];

  // Filter Data Based On Selected Status
  const filteredData =
    selectedStatus === ""
      ? data
      : data.filter((item) => item.status === selectedStatus);

  return (
    <div>
      <PageTitle title="Inventory" />

      <div className="flex gap-3 flex-wrap items-center justify-between mb-6">
        <PageName pageName="Inventory" />
        <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
          <Button className="flex items-center gap-x-2 bg-white hover:bg-white text-headingTextColor border border-gray-200 font-semibold">
            <ArrowDownToLine />
            <span>Import</span>
          </Button>

          <Button className="flex items-center gap-x-2 bg-white hover:bg-white text-headingTextColor border border-gray-200 font-semibold">
            <FileChartColumnIncreasing />
            <span>Export</span>
          </Button>

          <Dialog>
            <DialogTrigger className="flex items-center gap-x-2 bg-defaultBlue hover:bg-defaultBlue px-4 py-2 text-white text-base rounded-md">
              <Plus width="16px" height="16px" />
              Add Product
            </DialogTrigger>
            <AddModal />
          </Dialog>
        </div>
      </div>

      <DataTable data={filteredData} columns={columns}>
        <StatusFilter
          options={filteringOptions}
          setSelectedStatus={setSelectedStatus}
        />
      </DataTable>
    </div>
  );
};

export default InventoryPage;
