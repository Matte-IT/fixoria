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
import { Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ReactSelect from "react-select";
import { toast } from "react-toastify";

export default function AddPurchaseOrder() {
  const navigate = useNavigate();
  const [tabs, setTabs] = useState([{ id: 1, title: "Purchase Order #1" }]);
  const [activeTab, setActiveTab] = useState(1);

  // Create a state object to store form data for each tab
  const [tabsData, setTabsData] = useState({
    1: {
      purchase_order_date: new Date(),
      expected_delivery_date: new Date(),
      rows: [
        { id: 1, item: "", quantity: "", unit_id: "", price: "", total: "" },
        { id: 2, item: "", quantity: "", unit_id: "", price: "", total: "" },
      ],
      party: "",
      notes: "",
      discountAmount: "",
      tax_amount: "",
      status_id: 1,
    },
  });

  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      party_id: "",
      purchase_order_date: new Date(),
      expected_delivery_date: new Date(),
      total_amount: 0,
      tax_amount: 0,
      discount_amount: 0,
      grand_total: 0,
      status_id: 1,
      notes: "",
      purchase_order_details: [],
    },
  });

  const [totals, setTotals] = useState({ quantity: 0, amount: 0 });

  // Calculate totals whenever rows change
  useEffect(() => {
    const newTotals = calculateTotals();
    setTotals(newTotals);
  }, [tabsData, activeTab]);

  const calculateTotals = () => {
    const currentRows = tabsData[activeTab].rows;
    return currentRows.reduce(
      (acc, row) => ({
        quantity: acc.quantity + (parseFloat(row.quantity) || 0),
        amount: acc.amount + (parseFloat(row.total) || 0),
      }),
      { quantity: 0, amount: 0 }
    );
  };

  const { data, isLoading, error } = useTanstackQuery("/party");
  const { data: units } = useTanstackQuery("/unit");

  const {
    data: items,
    isLoading: itemsLoading,
    error: itemsError,
  } = useTanstackQuery("/product/all");

  if (isLoading || itemsLoading) return <Loading />;
  if (error || itemsError) return <p>Error</p>;

  const addNewTab = () => {
    if (tabs.length < 5) {
      const newId = Math.max(...tabs.map((tab) => tab.id)) + 1;
      const newTab = {
        id: newId,
        title: `Purchase Order #${newId}`,
      };
      setTabs([...tabs, newTab]);

      // Initialize new tab with empty values
      setTabsData((prev) => ({
        ...prev,
        [newId]: {
          purchase_order_date: new Date(),
          expected_delivery_date: new Date(),
          rows: [
            { id: 1, item: "", quantity: "", unit_id: "", price: "", total: "" },
            { id: 2, item: "", quantity: "", unit_id: "", price: "", total: "" },
          ],
          party: "",
          notes: "",
          discountAmount: "",
          tax_amount: "",
          status_id: 1,
        },
      }));
      setActiveTab(newId);
    } else {
      toast.error("Max. 5 Tabs");
    }
  };

  const closeTab = (tabId) => {
    const newTabs = tabs
      .filter((tab) => tab.id !== tabId)
      .map((tab, index) => ({
        ...tab,
        title: `Purchase Order #${index + 1}`,
        id: index + 1,
      }));

    // Remove data for the closed tab and reorganize remaining tab data
    const newTabsData = {};
    newTabs.forEach((tab, index) => {
      const oldId = tab.id;
      const newId = index + 1;
      newTabsData[newId] = tabsData[oldId];
    });

    setTabsData(newTabsData);
    setTabs(newTabs);
    setActiveTab(newTabs[newTabs.length - 1].id);
  };

  const addNewRow = () => {
    const currentRows = tabsData[activeTab].rows;
    const newId = Math.max(...currentRows.map((row) => row.id)) + 1;
    const newRows = [
      ...currentRows,
      { id: newId, item: "", quantity: "", unit_id: "", price: "", total: "" },
    ];

    setTabsData((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        rows: newRows,
      },
    }));
  };

  const deleteRow = (rowId) => {
    const currentRows = tabsData[activeTab].rows;
    if (currentRows.length > 1) {
      const newRows = currentRows.filter((row) => row.id !== rowId);
      setTabsData((prev) => ({
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          rows: newRows,
        },
      }));
    } else {
      toast.error("Cannot delete the last row");
    }
  };

  const updateRow = (id, field, value) => {
    const currentRows = tabsData[activeTab].rows;
    const newRows = currentRows.map((row) => {
      if (row.id === id) {
        const updates = { [field]: value };

        if (field === "quantity") {
          const quantity = parseFloat(value) || 0;
          if (quantity < 1) {
            toast.error("Quantity cannot be less than 1");
            updates.quantity = "1";
          }
          const price = parseFloat(row.price) || 0;
          updates.total = (quantity * price).toFixed(2);
        }

        if (field === "price") {
          const price = parseFloat(value) || 0;
          const quantity = parseFloat(row.quantity) || 1;
          updates.total = (quantity * price).toFixed(2);
        }

        return { ...row, ...updates };
      }
      return row;
    });

    setTabsData((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        rows: newRows,
      },
    }));
  };

  const onSubmit = async (data) => {
    const currentTab = tabsData[activeTab];

    // Validate party selection
    if (!currentTab.party) {
      toast.error("Please select a party");
      return;
    }

    // Validate dates
    if (!currentTab.purchase_order_date || !currentTab.expected_delivery_date) {
      toast.error("Please select both purchase order date and expected delivery date");
      return;
    }

    // Validate if expected delivery date is not before purchase order date
    if (new Date(currentTab.expected_delivery_date) < new Date(currentTab.purchase_order_date)) {
      toast.error("Expected delivery date cannot be before purchase order date");
      return;
    }

    // Validate rows
    const validRows = currentTab.rows.filter(row => row.item && row.quantity && row.price);
    if (validRows.length === 0) {
      toast.error("Please add at least one item with quantity and price");
      return;
    }

    // Validate tax and discount amounts
    const tax = parseFloat(currentTab.tax_amount) || 0;
    const discount = parseFloat(currentTab.discountAmount) || 0;
    
    if (tax < 0) {
      toast.error("Tax amount cannot be negative");
      return;
    }

    if (discount < 0) {
      toast.error("Discount amount cannot be negative");
      return;
    }

    if (discount > totals.amount) {
      toast.error("Discount amount cannot be greater than total amount");
      return;
    }

    const purchaseData = {
      party_id: parseInt(currentTab.party) || 0,
      purchase_order_date: currentTab.purchase_order_date,
      expected_delivery_date: currentTab.expected_delivery_date,
      total_amount: totals.amount,
      tax_amount: tax,
      discount_amount: discount,
      grand_total: totals.amount - discount + tax,
      status_id: Number(1),
      notes: currentTab.notes || "",
      purchase_order_details: validRows.map((row) => ({
        item_id: parseInt(row.item) || 0,
        quantity: parseFloat(row.quantity) || 0,
        price: parseFloat(row.price) || 0,
        tax_amount: tax / validRows.length, // Distribute tax equally among items
        discount_amount: discount / validRows.length, // Distribute discount equally among items
        total: parseFloat(row.total) || 0,
      })),
    };

    try {
      const res = await axiosInstance.post("/purchase-order", purchaseData);
      toast.success(res.data.message);
      navigate("/purchase-orders");
    } catch (error) {
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.error || "Failed to create purchase order");
    }
  };

  // Discount percentage change handler
  const handleDiscountPercentageChange = (value) => {
    const percentage = parseFloat(value) || 0;
    const totalAmount = totals.amount;
    const discountAmount = ((percentage * totalAmount) / 100).toFixed(2);

    // Update both percentage and amount for current tab only
    setTabsData((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        discountAmount: discountAmount,
        discountPercentage: value, // Store percentage in tabsData
      },
    }));
  };

  // Tax percentage change handler
  const handleTaxPercentageChange = (value) => {
    const percentage = parseFloat(value) || 0;
    const totalAmount = totals.amount;
    const taxAmount = ((percentage * totalAmount) / 100).toFixed(2);

    // Update both percentage and amount for current tab only
    setTabsData((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        tax_amount: taxAmount,
        taxPercentage: value, // Store percentage in tabsData
      },
    }));
  };

  return (
    <div>
      <PageTitle title="Add Purchase Order" />

      <div className="mb-4">
        <div className="flex items-center gap-x-4 p-2 border border-gray-300 rounded-md bg-white">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`relative cursor-pointer px-3 py-1 rounded-md shadow ${
                activeTab === tab.id
                  ? "bg-defaultBlue text-white border-primary"
                  : "bg-gray-100 text-gray-600 border-gray-300"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.title}
              {tabs.length > 1 && (
                <button
                  className="absolute -top-1 -right-2 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addNewTab}
            className="rounded-full bg-defaultBlue text-white"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {tabs.map((tab) => (
        <div key={tab.id} className={activeTab === tab.id ? "block" : "hidden"}>
          <div className="p-2 bg-white rounded-md">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex items-start gap-4">
                <div>
                  <label className="text-base w-[120px]">Purchase Order Date</label>
                  <div className="w-auto mt-2">
                    <DatePicker
                      date={tabsData[activeTab].purchase_order_date}
                      setDate={(newDate) => {
                        setTabsData((prev) => ({
                          ...prev,
                          [activeTab]: {
                            ...prev[activeTab],
                            purchase_order_date: newDate,
                          },
                        }));
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-base w-[120px]">
                    Expected Delivery Date
                  </label>
                  <div className="w-auto mt-2">
                    <DatePicker
                      date={tabsData[activeTab].expected_delivery_date}
                      setDate={(newDate) => {
                        if (newDate < tabsData[activeTab].purchase_order_date) {
                          toast.error("Expected delivery date cannot be before the order date");
                          return;
                        }

                        setTabsData((prev) => ({
                          ...prev,
                          [activeTab]: {
                            ...prev[activeTab],
                            expected_delivery_date: newDate,
                          },
                        }));
                      }}
                      minDate={tabsData[activeTab].purchase_order_date}
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
                    onValueChange={(value) => {
                      setTabsData((prev) => ({
                        ...prev,
                        [activeTab]: {
                          ...prev[activeTab],
                          party: value,
                        },
                      }));
                    }}
                  >
                    <SelectTrigger className="w-auto focus:ring-offset-0 focus:ring-0 text-base">
                      <SelectValue placeholder="Select A Party" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.map((party) => (
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
                    value={tabsData[activeTab].notes}
                    onChange={(e) => {
                      setTabsData((prev) => ({
                        ...prev,
                        [activeTab]: {
                          ...prev[activeTab],
                          notes: e.target.value,
                        },
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
                    {tabsData[activeTab].rows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="p-1">
                          <ReactSelect
                            value={
                              row.item
                                ? {
                                    value: parseInt(row.item),
                                    label: items.find(
                                      (item) =>
                                        item.item_id === parseInt(row.item)
                                    )?.item_name,
                                  }
                                : null
                            }
                            onChange={(selected) => {
                              if (selected) {
                                const selectedItem = items.find(
                                  (item) => item.item_id === selected.value
                                );

                                setTabsData((prev) => ({
                                  ...prev,
                                  [activeTab]: {
                                    ...prev[activeTab],
                                    rows: prev[activeTab].rows.map((r) => {
                                      if (r.id === row.id) {
                                        const defaultQuantity = "1";
                                        const total = (
                                          parseFloat(defaultQuantity) *
                                          parseFloat(
                                            selectedItem.purchase_price
                                          )
                                        ).toFixed(2);

                                        return {
                                          ...r,
                                          item: selected.value,
                                          quantity: defaultQuantity,
                                          unit_id: selectedItem.unit_id,
                                          price: selectedItem.purchase_price,
                                          total: total,
                                        };
                                      }
                                      return r;
                                    }),
                                  },
                                }));
                              } else {
                                setTabsData((prev) => ({
                                  ...prev,
                                  [activeTab]: {
                                    ...prev[activeTab],
                                    rows: prev[activeTab].rows.map((r) => {
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
                                  },
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
                                // Set quantity to 1 and recalculate total
                                setTabsData((prev) => ({
                                  ...prev,
                                  [activeTab]: {
                                    ...prev[activeTab],
                                    rows: prev[activeTab].rows.map((r) => {
                                      if (r.id === row.id) {
                                        return {
                                          ...r,
                                          quantity: "1",
                                          total: (
                                            1 * parseFloat(r.price)
                                          ).toFixed(2),
                                        };
                                      }
                                      return r;
                                    }),
                                  },
                                }));
                              } else {
                                // Update quantity and recalculate total
                                setTabsData((prev) => ({
                                  ...prev,
                                  [activeTab]: {
                                    ...prev[activeTab],
                                    rows: prev[activeTab].rows.map((r) => {
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
                                  },
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
                            value={
                              units?.find(
                                (unit) => unit.unit_id === parseInt(row.unit_id)
                              )?.unit_name || ""
                            }
                            className="w-full border border-gray-400 p-2 rounded-md outline-none resize-none bg-[#F9FAFA]"
                          />
                        </TableCell>

                        <TableCell className="p-1">
                          {/* Selected Items purchase_price and the input will be read only */}
                          <input
                            type="number"
                            value={
                              row.price ||
                              items.find(
                                (item) => item.item_id === parseInt(row.item)
                              )?.purchase_price ||
                              ""
                            }
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
                            {tabsData[activeTab].rows.length > 1 && (
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
                        <span className="flex justify-end">
                          {totals.quantity}
                        </span>
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
                    value={tabsData[activeTab].discountPercentage || ""}
                    onChange={(e) =>
                      handleDiscountPercentageChange(e.target.value)
                    }
                    className="bg-[#F9FAFA] border-0 outline-none p-2 rounded-md w-[80px]"
                  />
                  <span>-</span>
                  <input
                    name="discount_amount"
                    placeholder="$"
                    type="number"
                    step="0.01"
                    value={tabsData[activeTab].discountAmount}
                    onChange={(e) => {
                      const discountAmount = parseFloat(e.target.value) || 0;
                      const totalAmount = totals.amount;
                      const percentage =
                        totalAmount > 0
                          ? ((discountAmount / totalAmount) * 100).toFixed(2)
                          : "0";

                      setTabsData((prev) => ({
                        ...prev,
                        [activeTab]: {
                          ...prev[activeTab],
                          discountAmount: e.target.value,
                          discountPercentage: percentage,
                        },
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
                    value={tabsData[activeTab].taxPercentage || ""}
                    onChange={(e) => handleTaxPercentageChange(e.target.value)}
                    className="bg-[#F9FAFA] border-0 outline-none p-2 rounded-md w-[80px]"
                  />
                  <span>+</span>
                  <input
                    name="tax_amount"
                    placeholder="$"
                    type="number"
                    step="0.01"
                    value={tabsData[activeTab].tax_amount}
                    onChange={(e) => {
                      const taxAmount = parseFloat(e.target.value) || 0;
                      const totalAmount = totals.amount;
                      const percentage =
                        totalAmount > 0
                          ? ((taxAmount / totalAmount) * 100).toFixed(2)
                          : "0";

                      setTabsData((prev) => ({
                        ...prev,
                        [activeTab]: {
                          ...prev[activeTab],
                          tax_amount: e.target.value,
                          taxPercentage: percentage,
                        },
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
                      (parseFloat(tabsData[activeTab].discountAmount) || 0) +
                      (parseFloat(tabsData[activeTab].tax_amount) || 0)
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
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
