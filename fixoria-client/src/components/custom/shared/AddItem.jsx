import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function AddItem({ itemName, link }) {
  return (
    <>
      <Link to={link}>
        <Button
          className="flex items-center gap-x-2 bg-defaultBlue hover:bg-defaultBlueHover
        duration-300"
        >
          <Plus />
          {itemName}
        </Button>
      </Link>
    </>
  );
}
