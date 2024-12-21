import DatePicker from "@/components/custom/DatePicker";
import Loading from "@/components/custom/Loading";
import PageName from "@/components/custom/PageName";
import PageTitle from "@/components/custom/PageTitle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useTanstackQuery from "@/hook/useTanstackQuery";
import { Paperclip } from "lucide-react";
import { useState } from "react";

const CreateExpenseItem = () => {
  const { data, isLoading, error } = useTanstackQuery("/party");
  const [date, setDate] = useState(new Date());

  if (isLoading) return <Loading />;
  if (error) return <p>Error</p>;

  return (
    <>
      <div className="flex gap-3 flex-wrap items-center justify-between my-6">
        <PageName pageName="Create An Expense Item" />
        <PageTitle title="Create An Expense Item" />
      </div>
      <div className="p-2 rounded-md bg-white">
        <form action="">
          <div className="flex items-start gap-4 mb-4">
            <div>
              <label className="text-base w-[120px]">Date</label>
              <div className="w-auto mt-2">
                <DatePicker />
              </div>
            </div>

            <div className="shrink-0">
              <div className="mb-2">
                <label className="text-base">Select A Party</label>
              </div>

              <Select
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
                <SelectTrigger className="w-auto focus:ring-offset-0 focus:ring-0">
                  <SelectValue placeholder="Select A Party" />
                </SelectTrigger>
                <SelectContent>
                  {data.map((party) => (
                    <SelectItem
                      key={party.party_id}
                      value={`${party.party_id}`}
                    >
                      {party.party_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="shrink-0">
              <div className="mb-2">
                <label className="text-base">Select Payment Type</label>
              </div>

              <Select>
                <SelectTrigger className="w-auto focus:ring-offset-0 focus:ring-0">
                  <SelectValue placeholder="Select Payment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Cash</SelectItem>
                  <SelectItem value="2">Bkash</SelectItem>
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
              ></textarea>
            </div>
          </div>

          <div className="flex items-baseline justify-center gap-4">
            <div className="shrink-0">
              <div className="mb-2">
                <div className="mb-2">
                  <label className="text-base">Upload A File</label>
                </div>

                <label className="px-4 py-2 bg-gray-100 rounded-md flex items-center gap-2 text-[#333] cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*, .pdf, .doc, .docx, .xls, .xlsx"
                  />
                  <Paperclip />
                  Upload A File
                </label>
              </div>
            </div>

            <div className="shrink-0">
              <div className="flex items-end gap-4">
                <div>
                  <div className="mb-2">
                    <label className="text-base">Received Amount</label>
                  </div>
                  <input
                    type="number"
                    name=""
                    className="p-2 rounded-md border border-gray-400  bg-[#F9FAFA] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2 bg-defaultBlue rounded-md text-white"
                >
                  Add Payment In
                </button>
              </div>
            </div>
            <div></div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateExpenseItem;
