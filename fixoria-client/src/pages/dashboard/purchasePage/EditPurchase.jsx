import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useQueryClient } from '@tanstack/react-query';
import ReactSelect from "react-select";
import DatePicker from "@/components/custom/DatePicker";
import Loading from "@/components/custom/Loading";
import PageTitle from "@/components/custom/PageTitle";
import useTanstackQuery, { axiosInstance } from "@/hook/useTanstackQuery";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const EditPurchase = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    date: new Date(),
    rows: [
      { id: 1, item: "", quantity: "", unit_id: "", price: "", total: "" },
      { id: 2, item: "", quantity: "", price: "", unit_id: "", total: "" },
    ],
    party: "",
    notes: "",
    discountAmount: "",
    discountPercentage: "",
    tax_amount: "",
    taxPercentage: "",
  });

  const [totals, setTotals] = useState({ quantity: 0, amount: 0 });

  const { data: purchaseData, isLoading: purchaseLoading } = useTanstackQuery(`/purchase/${id}`);
  const { data: partyData, isLoading: partyLoading } = useTanstackQuery("/party");
  const { data: items, isLoading: itemsLoading } = useTanstackQuery("/product/all");
  const { data: units } = useTanstackQuery("/unit");

  useEffect(() => {
    if (purchaseData && items) {
      const discountPercentage = ((purchaseData.discount_amount / purchaseData.total_amount) * 100).toFixed(2);
      const taxPercentage = ((purchaseData.tax_amount / purchaseData.total_amount) * 100).toFixed(2);

      setFormData({
        date: new Date(purchaseData.purchase_date),
        party: purchaseData.party_id.toString(),
        notes: purchaseData.notes,
        discountAmount: purchaseData.discount_amount.toString(),
        discountPercentage: discountPercentage,
        tax_amount: purchaseData.tax_amount.toString(),
        taxPercentage: taxPercentage,
        rows: purchaseData.purchase_details.map((detail) => {
          const item = items?.find(i => i.item_id === detail.item_id);
          return {
            id: detail.purchase_detail_id,
            item: detail.item_id.toString(),
            quantity: detail.quantity.toString(),
            price: detail.price,
            total: detail.total,
            unit_id: item?.unit_id?.toString() || "",
          };
        }),
      });

      const initialTotals = {
        quantity: purchaseData.purchase_details.reduce((acc, detail) => acc + detail.quantity, 0),
        amount: parseFloat(purchaseData.total_amount)
      };
      setTotals(initialTotals);
    }
  }, [purchaseData, items]);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      party_id: "",
      purchase_date: new Date(),
      total_amount: 0,
      tax_amount: 0,
      discount_amount: 0,
      grand_total: 0,
      notes: "",
      purchase_details: [],
    },
  });

  const updateRow = (rowId, field, value) => {
    const currentRows = formData.rows;
    const newRows = currentRows.map((row) => {
      if (row.id === rowId) {
        let updates = { [field]: value };

        if (field === 'item') {
          const selectedItem = items?.find(
            (item) => item.item_id === parseInt(value)
          );
          if (selectedItem) {
            updates = {
              ...updates,
              unit_id: selectedItem.unit_id?.toString() || "",
              price: selectedItem.purchase_price?.toString() || "",
              quantity: "1",
            };
            updates.total = (1 * parseFloat(selectedItem.purchase_price || 0)).toFixed(2);
          }
        }

        if (field === "quantity") {
          const quantity = parseFloat(value) || 0;
          const price = parseFloat(row.price) || 0;
          updates.total = (quantity * price).toFixed(2);
        }

        return { ...row, ...updates };
      }
      return row;
    });

    setFormData(prev => ({
      ...prev,
      rows: newRows,
    }));

    const newTotals = {
      quantity: newRows.reduce((acc, row) => acc + (parseFloat(row.quantity) || 0), 0),
      amount: newRows.reduce((acc, row) => acc + (parseFloat(row.total) || 0), 0)
    };
    setTotals(newTotals);
  };

  const deleteRow = (rowId) => {
    const newRows = formData.rows.filter((row) => row.id !== rowId);
    
    setFormData(prev => ({
      ...prev,
      rows: newRows
    }));

    const newTotals = {
      quantity: newRows.reduce((acc, row) => acc + (parseFloat(row.quantity) || 0), 0),
      amount: newRows.reduce((acc, row) => acc + (parseFloat(row.total) || 0), 0)
    };
    setTotals(newTotals);
  };

  const addNewRow = () => {
    const currentRows = formData.rows;
    const newId = Math.max(...currentRows.map((row) => row.id)) + 1;
    const newRows = [
      ...currentRows,
      { id: newId, item: "", quantity: "", unit_id: "", price: "", total: "" },
    ];

    setFormData(prev => ({
      ...prev,
      rows: newRows,
    }));
  };

  const handleDiscountPercentageChange = (value) => {
    const percentage = parseFloat(value) || 0;
    const discountAmount = ((percentage * totals.amount) / 100).toFixed(2);
    
    setFormData(prev => ({
      ...prev,
      discountPercentage: value,
      discountAmount: discountAmount
    }));
  };

  const handleDiscountAmountChange = (value) => {
    const discountAmount = parseFloat(value) || 0;
    const percentage = totals.amount > 0 ? ((discountAmount / totals.amount) * 100).toFixed(2) : "0";
    
    setFormData(prev => ({
      ...prev,
      discountAmount: value,
      discountPercentage: percentage
    }));
  };

  const handleTaxPercentageChange = (value) => {
    const percentage = parseFloat(value) || 0;
    const taxAmount = ((percentage * totals.amount) / 100).toFixed(2);
    
    setFormData(prev => ({
      ...prev,
      taxPercentage: value,
      tax_amount: taxAmount
    }));
  };

  const handleTaxAmountChange = (value) => {
    const taxAmount = parseFloat(value) || 0;
    const percentage = totals.amount > 0 ? ((taxAmount / totals.amount) * 100).toFixed(2) : "0";
    
    setFormData(prev => ({
      ...prev,
      tax_amount: value,
      taxPercentage: percentage
    }));
  };

  const onSubmit = async (data) => {
    // Validation
    if (!formData.party) {
      toast.error("Please select a party");
      return;
    }

    if (formData.rows.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    const hasEmptyRows = formData.rows.some(row => !row.item || !row.quantity || !row.price);
    if (hasEmptyRows) {
      toast.error("Please fill all item details");
      return;
    }

    const purchaseData = {
      party_id: parseInt(formData.party) || 0,
      purchase_date: new Date(formData.date.getTime() - formData.date.getTimezoneOffset() * 60000),
      total_amount: totals.amount,
      tax_amount: parseFloat(formData.tax_amount) || 0,
      discount_amount: parseFloat(formData.discountAmount) || 0,
      grand_total:
        totals.amount -
        (parseFloat(formData.discountAmount) || 0) +
        (parseFloat(formData.tax_amount) || 0),
      notes: formData.notes,
      purchase_details: formData.rows
        .filter((row) => row.item && row.quantity && row.price)
        .map((row) => ({
          item_id: parseInt(row.item) || 0,
          quantity: parseFloat(row.quantity) || 0,
          price: parseFloat(row.price) || 0,
          tax_amount: parseFloat(formData.tax_amount) || 0,
          discount_amount: parseFloat(formData.discountAmount) || 0,
          total: parseFloat(row.total) || 0,
        })),
    };

    try {
      const res = await axiosInstance.put(`/purchase/${id}`, purchaseData);
      toast.success("Purchase updated successfully!");
      
      // Invalidate and refetch queries
      await queryClient.invalidateQueries(['purchase']);
      await queryClient.invalidateQueries([`purchase/${id}`]);
      
      navigate("/purchase");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update purchase");
      console.error("Error updating purchase:", error);
    }
  };

  if (purchaseLoading || partyLoading || itemsLoading) return <Loading />;

  return (
    <div>
      <PageTitle title="Edit Purchase" />
      <div className="p-2 bg-white rounded-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-start gap-4">
            <div>
              <label className="text-base w-[120px]">Invoice Date</label>
              <div className="w-auto mt-2">
                <DatePicker
                  date={formData.date}
                  setDate={(newDate) => {
                    setFormData(prev => ({
                      ...prev,
                      date: newDate
                    }));
                  }}
                />
              </div>
            </div>

            <div className="shrink-0">
              <div className="mb-2">
                <label className="text-base">Selected Party</label>
              </div>

              <Select
                className="text-base"
                value={formData.party}
                onValueChange={(value) => {
                  setFormData(prev => ({
                    ...prev,
                    party: value
                  }));
                }}
              >
                <SelectTrigger className="w-auto focus:ring-offset-0 focus:ring-0 text-base">
                  <SelectValue placeholder="Selected Party" />
                </SelectTrigger>
                <SelectContent>
                  {partyData?.map((party) => (
                    <SelectItem
                      className="text-base"
                      key={party.party_id}
                      value={`${party.party_id}`}
                    >
                      {party.party_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  setFormData(prev => ({
                    ...prev,
                    notes: e.target.value
                  }));
                }}
              ></textarea>
            </div>
          </div>

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
                          items?.find(
                            (item) => item.item_id === parseInt(row.item)
                          )
                            ? {
                                value: row.item,
                                label: items.find(
                                  (item) => item.item_id === parseInt(row.item)
                                ).item_name,
                              }
                            : null
                        }
                        onChange={(selected) => {
                          updateRow(
                            row.id,
                            "item",
                            selected ? selected.value : ""
                          );
                        }}
                        options={items?.map((item) => ({
                          value: item.item_id.toString(),
                          label: item.item_name,
                        }))}
                        placeholder="Select Item"
                        isClearable
                        isSearchable
                        className="text-base"
                      />
                    </TableCell>

                    <TableCell className="p-1">
                      <input
                        type="number"
                        value={row.quantity}
                        onChange={(e) => updateRow(row.id, "quantity", e.target.value)}
                        className="w-full border border-gray-400 p-2 rounded-md outline-none resize-none bg-[#F9FAFA]"
                      />
                    </TableCell>

                    <TableCell className="p-1">
                      <input
                        type="text"
                        readOnly
                        value={
                          units?.find(
                            (unit) => unit.unit_id === 
                              items?.find(item => item.item_id === parseInt(row.item))?.unit_id
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
                    <span className="flex justify-end">{totals.amount.toFixed(2)}</span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-x-2">
              <label className="text-base">Discount</label>
              <input
                placeholder="%"
                type="number"
                step="0.01"
                value={formData.discountPercentage || ""}
                onChange={(e) => handleDiscountPercentageChange(e.target.value)}
                className="bg-[#F9FAFA] border-0 outline-none p-2 rounded-md w-[80px]"
              />
              <span>-</span>
              <input
                name="discount_amount"
                placeholder="$"
                type="number"
                value={formData.discountAmount || ""}
                onChange={(e) => handleDiscountAmountChange(e.target.value)}
                className="bg-[#F9FAFA] border-0 outline-none p-2 rounded-md w-[80px]"
              />
            </div>

            <div className="flex items-center gap-x-2">
              <label className="text-base">Tax</label>
              <input
                placeholder="%"
                type="number"
                step="0.01"
                value={formData.taxPercentage || ""}
                onChange={(e) => handleTaxPercentageChange(e.target.value)}
                className="bg-[#F9FAFA] border-0 outline-none p-2 rounded-md w-[80px]"
              />
              <span>+</span>
              <input
                name="tax_amount"
                placeholder="$"
                type="number"
                value={formData.tax_amount || ""}
                onChange={(e) => handleTaxAmountChange(e.target.value)}
                className="bg-[#F9FAFA] border-0 outline-none p-2 rounded-md w-[80px]"
              />
            </div>

            <div className="flex items-center gap-x-2 w-full">
              <label className="text-base shrink-0">Grand Total</label>
              <input
                name="grand_total"
                type="number"
                value={(
                  totals.amount -
                  (parseFloat(formData.discountAmount) || 0) +
                  (parseFloat(formData.tax_amount) || 0)
                ).toFixed(2)}
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
              Update Purchase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPurchase;
