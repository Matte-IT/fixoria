import Loading from "@/components/custom/Loading";
import PageName from "@/components/custom/PageName";
import PageTitle from "@/components/custom/PageTitle";
import Export from "@/components/custom/shared/Export";
import DataTable from "@/components/custom/table/DataTable";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useTanstackQuery from "@/hook/useTanstackQuery";
import axios from "axios";
import { Ellipsis, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import PartyForm from "./PartyForm";

const PartiesPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedParty, setSelectedParty] = useState(null);

  const { data, isLoading, error, refetch } = useTanstackQuery("/party");

  const handleDelete = (partyId) => {
    setOpenMenuId(null);

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/party/${partyId}`);
          toast.success("Party deleted successfully!");
          refetch();
        } catch (error) {
          toast.error("Failed to delete party");
        }
      }
    });
  };

  const columns = [
    {
      accessorKey: "party_name",
      header: "Party Name",
      cell: ({ row }) => (
        <div>
          <span>{row.original.party_name}</span>
        </div>
      ),
    },
    {
      accessorKey: "party_number",
      header: "Party Phone Number",
      cell: ({ row }) => (
        <div>
          <span>{row.original.party_number}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Party Email",
      cell: ({ row }) => (
        <div>
          <span>{row.original.email}</span>
        </div>
      ),
    },
    {
      accessorKey: "billing_address",
      header: "Billing Address",
      cell: ({ row }) => <span>{row.original.billing_address}</span>,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu
          open={openMenuId === row.id}
          onOpenChange={(isOpen) => setOpenMenuId(isOpen ? row.id : null)}
        >
          <DropdownMenuTrigger className="text-gray-600 outline-none">
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel
              className="cursor-pointer"
              onClick={() => {
                setSelectedParty(row.original);
                setIsDialogOpen(true);
                setOpenMenuId(null);
              }}
            >
              Edit
            </DropdownMenuLabel>
            <DropdownMenuLabel
              className="cursor-pointer"
              onClick={() => {
                handleDelete(row.original.party_id);
              }}
            >
              Delete
            </DropdownMenuLabel>
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

  return (
    <div>
      <PageTitle title="Parties" />

      <div className="flex gap-3 flex-wrap items-center justify-between mb-6">
        <PageName pageName="Parties" />
        <div className="flex flex-wrap items-center gap-3">
          <Export />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger
              className="bg-defaultBlue p-2 rounded-md flex items-center gap-x-2 text-white text-base"
              onClick={() => setSelectedParty(null)}
            >
              <Plus width="16px" height="16px" />
              Add Parties
            </DialogTrigger>
            <PartyForm
              onClose={() => {
                setSelectedParty(null);
                setIsDialogOpen(false);
              }}
              refetch={refetch}
              defaultValues={selectedParty}
            />
          </Dialog>
        </div>
      </div>

      <DataTable data={data} columns={columns}></DataTable>
    </div>
  );
};

export default PartiesPage;
