import { Button } from "@/components/ui/button";
import { ArrowDownToLine } from "lucide-react";

export default function Import() {
  return (
    <>
      <Button className="flex items-center gap-x-2 bg-white hover:bg-white text-headingTextColor border border-gray-200 font-semibold">
        <ArrowDownToLine />
        <span>Import</span>
      </Button>
    </>
  );
}
