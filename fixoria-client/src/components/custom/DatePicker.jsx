import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, ChevronDown } from "lucide-react";

const DatePicker = ({ date, setDate }) => {
  const handleDateSelect = (newDate) => {
    if (newDate) {
      const normalizedDate = new Date(
        newDate.getFullYear(),
        newDate.getMonth(),
        newDate.getDate(),
        12
      );
      setDate(normalizedDate);
    } else {
      setDate(null);
    }
  };

  const displayDate = date ? new Date(date) : null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-semibold bg-white hover:bg-white text-headingTextColor",
            !displayDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {displayDate ? format(displayDate, "PPP") : <span>Pick A Date</span>}
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={displayDate}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
