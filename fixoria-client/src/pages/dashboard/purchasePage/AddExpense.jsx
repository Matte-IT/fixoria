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
import { Paperclip, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ReactSelect from "react-select";
import { toast } from "react-toastify";

const AddExpense = () => {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState("Upload A File");
  const [tabs, setTabs] = useState([{ id: 1, title: "Expense #1" }]);
  const [activeTab, setActiveTab] = useState(1);

  // Simplified tabsData state
  const [tabsData, setTabsData] = useState({
    1: {
      date: new Date(),
      rows: [
        { id: 1, item: "", quantity: "", unit_id: "", price: "", total: "" },
        { id: 2, item: "", quantity: "", unit_id: "", price: "", total: "" },
      ],
      notes: "",
      fileName: "Upload A File",
    },
  });

  // Simplified form defaults
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      expense_date: new Date(),
      total_amount: 0,
      grand_total: 0,
      notes: "",
      expenseDetails: [],
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

  const { data: units } = useTanstackQuery("/unit");

  const {
    data: items,
    isLoading: itemsLoading,
    error: itemsError,
  } = useTanstackQuery("/expense-items");

  const activeItems = items?.filter((item) => item.is_active) || [];

  if (itemsLoading) return <Loading />;
  if (itemsError) return <p>Error</p>;

  const addNewTab = () => {
    if (tabs.length < 5) {
      const newId = Math.max(...tabs.map((tab) => tab.id)) + 1;
      const newTab = {
        id: newId,
        title: `Expense #${newId}`,
      };
      setTabs([...tabs, newTab]);

      // Initialize new tab with empty values
      setTabsData((prev) => ({
        ...prev,
        [newId]: {
          date: new Date(),
          rows: [
            { id: 1, item: "", quantity: "", unit: "", price: "", total: "" },
            { id: 2, item: "", quantity: "", price: "", unit: "", total: "" },
          ],
          notes: "",
          fileName: "Upload A File", // Initialize file name for new tab
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
        title: `Expense #${index + 1}`,
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

  const onSubmit = async (formData) => {
    try {
      const currentTab = tabsData[activeTab];
      const fileInput = document.querySelector('input[type="file"]');

      // Validate rows
      const filledRows = currentTab.rows.filter(
        (row) => row.item && row.quantity && row.price && row.total
      );

      if (filledRows.length === 0) {
        toast.error("Please add at least one valid expense item");
        return;
      }

      // Create expense data object
      const expenseData = {
        expense_date: currentTab.date.toISOString(),
        total_amount: totals.amount.toString(),
        grand_total: totals.amount.toString(),
        notes: currentTab.notes || "",
        is_deleted: false,
        expenseDetails: filledRows.map((row) => ({
          expense_item_id: parseInt(row.item),
          quantity: parseFloat(row.quantity),
          price: parseFloat(row.price),
          total: parseFloat(row.total),
        })),
      };

      // Create FormData
      const formData = new FormData();

      // First append the main data
      formData.append("expenseData", JSON.stringify(expenseData));

      // Then append file if exists
      if (fileInput?.files[0]) {
        formData.append("file", fileInput.files[0]);
      }

      const response = await axiosInstance.post("/expense", formData);

      if (response.status === 201) {
        toast.success("Expense created successfully!");
        reset();
        navigate("/expenses");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create expense");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const originalFileName = file.name;
      const fileExtension = originalFileName.split(".").pop();
      const baseName = originalFileName.replace(`.${fileExtension}`, "");
      const displayName =
        baseName.length > 6 ? baseName.slice(0, 6) + "..." : baseName;

      setTabsData((prev) => ({
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          fileName: `${displayName}.${fileExtension}`,
          originalFileName: originalFileName, // Store original filename
        },
      }));
    } else {
      setTabsData((prev) => ({
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          fileName: "Upload A File",
          originalFileName: null,
        },
      }));
    }
  };

  const handleItemSelect = (
    selected,
    row,
    setTabsData,
    activeTab,
    activeItems
  ) => {
    if (selected) {
      const selectedItem = activeItems.find(
        (item) => item.expense_item_id === selected.value
      );

      if (!selectedItem) {
        toast.error("Invalid item selected");
        return;
      }

      setTabsData((prev) => ({
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          rows: prev[activeTab].rows.map((r) => {
            if (r.id === row.id) {
              const defaultQuantity = "1";
              const price = selectedItem.price;
              const total = (
                parseFloat(defaultQuantity) * parseFloat(price)
              ).toFixed(2);

              return {
                ...r,
                item: selected.value, // Store as number
                quantity: defaultQuantity, // Store as string
                unit_id: selectedItem.unit_id,
                price: price, // Store as number
                total: total, // Store as string
              };
            }
            return r;
          }),
        },
      }));
    }
  };

  return (
    <div>
      <PageTitle title="Add Expense" />

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
                  <label className="text-base w-[120px]">Date</label>
                  <div className="w-auto mt-2">
                    <DatePicker
                      date={tabsData[activeTab].date}
                      setDate={(newDate) => {
                        setTabsData((prev) => ({
                          ...prev,
                          [activeTab]: { ...prev[activeTab], date: newDate },
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
                    {tabsData[activeTab].fileName}
                  </label>
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
                                    label: activeItems.find(
                                      (item) =>
                                        item.expense_item_id ===
                                        parseInt(row.item)
                                    )?.name,
                                  }
                                : null
                            }
                            onChange={(selected) =>
                              handleItemSelect(
                                selected,
                                row,
                                setTabsData,
                                activeTab,
                                activeItems
                              )
                            }
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
                      <TableCell className="p-1"></TableCell>
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
};

export default AddExpense;
