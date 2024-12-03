import React, { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subMonths,
  parse,
} from "date-fns";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import Card from "./Card";
import {
  ChartNoAxesColumn,
  Equal,
  FileSpreadsheet,
  Plus,
  Printer,
} from "lucide-react";

const options = {
  timeRanges: [
    { label: "All Sale Invoices", value: "all" },
    { label: "This Month", value: "this-month" },
    { label: "Last Month", value: "last-month" },
    { label: "This Year", value: "this-year" },
  ],
  firms: [
    { label: "ALL FIRMS", value: "all" },
    { label: "Firm A", value: "firm-a" },
    { label: "Firm B", value: "firm-b" },
  ],
};

export function SalePageHeader() {
  const [timeRange, setTimeRange] = useState("all");
  const [date, setDate] = useState({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 11, 31),
  });
  const [selectedFirm, setSelectedFirm] = useState("all");

  useEffect(() => {
    const now = new Date();
    const ranges = {
      "this-month": { from: startOfMonth(now), to: endOfMonth(now) },
      "last-month": {
        from: startOfMonth(subMonths(now, 1)),
        to: endOfMonth(subMonths(now, 1)),
      },
      "this-year": { from: startOfYear(now), to: endOfYear(now) },
      all: { from: new Date(2024, 0, 1), to: new Date(2024, 11, 31) },
    };
    setDate(ranges[timeRange]);
  }, [timeRange]);

  const handleDateChange = (field, value) => {
    const parsedDate = parse(value, "dd/MM/yyyy", new Date());
    if (!isNaN(parsedDate.getTime())) setDate({ ...date, [field]: parsedDate });
  };

  const renderSelect = (value, onChange, options, width) => (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`w-[${width}]`}>
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex items-center space-x-4 mb-6">
          {renderSelect(timeRange, setTimeRange, options.timeRanges, "200px")}

          <div className="flex items-center border">
            <span className="text-sm text-white bg-gray-500 px-2 py-1 rounded">
              Between
            </span>
            <Input
              type="text"
              value={format(date.from, "dd/MM/yyyy")}
              onChange={(e) => handleDateChange("from", e.target.value)}
              className="w-[100px] border-none"
            />
            <span className="text-sm text-muted-foreground">To</span>
            <Input
              type="text"
              value={format(date.to, "dd/MM/yyyy")}
              onChange={(e) => handleDateChange("to", e.target.value)}
              className="w-[100px] border-none"
            />
          </div>

          {renderSelect(selectedFirm, setSelectedFirm, options.firms, "130px")}
        </div>

        {/* icons */}
        <div className="flex gap-5">
          <ChartNoAxesColumn />
          <FileSpreadsheet />
          <Printer />
        </div>
      </div>

      <div className="flex gap-3 items-center">
        <Card title="Paid" price="400$" bgColor={"bg-blue-200"} />
        <Plus />
        <Card title="Unpaid" price="400$" bgColor={"bg-blue-300"} />
        <Equal />
        <Card title="Total" price="500$" bgColor={"bg-purple-300"} />
      </div>
    </div>
  );
}
