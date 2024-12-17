import DatePicker from "@/components/custom/DatePicker";
import Loading from "@/components/custom/Loading";
import PageTitle from "@/components/custom/PageTitle";
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
import useTanstackQuery, { axiosInstance } from "@/hook/useTanstackQuery";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import ReactSelect from "react-select";
import { toast } from "react-toastify";

export default function EditSale() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleSubmit } = useForm();

  const [saleData, setSaleData] = useState({
    date: new Date(),
    rows: [
      { id: 1, item: "", quantity: "", unit_id: "", price: "", total: "" },
    ],
    party: "",
    notes: "",
    discountAmount: "",
    tax_amount: "",
    discountPercentage: "",
    taxPercentage: "",
  });

  const [totals, setTotals] = useState({ quantity: 0, amount: 0 });

  useEffect(() => {
    const newTotals = calculateTotals();
    setTotals(newTotals);
  }, [saleData]);

  const calculateTotals = () => {
    return saleData.rows.reduce(
      (acc, row) => ({
        quantity: acc.quantity + (parseFloat(row.quantity) || 0),
        amount: acc.amount + (parseFloat(row.total) || 0),
      }),
      { quantity: 0, amount: 0 }
    );
  };

  const { data: parties, isLoading: partiesLoading } =
    useTanstackQuery("/party");
  const { data: items, isLoading: itemsLoading } =
    useTanstackQuery("/product/all");
  const { data: units } = useTanstackQuery("/unit");

  const { data: saleDetails, isLoading: saleDetailsLoading } = useTanstackQuery(
    `/sales/${id}`
  );

  useEffect(() => {
    if (saleDetails) {
      const totalAmount = saleDetails.sales_details.reduce(
        (sum, detail) => sum + (parseFloat(detail.total) || 0),
        0
      );

      setSaleData({
        date: new Date(saleDetails.sales_date),
        rows: saleDetails.sales_details.map((detail) => ({
          id: detail.sales_detail_id,
          item: detail.item_id?.toString() || "",
          quantity: detail.quantity?.toString() || "",
          unit_id: detail.unit_name || "",
          price: detail.price?.toString() || "",
          total: detail.total?.toString() || "",
        })),
        party: saleDetails.party_id?.toString() || "",
        notes: saleDetails.notes || "",
        discountAmount: saleDetails.discount_amount || "0",
        tax_amount: saleDetails.tax_amount || "0",
        discountPercentage: totalAmount > 0
          ? ((parseFloat(saleDetails.discount_amount) / totalAmount) * 100).toFixed(2)
          : "0",
        taxPercentage: totalAmount > 0
          ? ((parseFloat(saleDetails.tax_amount) / totalAmount) * 100).toFixed(2)
          : "0",
      });
    }
  }, [saleDetails]);

  if (partiesLoading || itemsLoading || saleDetailsLoading) return <Loading />;

  const addNewRow = () => {
    const currentRows = saleData.rows;
    const newId = Math.max(...currentRows.map((row) => row.id)) + 1;
    const newRows = [
      ...currentRows,
      { id: newId, item: "", quantity: "", unit_id: "", price: "", total: "" },
    ];

    setSaleData((prev) => ({
      ...prev,
      rows: newRows,
    }));
  };

  const deleteRow = (rowId) => {
    if (saleData.rows.length > 1) {
      const newRows = saleData.rows.filter((row) => row.id !== rowId);
      setSaleData((prev) => ({
        ...prev,
        rows: newRows,
      }));
    } else {
      toast.error("Cannot delete the last row");
    }
  };

  const handleDiscountPercentageChange = (value) => {
    const percentage = parseFloat(value) || 0;
    const totalAmount = totals.amount;
    const discountAmount = ((percentage * totalAmount) / 100).toFixed(2);

    setSaleData((prev) => ({
      ...prev,
      discountAmount: discountAmount,
      discountPercentage: value,
    }));
  };

  const handleTaxPercentageChange = (value) => {
    const percentage = parseFloat(value) || 0;
    const totalAmount = totals.amount;
    const taxAmount = ((percentage * totalAmount) / 100).toFixed(2);

    setSaleData((prev) => ({
      ...prev,
      tax_amount: taxAmount,
      taxPercentage: value,
    }));
  };

  const onSubmit = async (data) => {
    const updateData = {
      party_id: parseInt(saleData.party) || 0,
      sales_date: saleData.date,
      total_amount: totals.amount,
      tax_amount: parseFloat(saleData.tax_amount) || 0,
      discount_amount: parseFloat(saleData.discountAmount) || 0,
      grand_total:
        totals.amount -
        (parseFloat(saleData.discountAmount) || 0) +
        (parseFloat(saleData.tax_amount) || 0),
      notes: saleData.notes,
      sales_details: saleData.rows
        .filter((row) => row.item && row.quantity && row.price)
        .map((row) => ({
          item_id: parseInt(row.item) || 0,
          quantity: parseFloat(row.quantity) || 0,
          price: parseFloat(row.price) || 0,
          tax_amount: parseFloat(saleData.tax_amount) || 0,
          discount_amount: parseFloat(saleData.discountAmount) || 0,
          total: parseFloat(row.total) || 0,
        })),
    };

    try {
      await axiosInstance.put(`/sales/${id}`, updateData);
      toast.success("Sale updated successfully");
      navigate("/sale");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating sale");
    }
  };

  return (
    <div>
      <PageTitle title="Edit Sale" />
      <div className="p-2 bg-white rounded-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-start gap-4">
            <div>
              <label className="text-base w-[120px]">Invoice Date</label>
              <div className="w-auto mt-2">
                <DatePicker
                  date={saleData.date}
                  setDate={(newDate) => {
                    setSaleData((prev) => ({
                      ...prev,
                      date: newDate,
                    }));
                  }}
                />
              </div>
            </div>

            <div className="shrink-0">
              <div className="mb-2">
                <label className="text-base">Select A Party</label>
              </div>

              <Select
                className="text-base"
                name="party_id"
                value={saleData.party}
                onValueChange={(value) => {
                  setSaleData((prev) => ({
                    ...prev,
                    party: value,
                  }));
                }}
              >
                <SelectTrigger className="w-auto focus:ring-offset-0 focus:ring-0 text-base">
                  <SelectValue placeholder="Select A Party" />
                </SelectTrigger>
                <SelectContent>
                  {parties.map((party) => (
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
                value={saleData.notes}
                onChange={(e) => {
                  setSaleData((prev) => ({
                    ...prev,
                    notes: e.target.value,
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
                {saleData.rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="p-1">
                      <ReactSelect
                        value={
                          row.item
                            ? {
                                value: parseInt(row.item),
                                label: items.find(
                                  (item) => item.item_id === parseInt(row.item)
                                )?.item_name,
                              }
                            : null
                        }
                        onChange={(selected) => {
                          if (selected) {
                            const selectedItem = items.find(
                              (item) => item.item_id === selected.value
                            );

                            const unitName =
                              units.find(
                                (unit) => unit.unit_id === selectedItem.unit_id
                              )?.unit_name || "";

                            setSaleData((prev) => ({
                              ...prev,
                              rows: prev.rows.map((r) => {
                                if (r.id === row.id) {
                                  const total = (
                                    1 * parseFloat(selectedItem.sale_price)
                                  ).toFixed(2);

                                  return {
                                    ...r,
                                    item: selected.value,
                                    quantity: "1",
                                    unit_id: unitName,
                                    price: selectedItem.sale_price,
                                    total: total,
                                  };
                                }
                                return r;
                              }),
                            }));
                          } else {
                            setSaleData((prev) => ({
                              ...prev,
                              rows: prev.rows.map((r) => {
                                if (r.id === row.id) {
                                  return {
                                    ...r,
                                    item: "",
                                    quantity: "",
                                    unit_id: "",
                                    price: "",
                                    total: "",
                                  };
                                }
                                return r;
                              }),
                            }));
                          }
                        }}
                        options={items.map((item) => ({
                          value: item.item_id,
                          label: item.item_name,
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
                        onChange={(e) => {
                          const newQuantity = parseFloat(e.target.value);

                          if (newQuantity < 1) {
                            toast.error("Quantity cannot be less than 1");
                            setSaleData((prev) => ({
                              ...prev,
                              rows: prev.rows.map((r) => {
                                if (r.id === row.id) {
                                  return {
                                    ...r,
                                    quantity: "1",
                                    total: (1 * parseFloat(r.price)).toFixed(2),
                                  };
                                }
                                return r;
                              }),
                            }));
                          } else {
                            setSaleData((prev) => ({
                              ...prev,
                              rows: prev.rows.map((r) => {
                                if (r.id === row.id) {
                                  return {
                                    ...r,
                                    quantity: e.target.value,
                                    total: (
                                      parseFloat(e.target.value) *
                                      parseFloat(r.price)
                                    ).toFixed(2),
                                  };
                                }
                                return r;
                              }),
                            }));
                          }
                        }}
                        className="w-full border border-gray-400 p-2 rounded-md outline-none resize-none bg-[#F9FAFA]"
                      />
                    </TableCell>

                    <TableCell className="p-1">
                      <input
                        type="text"
                        readOnly
                        value={row.unit_id || ""}
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
                        {saleData.rows.length > 1 && (
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

          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-x-2">
              <label className="text-base">Discount</label>
              <input
                placeholder="%"
                type="number"
                step="0.01"
                value={saleData.discountPercentage}
                onChange={(e) => handleDiscountPercentageChange(e.target.value)}
                className="bg-[#F9FAFA] border-0 outline-none p-2 rounded-md w-[80px]"
              />
              <span>-</span>
              <input
                name="discount_amount"
                placeholder="$"
                type="number"
                step="0.01"
                value={saleData.discountAmount}
                onChange={(e) => {
                  const discountAmount = parseFloat(e.target.value) || 0;
                  const totalAmount = totals.amount;
                  const percentage =
                    totalAmount > 0
                      ? ((discountAmount / totalAmount) * 100).toFixed(2)
                      : "0";

                  setSaleData((prev) => ({
                    ...prev,
                    discountAmount: e.target.value,
                    discountPercentage: percentage,
                  }));
                }}
                className="bg-[#F9FAFA] border-0 outline-none p-2 rounded-md w-[80px]"
              />
            </div>

            <div className="flex items-center gap-x-2">
              <label className="text-base">Tax</label>
              <input
                placeholder="%"
                type="number"
                step="0.01"
                value={saleData.taxPercentage}
                onChange={(e) => handleTaxPercentageChange(e.target.value)}
                className="bg-[#F9FAFA] border-0 outline-none p-2 rounded-md w-[80px]"
              />
              <span>+</span>
              <input
                name="tax_amount"
                placeholder="$"
                type="number"
                step="0.01"
                value={saleData.tax_amount}
                onChange={(e) => {
                  const taxAmount = parseFloat(e.target.value) || 0;
                  const totalAmount = totals.amount;
                  const percentage =
                    totalAmount > 0
                      ? ((taxAmount / totalAmount) * 100).toFixed(2)
                      : "0";

                  setSaleData((prev) => ({
                    ...prev,
                    tax_amount: e.target.value,
                    taxPercentage: percentage,
                  }));
                }}
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
                  (parseFloat(saleData.discountAmount) || 0) +
                  (parseFloat(saleData.tax_amount) || 0)
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
              Update Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
