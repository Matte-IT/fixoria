import { Button } from "@/components/ui/button";
import { FileChartColumnIncreasing } from "lucide-react";

export default function Export() {
  return (
    <>
      <Button className="flex items-center gap-x-2 bg-white hover:bg-white text-headingTextColor border border-gray-200 font-semibold">
        <FileChartColumnIncreasing />
        <span>Export</span>
      </Button>
    </>
  );
}
