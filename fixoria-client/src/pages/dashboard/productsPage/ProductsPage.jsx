import Loading from "@/components/custom/Loading";
import PageName from "@/components/custom/PageName";
import PageTitle from "@/components/custom/PageTitle";
import AddItem from "@/components/custom/shared/AddItem";
import Export from "@/components/custom/shared/Export";
import Import from "@/components/custom/shared/Import";
import DataTable from "@/components/custom/table/DataTable";
import StatusFilter from "@/components/custom/table/StatusFilter";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useLocalQuery from "@/hook/useLocalQuery";

import { Ellipsis } from "lucide-react";
import { useState } from "react";

const ProductsPage = () => {
  const { data, isLoading, error } = useLocalQuery("./products.json");
  const [selectedStatus, setSelectedStatus] = useState("");

  const columns = [
    {
      accessorKey: "product_name",
      header: "Product Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 lg:w-[300px]">
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
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const stock = row.original.stock;

        if (stock === 0) {
          return (
            <span className="text-red-500 font-semibold">Out of Stock</span>
          );
        } else if (stock < 125) {
          return (
            <div className="flex items-center gap-2">
              <span>{stock}</span>
              <span className="text-yellow-500 font-semibold">Low Stock</span>
            </div>
          );
        } else {
          return <span>{stock}</span>;
        }
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => <span>${row.original.price}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;

        const getStatusClass = (status) => {
          switch (status) {
            case "inactive":
              return "text-red-700 bg-red-100";
            case "published":
              return "text-green-700 bg-green-100";
            case "stock out":
              return "text-yellow-600 bg-yellow-100";
            case "draft list":
              return "text-gray-500 bg-gray-100";
            default:
              return "text-black";
          }
        };

        return (
          <span
            className={`${getStatusClass(
              status
            )} px-3 py-2 rounded-full capitalize font-semibold`}
          >
            {status}
          </span>
        );
      },
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
      <PageTitle title="Products" />

      <div className="flex gap-3 flex-wrap items-center justify-between mb-6">
        <PageName pageName="Products List" />
        <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
          <Import />

          <Export />

          <AddItem itemName={"Create Product"} link={"/add-product"} />
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

export default ProductsPage;
