import React, { useState } from "react";
import { format, subDays, subMonths, subYears } from "date-fns";
import { CalendarIcon, BarChart2, Table } from "lucide-react";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Sample data for different time periods
const generateSampleData = (startDate, endDate, interval) => {
  const data = [];
  let currentDate = startDate;
  while (currentDate <= endDate) {
    data.push({
      date: format(currentDate, "yyyy-MM-dd"),
      amount: Math.floor(Math.random() * 600) + 100,
    });
    switch (interval) {
      case "day":
        currentDate = subDays(currentDate, -1);
        break;
      case "week":
        currentDate = subDays(currentDate, -7);
        break;
      case "month":
        currentDate = subMonths(currentDate, -1);
        break;
      case "year":
        currentDate = subYears(currentDate, -1);
        break;
    }
  }
  return data.reverse();
};

const endDate = new Date(2024, 3, 12);
const startDate = new Date(2024, 0, 1);

const dailyData = generateSampleData(startDate, endDate, "day");
const weeklyData = generateSampleData(startDate, endDate, "week");
const monthlyData = generateSampleData(startDate, endDate, "month");
const yearlyData = generateSampleData(new Date(2020, 0, 1), endDate, "year");

export default function GraphView({ setView }) {
  const [date, setDate] = useState({
    from: startDate,
    to: endDate,
  });
  const [viewMode, setViewMode] = useState("Daily");

  const getDataForViewMode = () => {
    switch (viewMode) {
      case "Daily":
        return dailyData;
      case "Weekly":
        return weeklyData;
      case "Monthly":
        return monthlyData;
      case "Yearly":
        return yearlyData;
    }
  };

  const formatXAxis = (dateString) => {
    const date = new Date(dateString);
    switch (viewMode) {
      case "Daily":
        return format(date, "MM/dd");
      case "Weekly":
        return format(date, "MM/dd");
      case "Monthly":
        return format(date, "MMM");
      case "Yearly":
        return format(date, "yyyy");
    }
  };

  return (
    <div>
      <div className="flex justify-between my-3">
        <div className="space-y-1">
          <h3 className="text-2xl font-semibold tracking-tight">Sales Graph</h3>
        </div>

        <div title="Table View">
          <Table onClick={() => setView("table")} className="cursor-pointer" />
        </div>
      </div>

      <div className="w-full space-y-4 p-4 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "MM/dd/yyyy")} -{" "}
                        {format(date.to, "MM/dd/yyyy")}
                      </>
                    ) : (
                      format(date.from, "MM/dd/yyyy")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center space-x-2">
            {["Daily", "Weekly", "Monthly", "Yearly"].map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? "default" : "outline"}
                onClick={() => setViewMode(mode)}
                className="text-sm"
              >
                {mode}
              </Button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="p-6">
            <div className="h-[400px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={getDataForViewMode()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatXAxis}
                    className="text-xs"
                  />
                  <YAxis
                    domain={[0, 700]}
                    ticks={[0, 100, 200, 300, 400, 500, 600, 700]}
                    className="text-xs"
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  Date
                                </span>
                                <span className="font-bold text-muted-foreground">
                                  {format(
                                    new Date(payload[0].payload.date),
                                    "MM/dd/yyyy"
                                  )}
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  Amount
                                </span>
                                <span className="font-bold">
                                  ${payload[0].value}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
