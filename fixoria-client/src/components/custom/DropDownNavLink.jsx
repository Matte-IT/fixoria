import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const DropDownNavLink = ({
  dropDownIcon: DropDownIcon,
  dropDownName,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-2">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex gap-x-4 items-center justify-between text-gray-600 text-sm py-2 px-4 w-full focus-visible:outline-0 focus-within:text-black transition">
          <div className="flex gap-x-1 items-center">
            {DropDownIcon && <DropDownIcon className="w-[18px] h-[18px]" />}
            <span>{dropDownName}</span>
          </div>

          <ChevronDown
            className={`w-[22px] h-[22px] icon-rotate ${
              isOpen ? "icon-rotate-open" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent
          className={`ml-8 content-animation ${
            isOpen
              ? "content-enter content-enter-active"
              : "content-exit content-exit-active"
          }`}
        >
          {children}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default DropDownNavLink;
