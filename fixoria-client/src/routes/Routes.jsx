import InventoryPage from "@/pages/dashboard/inventoryPage/InventoryPage";
import MarketingPage from "@/pages/dashboard/marketingPage/MarketingPage";
import PartiesPage from "@/pages/dashboard/partiesPage/PartiesPage";
import AddProductPage from "@/pages/dashboard/productsPage/AddProductPage";
import ProductsPage from "@/pages/dashboard/productsPage/ProductsPage";

import AddSalePage from "@/pages/dashboard/salePage/AddSalePage";
import EditSale from "@/pages/dashboard/salePage/EditSale";
import SalePage from "@/pages/dashboard/salePage/SalePage";
import SettingsPage from "@/pages/dashboard/settingsPage/settingsPage";
import StorePage from "@/pages/dashboard/storePage/StorePage";
import TransactionPage from "@/pages/dashboard/transactionPage/TransactionPage";

import Purchase from "@/pages/dashboard/purchasePage/Purchase";
import PurchaseOrders from "@/pages/dashboard/purchasePage/PurchaseOrders";
import DashboardLayout from "../layouts/DashboardLayout";
import HomePage from "../pages/dashboard/homePage/HomePage";
import ErrorPage from "../pages/errorPage/ErrorPage";

import AddExpense from "@/pages/dashboard/purchasePage/AddExpense";
import AddPurchase from "@/pages/dashboard/purchasePage/AddPurchase";
import AddPurchaseOrder from "@/pages/dashboard/purchasePage/AddPurchaseOrder";
import AllExpenses from "@/pages/dashboard/purchasePage/AllExpenses";
import EditPurchase from "@/pages/dashboard/purchasePage/EditPurchase";
import EditPurchaseOrder from "@/pages/dashboard/purchasePage/EditPurchaseOrder";
import { createBrowserRouter } from "react-router-dom";
import SaleOrders from "@/pages/dashboard/salePage/SaleOrders";
import AddSaleOrder from "@/pages/dashboard/salePage/AddSaleOrder";
import EditSaleOrder from "@/pages/dashboard/salePage/EditSaleOrder";

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
      {
        path: "/sale-orders",
        element: <SaleOrders />,
      },
      {
        path: "/add-sale-order",
        element: <AddSaleOrder />,
      },
      {
        path: "/edit-sale-order/:id",
        element: <EditSaleOrder />,
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
      {
        path: "/purchase-orders",
        element: <PurchaseOrders />,
      },
      {
        path: "/add-purchase-order",
        element: <AddPurchaseOrder />,
      },
      {
        path: "/edit-purchase-order/:id",
        element: <EditPurchaseOrder />,
      },
      // Expense Module Starts Here
      {
        path: "/expenses",
        element: <AllExpenses />,
      },
      {
        path: "/add-expense",
        element: <AddExpense />,
      },
      // Expense Module Ends Here
    ],
  },
]);

export default router;
