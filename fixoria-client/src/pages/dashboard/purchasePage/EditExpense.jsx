import DatePicker from "@/components/custom/DatePicker";
import Loading from "@/components/custom/Loading";
import PageTitle from "@/components/custom/PageTitle";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useTanstackQuery, { axiosInstance } from "@/hook/useTanstackQuery";
import { useQueryClient } from "@tanstack/react-query";
import { Paperclip, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import ReactSelect from "react-select";
import { toast } from "react-toastify";

const EditExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [fileName, setFileName] = useState("Upload A File");

  const [formData, setFormData] = useState({
    date: new Date(),
    rows: [
      { id: 1, item: "", quantity: "", unit_id: "", price: "", total: "" },
      { id: 2, item: "", quantity: "", unit_id: "", price: "", total: "" },
    ],
    notes: "",
    fileName: "Upload A File",
  });

  const [totals, setTotals] = useState({ quantity: 0, amount: 0 });

  const { register, handleSubmit } = useForm();

  const { data: expenseData, isLoading: expenseLoading } = useTanstackQuery(
    `/expense/${id}`
  );

  const { data: units } = useTanstackQuery("/unit");
  const { data: items, isLoading: itemsLoading } =
    useTanstackQuery("/expense-items");

  const activeItems = items?.filter((item) => item.is_active) || [];

  useEffect(() => {
    if (expenseData && items) {
      setFormData({
        date: new Date(expenseData.expense_date),
        notes: expenseData.notes,
        fileName: expenseData.uploaded_file_path
          ? expenseData.uploaded_file_path.split("/").pop()
          : "Upload A File",
        rows: expenseData.expense_details.map((detail) => ({
          id: detail.expense_detail_id,
          item: detail.expense_item_id.toString(),
          quantity: detail.quantity.toString(),
          price: detail.price.toString(),
          total: detail.total.toString(),
          unit_id:
            items
              .find((i) => i.expense_item_id === detail.expense_item_id)
              ?.unit_id?.toString() || "",
        })),
      });

      const initialTotals = {
        quantity: expenseData.expense_details.reduce(
          (acc, detail) => acc + detail.quantity,
          0
        ),
        amount: parseFloat(expenseData.total_amount),
      };
      setTotals(initialTotals);
    }
  }, [expenseData, items]);

  const updateRow = (rowId, field, value) => {
    const currentRows = formData.rows;
    const newRows = currentRows.map((row) => {
      if (row.id === rowId) {
        let updates = { [field]: value };

        if (field === "item") {
          const selectedItem = items?.find(
            (item) => item.expense_item_id === parseInt(value)
          );
          if (selectedItem) {
            updates = {
              ...updates,
              unit_id: selectedItem.unit_id?.toString() || "",
              price: selectedItem.price?.toString() || "",
              quantity: "1",
            };
            updates.total = (1 * parseFloat(selectedItem.price || 0)).toFixed(
              2
            );
          }
        }

        if (field === "quantity") {
          const quantity = Math.max(1, parseFloat(value) || 1);
          const price = parseFloat(row.price) || 0;
          updates = {
            ...updates,
            quantity: quantity.toString(),
            total: (quantity * price).toFixed(2),
          };
        }

        return { ...row, ...updates };
      }
      return row;
    });

    setFormData((prev) => ({
      ...prev,
      rows: newRows,
    }));

    const newTotals = {
      quantity: newRows.reduce(
        (acc, row) => acc + (parseFloat(row.quantity) || 0),
        0
      ),
      amount: newRows.reduce(
        (acc, row) => acc + (parseFloat(row.total) || 0),
        0
      ),
    };
    setTotals(newTotals);
  };

  const deleteRow = (rowId) => {
    if (formData.rows.length > 1) {
      const newRows = formData.rows.filter((row) => row.id !== rowId);
      setFormData((prev) => ({
        ...prev,
        rows: newRows,
      }));

      const newTotals = {
        quantity: newRows.reduce(
          (acc, row) => acc + (parseFloat(row.quantity) || 0),
          0
        ),
        amount: newRows.reduce(
          (acc, row) => acc + (parseFloat(row.total) || 0),
          0
        ),
      };
      setTotals(newTotals);
    } else {
      toast.error("Cannot delete the last row");
    }
  };

  const addNewRow = () => {
    const currentRows = formData.rows;
    const newId = Math.max(...currentRows.map((row) => row.id)) + 1;
    const newRows = [
      ...currentRows,
      { id: newId, item: "", quantity: "", unit_id: "", price: "", total: "" },
    ];

    setFormData((prev) => ({
      ...prev,
      rows: newRows,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const originalFileName = file.name;
      const fileExtension = originalFileName.split(".").pop();
      const baseName = originalFileName.replace(`.${fileExtension}`, "");
      const displayName =
        baseName.length > 6 ? baseName.slice(0, 6) + "..." : baseName;
      setFileName(`${displayName}.${fileExtension}`);
    } else {
      setFileName("Upload A File");
    }
  };

  const onSubmit = async () => {
    try {
      const fileInput = document.querySelector('input[type="file"]');
      const formDataToSend = new FormData();

      // Fix date handling to prevent timezone issues
      const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString("en-CA"); // Returns YYYY-MM-DD format
      };

      const expenseData = {
        expense_date: formatDate(formData.date),
        total_amount: totals.amount.toString(),
        grand_total: totals.amount.toString(),
        notes: formData.notes || "",
        expense_details: formData.rows
          .filter((row) => row.item && row.quantity && row.price)
          .map((row) => ({
            expense_item_id: parseInt(row.item),
            quantity: parseFloat(row.quantity),
            price: parseFloat(row.price),
            total: parseFloat(row.total),
          })),
      };

      if (expenseData.expense_details.length === 0) {
        toast.error("At least one item must be selected.");
        return;
      }

      formDataToSend.append("expenseData", JSON.stringify(expenseData));
      if (fileInput?.files[0]) {
        formDataToSend.append("file", fileInput.files[0]);
      }

      const response = await axiosInstance.put(
        `/expense/${id}`,
        formDataToSend
      );
      if (response.status === 200) {
        toast.success("Expense updated successfully");
        navigate("/expenses");
      } else {
        toast.error("Failed to update expense");
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error(error.response?.data?.error || "Failed to update expense");
    }
  };

  const handleItemSelect = (selected, row) => {
    if (selected) {
      const selectedItem = activeItems.find(
        (item) => item.expense_item_id === selected.value
      );

      if (!selectedItem) {
        toast.error("Invalid item selected");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        rows: prev.rows.map((r) => {
          if (r.id === row.id) {
            const defaultQuantity = "1";
            const price = selectedItem.price;
            const total = (
              parseFloat(defaultQuantity) * parseFloat(price)
            ).toFixed(2);

            return {
              ...r,
              item: selected.value,
              quantity: defaultQuantity,
              unit_id: selectedItem.unit_id,
              price: price,
              total: total,
            };
          }
          return r;
        }),
      }));

      // Update totals
      const newRows = formData.rows.map((r) => {
        if (r.id === row.id) {
          const defaultQuantity = "1";
          const price = selectedItem.price;
          const total = (
            parseFloat(defaultQuantity) * parseFloat(price)
          ).toFixed(2);

          return {
            ...r,
            item: selected.value,
            quantity: defaultQuantity,
            unit_id: selectedItem.unit_id,
            price: price,
            total: total,
          };
        }
        return r;
      });

      const newTotals = {
        quantity: newRows.reduce(
          (acc, row) => acc + (parseFloat(row.quantity) || 0),
          0
        ),
        amount: newRows.reduce(
          (acc, row) => acc + (parseFloat(row.total) || 0),
          0
        ),
      };
      setTotals(newTotals);
    }
  };

  if (expenseLoading || itemsLoading) return <Loading />;

  return (
    <div>
      <PageTitle title="Edit Expense" />
      <div className="p-2 bg-white rounded-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-start gap-4">
            <div>
              <label className="text-base w-[120px]">Date</label>
              <div className="w-auto mt-2">
                <DatePicker
                  date={formData.date}
                  setDate={(newDate) => {
                    setFormData((prev) => ({
                      ...prev,
                      date: newDate,
                    }));
                  }}
                />
              </div>
            </div>

            <div className="shrink-0">
              <div className="mb-2">
                <label className="text-base">Upload A File</label>
              </div>

              <label className="px-4 py-2 bg-gray-100 rounded-md flex items-center gap-2 text-[#333] cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*, .pdf, .doc, .docx, .xls, .xlsx"
                  onChange={handleFileChange}
                />
                <Paperclip />
                {fileName}
              </label>
            </div>

            <div className="w-full">
              <div className="mb-2">
                <label className="text-base">Add Some Notes</label>
              </div>

              <textarea
                className="border border-gray-400 p-2 rounded-md outline-none resize-none bg-[#F9FAFA] w-full"
                placeholder="Notes"
                value={formData.notes}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }));
                }}
              ></textarea>
            </div>
          </div>

          {/* Table section */}
          <div className="my-5">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="w-[400px]">ITEM</TableHead>
                  <TableHead className="w-[140px]">QTY</TableHead>
                  <TableHead>UNIT</TableHead>
                  <TableHead>PRICE/UNIT</TableHead>
                  <TableHead>AMOUNT</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="p-1">
                      <ReactSelect
                        value={
                          row.item
                            ? {
                                value: parseInt(row.item),
                                label: activeItems.find(
                                  (item) =>
                                    item.expense_item_id === parseInt(row.item)
                                )?.name,
                              }
                            : null
                        }
                        onChange={(selected) => handleItemSelect(selected, row)}
                        options={activeItems.map((item) => ({
                          value: item.expense_item_id,
                          label:
                            item.name.charAt(0).toUpperCase() +
                            item.name.slice(1),
                        }))}
                        placeholder="Select Item"
                        isClearable
                        isSearchable
                      />
                    </TableCell>

                    <TableCell className="p-1">
                      <input
                        type="number"
                        min="1"
                        value={row.quantity}
                        onChange={(e) =>
                          updateRow(row.id, "quantity", e.target.value)
                        }
                        className="w-full border border-gray-400 p-2 rounded-md outline-none resize-none bg-[#F9FAFA]"
                      />
                    </TableCell>

                    <TableCell className="p-1">
                      <input
                        type="text"
                        readOnly
                        value={
                          units?.find(
                            (unit) => unit.unit_id === parseInt(row.unit_id)
                          )?.unit_name || ""
                        }
                        className="w-full border border-gray-400 p-2 rounded-md outline-none resize-none bg-[#F9FAFA]"
                      />
                    </TableCell>

                    <TableCell className="p-1">
                      <input
                        type="number"
                        value={row.price}
                        readOnly
                        className="w-full border border-gray-400 p-2 rounded-md outline-none resize-none bg-[#F9FAFA]"
                      />
                    </TableCell>

                    <TableCell className="p-1">
                      <input
                        type="text"
                        name="total"
                        value={row.total || ""}
                        readOnly
                        className="w-full border border-gray-400 p-2 rounded-md outline-none resize-none bg-[#F9FAFA]"
                      />
                    </TableCell>

                    <TableCell className="p-1">
                      <div className="flex items-center justify-center text-base">
                        <div className="span w-[10px] hidden">{row.id}</div>
                        {formData.rows.length > 1 && (
                          <button
                            type="button"
                            className="text-red-600"
                            onClick={() => deleteRow(row.id)}
                          >
                            <Trash2 width="18px" height="18px" />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="p-1">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={addNewRow}
                        className="px-4 py-2 bg-defaultBlue text-white rounded-md"
                      >
                        Add Row
                      </button>
                      <span className="text-base">Total</span>
                    </div>
                  </TableCell>
                  <TableCell className="p-1">
                    <span className="flex justify-end">{totals.quantity}</span>
                  </TableCell>
                  <TableCell className="p-1"></TableCell>
                  <TableCell className="p-1"></TableCell>
                  <TableCell className="p-1">
                    <span className="flex justify-end">
                      {totals.amount.toFixed(2)}
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end">
            <div></div>
            <div className="flex items-center gap-x-2">
              <label className="text-base shrink-0">Grand Total</label>
              <input
                name="grand_total"
                type="number"
                value={totals.amount.toFixed(2)}
                readOnly
                className="bg-[#F9FAFA] border-0 outline-none p-2 rounded-md w-full"
              />
            </div>
          </div>

          <div className="text-center mt-5">
            <button
              className="px-6 py-2 bg-defaultBlue text-white rounded-md"
              type="submit"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpense;
