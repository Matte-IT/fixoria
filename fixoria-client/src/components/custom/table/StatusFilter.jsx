import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const StatusFilter = ({ options, setSelectedStatus }) => {
  return (
    <Select onValueChange={(value) => setSelectedStatus(value)}>
      <SelectTrigger className="w-auto outline-none focus:ring-offset-0 focus:ring-0 bg-white">
        <SelectValue placeholder="Status" />
      </SelectTrigger>

      <SelectContent>
        {options.map((option, idx) => (
          <SelectItem
            value={option}
            key={idx}
            className="cursor-pointer capitalize"
          >
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StatusFilter;
