import CustomerPage from "@/pages/dashboard/customerPage/CustomerPage";
import InventoryPage from "@/pages/dashboard/inventoryPage/InventoryPage";
import MarketingPage from "@/pages/dashboard/marketingPage/MarketingPage";
import AddProductPage from "@/pages/dashboard/productsPage/AddProductPage";
import ProductsPage from "@/pages/dashboard/productsPage/ProductsPage";
import SalePage from "@/pages/dashboard/salePage/SalePage";
import SettingsPage from "@/pages/dashboard/settingsPage/settingsPage";
import StorePage from "@/pages/dashboard/storePage/StorePage";
import TransactionPage from "@/pages/dashboard/transactionPage/TransactionPage";
import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import HomePage from "../pages/dashboard/homePage/HomePage";
import ErrorPage from "../pages/errorPage/ErrorPage";

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
        path: "/customers",
        element: <CustomerPage />,
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
      {
        path: "/sale",
        element: <SalePage />,
      },
    ],
  },
]);

export default router;
