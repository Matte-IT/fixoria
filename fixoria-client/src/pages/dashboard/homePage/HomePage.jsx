import HomePageCard from "@/components/custom/HomePageCard";
import PageName from "@/components/custom/PageName";
import PageTitle from "@/components/custom/PageTitle";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, ChevronDown, Plus } from "lucide-react";
import { useState } from "react";

const HomePage = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div>
      <PageTitle title="Home" />

      <div className="flex gap-3 flex-wrap items-center justify-between mb-6">
        <PageName pageName="Marketing" />
        <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "justify-start text-left font-semibold bg-white hover:bg-white text-headingTextColor",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
                <ChevronDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Select>
            <SelectTrigger className="bg-white text-headingTextColor font-semibold focus:ring-transparent w-auto">
              <SelectValue placeholder="All Channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Demo 01</SelectItem>
              <SelectItem value="dark">Demo 02</SelectItem>
              <SelectItem value="system">Demo 03</SelectItem>
            </SelectContent>
          </Select>
          <Button className="flex items-center gap-x-2 bg-defaultBlue hover:bg-defaultBlue">
            <Plus />
            Create Campaign
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        <HomePageCard
          title="Total Sales"
          price="11,249"
          text="↑ 10% vs last 45 days"
        />
        <HomePageCard
          title="Sales Attribute"
          price="15,149"
          text="↑ 05% vs last 45 days"
        />
        <HomePageCard
          title="Average Order Value"
          price="1,232"
          text="↑ 45% vs last 45 days"
        />
      </div>
    </div>
  );
};

export default HomePage;
