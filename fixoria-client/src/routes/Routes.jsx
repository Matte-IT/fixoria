import InventoryPage from "@/pages/dashboard/inventoryPage/InventoryPage";
import MarketingPage from "@/pages/dashboard/marketingPage/MarketingPage";
import PartiesPage from "@/pages/dashboard/partiesPage/PartiesPage";
import AddProductPage from "@/pages/dashboard/productsPage/AddProductPage";
import ProductsPage from "@/pages/dashboard/productsPage/ProductsPage";

import AddSalePage from "@/pages/dashboard/salePage/AddSalePage";
import SalePage from "@/pages/dashboard/salePage/SalePage";
import SettingsPage from "@/pages/dashboard/settingsPage/settingsPage";
import StorePage from "@/pages/dashboard/storePage/StorePage";
import TransactionPage from "@/pages/dashboard/transactionPage/TransactionPage";

import Purchase from "@/pages/dashboard/purchasePage/Purchase";
import DashboardLayout from "../layouts/DashboardLayout";
import HomePage from "../pages/dashboard/homePage/HomePage";
import ErrorPage from "../pages/errorPage/ErrorPage";

import AddPurchase from "@/pages/dashboard/purchasePage/AddPurchase";
<<<<<<< HEAD
import EditSale from "@/pages/dashboard/salePage/EditSale";

=======
import EditPurchase from "@/pages/dashboard/purchasePage/EditPurchase";
import { createBrowserRouter } from "react-router-dom";
>>>>>>> jahid
const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/products",
        element: <ProductsPage />,
      },
      {
        path: "/add-product",
        element: <AddProductPage />,
      },
      {
        path: "/inventory",
        element: <InventoryPage />,
      },
      {
        path: "/parties",
        element: <PartiesPage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
      {
        path: "/marketing",
        element: <MarketingPage />,
      },
      {
        path: "/transaction",
        element: <TransactionPage />,
      },
      {
        path: "/store",
        element: <StorePage />,
      },
      // sales route
      {
        path: "/sale",
        element: <SalePage />,
      },
      {
        path: "/add-sale",
        element: <AddSalePage />,
      },
      {
        path: "/edit-sale/:id",
        element: <EditSale />,
      },
      // purchase routes
      {
        path: "/purchase",
        element: <Purchase />,
      },
      {
        path: "/add-purchase",
        element: <AddPurchase />,
      },
      {
        path: "/edit-purchase/:id",
        element: <EditPurchase />,
      },
    ],
  },
]);

export default router;
