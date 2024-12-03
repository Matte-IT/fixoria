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
import useTanstackQuery from "@/hook/useTanstackQuery";
import { Camera, Plus, StickyNote, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const AddSalePage = () => {
  const [tabs, setTabs] = useState([{ id: 1, title: "Sale #1" }]);
  const [activeTab, setActiveTab] = useState(1);
  
  // Create a state object to store form data for each tab
  const [tabsData, setTabsData] = useState({
    1: {
      date: new Date(),
      rows: [
        { id: 1, item: "", quantity: "", unit: "", price: "", amount: "" },
        { id: 2, item: "", quantity: "", price: "", unit: "", amount: "" },
      ],
      party: "",
      billingAddress: "",
      invoiceNumber: "",
      description: "",
      discount: "",
      discountAmount: "",
      tax: "",
    }
  });

  const addNewTab = () => {
    if (tabs.length < 5) {
      const newId = Math.max(...tabs.map((tab) => tab.id)) + 1;
      const newTab = {
        id: newId,
        title: `Sale #${newId}`,
      };
      setTabs([...tabs, newTab]);
      // Initialize state for the new tab
      setTabsData(prev => ({
        ...prev,
        [newId]: {
          date: new Date(),
          rows: [
            { id: 1, item: "", quantity: "", unit: "", price: "", amount: "" },
            { id: 2, item: "", quantity: "", price: "", unit: "", amount: "" },
          ],
          party: "",
          billingAddress: "",
          invoiceNumber: "",
          description: "",
          discount: "",
          discountAmount: "",
          tax: "",
        }
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
        title: `Sale #${index + 1}`,
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
      { id: newId, item: "", quantity: "", unit: "", price: "", amount: "" },
    ];
    
    setTabsData(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        rows: newRows
      }
    }));
  };

  const deleteRow = (rowId) => {
    const currentRows = tabsData[activeTab].rows;
    if (currentRows.length > 1) {
      const newRows = currentRows.filter((row) => row.id !== rowId);
      setTabsData(prev => ({
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          rows: newRows
        }
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

        if (field === "quantity" || field === "price") {
          const quantity =
            field === "quantity"
              ? parseFloat(value) || 0
              : parseFloat(row.quantity) || 0;
          const price =
            field === "price"
              ? parseFloat(value) || 0
              : parseFloat(row.price) || 0;
          updates.amount = (quantity * price).toFixed(2);
        }

        return { ...row, ...updates };
      }
      return row;
    });

    setTabsData(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        rows: newRows
      }
    }));
  };

  const calculateTotals = () => {
    const currentRows = tabsData[activeTab].rows;
    return currentRows.reduce(
      (acc, row) => ({
        quantity: acc.quantity + (parseFloat(row.quantity) || 0),
        amount: acc.amount + (parseFloat(row.amount) || 0),
      }),
      { quantity: 0, amount: 0 }
    );
  };

  const { data, isLoading, error } = useTanstackQuery(
    "http://localhost:5000/party"
  );
  const {
    data: units,
    isLoading: loading,
    error: fetchError,
  } = useTanstackQuery("http://localhost:5000/unit");

  if (isLoading || loading) return <Loading />;
  if (error || fetchError) return <p>Error</p>;

  const totals = calculateTotals();

  return (
    <div>
      <PageTitle title="Add Sale" />

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
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="flex justify-between">
                <div>
                  <Select>
                    <SelectTrigger className="w-auto focus:ring-offset-0 focus:ring-0 text-base">
                      <SelectValue placeholder="Select Party" />
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

                  <div className="mt-4">
                    <textarea
                      className="border border-gray-400 p-2 rounded-md outline-none resize-none bg-[#F9FAFA] w-[400px]"
                      name=""
                      id=""
                      placeholder="Billing Address"
                    ></textarea>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <label
                      htmlFor="invoice_number"
                      className="text-base w-[120px]"
                    >
                      Invoice Number
                    </label>
                    <input
                      id="invoice_number"
                      placeholder="Ex. 2"
                      type="text"
                      className="bg-[#F9FAFA] border-0 outline-none p-2 rounded-md"
                    />
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <label
                      htmlFor="invoice_number"
                      className="text-base w-[120px]"
                    >
                      Invoice Date
                    </label>
                    <div className="w-[230px]">
                      <DatePicker date={tabsData[activeTab].date} setDate={(newDate) => {
                        setTabsData(prev => ({
                          ...prev,
                          [activeTab]: { ...prev[activeTab], date: newDate }
                        }));
                      }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="my-5">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead>#</TableHead>
                      <TableHead className="w-[400px]">ITEM</TableHead>
                      <TableHead className="w-[140px]">QTY</TableHead>
                      <TableHead>UNIT</TableHead>
                      <TableHead>PRICE/UNIT</TableHead>
                      <TableHead>AMOUNT</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tabsData[activeTab].rows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="p-1">
                          <div className="flex items-center gap-2 text-base">
                            <div className="span w-[10px]">{row.id}</div>
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
                        <TableCell className="p-1">
                          <input
                            type="text"
                            value={row.item}
                            onChange={(e) =>
                              updateRow(row.id, "item", e.target.value)
                            }
                            className="w-full border border-gray-400 p-2 rounded-md outline-none resize-none bg-[#F9FAFA]"
                          />
                        </TableCell>
                        <TableCell className="p-1">
                          <input
                            type="number"
                            value={row.quantity}
                            onChange={(e) =>
                              updateRow(row.id, "quantity", e.target.value)
                            }
                            className="w-full border border-gray-400 p-2 rounded-md outline-none resize-none bg-[#F9FAFA]"
                          />
                        </TableCell>
                        <TableCell className="p-1">
                          <Select
                            value={row.unit}
                            onValueChange={(value) =>
                              updateRow(row.id, "unit", value)
                            }
                          >
                            <SelectTrigger className="w-auto focus:ring-offset-0 focus:ring-0 text-base">
                              <SelectValue placeholder="Select Unit" />
                            </SelectTrigger>
                            <SelectContent>
                              {units.map((unit) => (
                                <SelectItem
                                  className="text-base"
                                  key={unit.unit_id}
                                  value={`${unit.unit_id}`}
                                >
                                  {unit.unit_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="p-1">
                          <input
                            type="number"
                            value={row.price}
                            onChange={(e) =>
                              updateRow(row.id, "price", e.target.value)
                            }
                            className="w-full border border-gray-400 p-2 rounded-md outline-none resize-none bg-[#F9FAFA]"
                          />
                        </TableCell>
                        <TableCell className="p-1">
                          <input
                            type="text"
                            value={row.amount}
                            readOnly
                            className="w-full border border-gray-400 p-2 rounded-md outline-none resize-none bg-[#F9FAFA]"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell className="p-1"></TableCell>
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

              <div className="flex justify-between items-center">
                <div>
                  <textarea
                    className="border border-gray-400 p-2 rounded-md outline-none resize-none bg-[#F9FAFA] w-[400px]"
                    name=""
                    id=""
                    placeholder="Description"
                  ></textarea>

                  <div className="mt-2 my-4">
                    <label className="px-4 py-2 bg-gray-100 rounded-md flex items-center gap-2 text-[#333] cursor-pointer w-[200px]">
                      <input type="file" className="hidden" accept="image/*" />
                      <Camera />
                      Add Image
                    </label>
                  </div>
                  <div>
                    <label className="px-4 py-2 bg-gray-100 rounded-md flex items-center gap-2 text-[#333] cursor-pointer w-[200px]">
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                      />
                      <StickyNote />
                      Add Document
                    </label>
                  </div>
                </div>
                <div>
                  <div>
                    <div className="flex items-center gap-x-2">
                      <label className="text-base">Discount</label>
                      <input
                        placeholder="%"
                        type="text"
                        className="bg-[#F9FAFA] border-0 outline-none p-2 rounded-md w-[80px]"
                      />
                      <span>-</span>
                      <input
                        placeholder="$"
                        type="text"
                        className="bg-[#F9FAFA] border-0 outline-none p-2 rounded-md w-[80px]"
                      />
                    </div>
                    <div className="flex items-center gap-x-2 my-3">
                      <label className="text-base">Tax</label>
                      <input
                        placeholder="Enter Tax"
                        type="text"
                        className="bg-[#F9FAFA] border-0 outline-none p-2 rounded-md w-full"
                      />
                    </div>
                    <div className="flex items-center gap-x-2">
                      <label className="text-base">Total</label>
                      <input
                        type="text"
                        className="bg-[#F9FAFA] border-0 outline-none p-2 rounded-md w-full"
                      />
                    </div>
                  </div>
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

export default AddSalePage;
