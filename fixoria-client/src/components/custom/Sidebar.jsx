import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BadgeDollarSign,
  ChartNoAxesColumnIncreasing,
  ChevronDown,
  Goal,
  House,
  Power,
  Settings,
  ShoppingBag,
  ShoppingBasket,
  Users,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import Logo from "../../assets/dashboard/logo.png";
import CustomNavLink from "./CustomNavLink";
import DropDownLink from "./DropDownLink";
import DropDownNavLink from "./DropDownNavLink";

const Sidebar = ({ extraClass }) => {
  return (
    <aside
      className={`mt-3 custom-scrollbar lg:mt-0 lg:w-64 lg:border-r border-gray-200 lg:flex flex-col overflow-y-scroll h-screen justify-between ${extraClass}`}
    >
      <div className="py-2 lg:p-2 xl:p-4">
        {/* Logo Starts Here */}
        <NavLink
          to="/"
          className="hidden lg:flex items-center gap-x-2 font-bold text-xl"
        >
          <img src={Logo} alt="Logo" className="w-9" />
          <span className="text-sm lg:text-[16px] xl:text-xl">
            Fixoria Sales
          </span>
        </NavLink>
        {/* Logo Ends Here */}

        {/* Navbar Links Starts Here */}
        <nav>
          <h6 className="text-gray-600 mt-2 lg:mt-4 font-normal text-xs">
            MAIN MENU
          </h6>
          <ul>
            {/* Home */}
            <CustomNavLink pageLink="/" pageName="Home">
              <House className="w-[18px] h-[18px]" />
            </CustomNavLink>

            <CustomNavLink pageLink="/parties" pageName="Parties">
              <Users className="w-[18px] h-[18px]" />
            </CustomNavLink>

            {/* My Store */}
            <DropDownNavLink dropDownIcon={ShoppingBag} dropDownName="My Store">
              <ul className="relative after:absolute after:content-[''] after:h-full after:w-[2px] after:bg-gray-300 after:top-0 after:-left-3">
                <DropDownLink pageLink="/products" pageName="Products" />
                <DropDownLink pageLink={"/inventory"} pageName={"Inventory"} />
              </ul>
            </DropDownNavLink>

            <DropDownNavLink dropDownIcon={BadgeDollarSign} dropDownName="Sale">
              <ul className="relative after:absolute after:content-[''] after:h-full after:w-[2px] after:bg-gray-300 after:top-0 after:-left-3">
                <DropDownLink pageLink="/sale" pageName="Sale Invoice" />
                <DropDownLink pageLink="/sale-orders" pageName="Sale Orders" />
                <DropDownLink pageLink="/paymentIn" pageName="Payment In" />
              </ul>
            </DropDownNavLink>

            <DropDownNavLink
              dropDownIcon={ShoppingBasket}
              dropDownName="Purchase"
            >
              <ul className="relative after:absolute after:content-[''] after:h-full after:w-[2px] after:bg-gray-300 after:top-0 after:-left-3">
                <DropDownLink pageLink="/purchase" pageName="Purchase Bills" />
                <DropDownLink
                  pageLink="/purchase-orders"
                  pageName="Purchase Orders"
                />
                <DropDownLink pageLink="/expenses" pageName="Expenses" />
              </ul>
            </DropDownNavLink>

            <CustomNavLink pageLink="/settings" pageName="Settings">
              <Settings className="w-[18px] h-[18px]" />
            </CustomNavLink>
            <CustomNavLink pageLink="/marketing" pageName="Marketing">
              <Goal className="w-[18px] h-[18px]" />
            </CustomNavLink>

            <DropDownNavLink
              dropDownIcon={ChartNoAxesColumnIncreasing}
              dropDownName="Analytics Report"
            >
              <ul className="relative after:absolute after:content-[''] after:h-full after:w-[2px] after:bg-gray-300 after:top-0 after:-left-3">
                <DropDownLink
                  pageLink={"/transaction"}
                  pageName={"Show All Transaction"}
                />
              </ul>
            </DropDownNavLink>
          </ul>
          <h6 className="text-gray-600 font-normal text-xs mt-2 lg:mt-3">
            SALES CHANNELS
          </h6>
          <ul>
            <CustomNavLink pageLink="/store" pageName="Online Store">
              <ShoppingBag className="w-[18px] h-[18px]" />
            </CustomNavLink>
          </ul>
        </nav>
        {/* Navbar Links Ends Here */}
      </div>
      <div className="py-2 lg:p-2 xl:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="https://cdn.prod.website-files.com/61a0a26a75358d70b0bf68f9/634fcf3453b051f981d67f82_person-image.jpeg"
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="font-semibold text-gray-900">Himmad</div>
              <div className="text-xs text-gray-600">CEO - Fixoria Studio</div>
            </div>
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger className="focus-visible:outline-none">
                <ChevronDown className="w-[22px] h-[22px] text-gray-600" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="-translate-x-10 lg:-translate-x-9 bg-white">
                <DropdownMenuLabel className="text-center">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  <Link to="/profile" className="block w-full text-center">
                    Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="p-0 hover:bg-transparent mt-2">
                  <button className="flex w-full items-center justify-center gap-x-2 border border-gray-200 p-2 rounded-md bg-red-400 text-white">
                    <span>
                      <Power />
                    </span>
                    LogOut
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
