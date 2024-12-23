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
import useTanstackQuery, { axiosInstance } from "@/hook/useTanstackQuery";

import {
  Edit,
  Ellipsis,
  MoreVertical,
  MoreVerticalIcon,
  Trash,
} from "lucide-react";
import { useState } from "react";

import { baseURL } from "@/utils/baseUrl";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { toast } from "react-toastify";

const ProductsPage = () => {
  const { data, isLoading, error, refetch } = useTanstackQuery("/product/all");
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleDelete = async (id) => {
    try {
      const res = await axiosInstance.delete(`/product/${id}`);

      toast.success(res.data.message);
      refetch();
    } catch (res) {
      toast.error(res.response?.data?.message || "An error occurred");
    }
  };

  const columns = [
    {
      accessorKey: "item_name",
      header: "Product Name",
      cell: ({ row }) => {
        const hasImage = row.original.image_path ? row.original.image_path : "";

        return (
          <div className="flex items-center gap-2 lg:w-[300px]">
            {/* if image link exist show image then show first character of name */}
            {hasImage ? (
              <img
                src={`${baseURL}/${row.original.image_path}`}
                alt={row.original.item_name}
                className="w-8 h-8 rounded-md object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-md bg-gray-200 flex items-center justify-center text-gray-600">
                {row.original.item_name.charAt(0)}
              </div>
            )}

            <span>{row.original.item_name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "category_name",
      header: "Category",
      cell: ({ row }) => (
        <div>
          <span>{row.original.category_name}</span>
        </div>
      ),
    },
    {
      accessorKey: "sale_price",
      header: "Price",
      cell: ({ row }) => (
        <div>
          <span>{row.original.sale_price}</span>
        </div>
      ),
    },
    {
      accessorKey: "unit_name",
      header: "Unit",
      cell: ({ row }) => (
        <div>
          <span>{row.original.unit_name}</span>
        </div>
      ),
    },
    {
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
            <Link to={`/edit-product/${row.original.item_id}`}>
              <DropdownMenuItem className="flex items-center justify-center">
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
            </Link>

            <Link>
              <DropdownMenuItem
                onClick={() => handleDelete(row.original.item_id)}
                className="flex items-center justify-center"
              >
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </Link>
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
