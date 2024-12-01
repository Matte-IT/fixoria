import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bell, LayoutDashboard, Mail } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../../assets/dashboard/logo.png";
import HeaderSearch from "./HeaderSearch";
import Sidebar from "./Sidebar";

const Header = () => {
  const [open, setOpen] = useState(false);
  const toggleSidebar = () => setOpen(!open);

  return (
    <header className="p-2 lg:p-4 border-b border-gray-200">
      <div className="container flex gap-x-2 lg:gap-x-0 justify-between items-center">
        <div className="block lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <LayoutDashboard className="w-9 h-9 text-headingTextColor z-50 lg:hidden" />
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[240px] sm:w-[300px] p-3 overflow-y-scroll"
            >
              <SheetTitle>
                <NavLink to="/">
                  <img src={Logo} alt="Logo" className="w-9" />
                </NavLink>
              </SheetTitle>
              <Sidebar extraClass="flex min-h-[80vh] lg:min-h-[auto]" />
            </SheetContent>
          </Sheet>
        </div>

        <HeaderSearch />

        <div className="flex gap-1 lg:gap-x-2">
          <button className="p-2 bg-gray-200 rounded text-gray-600">
            <Bell />
          </button>
          <button className="p-2 bg-gray-200 rounded text-gray-600">
            <Mail />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
