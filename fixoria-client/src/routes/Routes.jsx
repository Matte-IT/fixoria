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

import CreateExpenseItem from "@/pages/dashboard/expenseItemsPage/CreateExpenseItem";
import EditExpenseItem from "@/pages/dashboard/expenseItemsPage/EditExpenseItem";
import ExpenseItems from "@/pages/dashboard/expenseItemsPage/ExpenseItems";
import AllPaymentIn from "@/pages/dashboard/paymentInPage/AllPaymentIn";
import CreatePaymentIn from "@/pages/dashboard/paymentInPage/CreatePaymentIn";
import AddExpense from "@/pages/dashboard/purchasePage/AddExpense";
import AddPurchase from "@/pages/dashboard/purchasePage/AddPurchase";
import AddPurchaseOrder from "@/pages/dashboard/purchasePage/AddPurchaseOrder";
import AllExpenses from "@/pages/dashboard/purchasePage/AllExpenses";
import EditPurchase from "@/pages/dashboard/purchasePage/EditPurchase";
import EditPurchaseOrder from "@/pages/dashboard/purchasePage/EditPurchaseOrder";
import AddSaleOrder from "@/pages/dashboard/salePage/AddSaleOrder";
import EditSaleOrder from "@/pages/dashboard/salePage/EditSaleOrder";
import SaleOrders from "@/pages/dashboard/salePage/SaleOrders";
import { createBrowserRouter } from "react-router-dom";
import EditProduct from "@/pages/dashboard/productsPage/EditProduct";

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
      // product routes start
      {
        path: "/products",
        element: <ProductsPage />,
      },
      {
        path: "/add-product",
        element: <AddProductPage />,
      },
      {
        path: "/edit-product/:id",
        element: <EditProduct />,
      },
      // product routes end
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

      // Expense Items Module Starts Here
      {
        path: "/create-expense-item",
        element: <CreateExpenseItem />,
      },

      {
        path: "/expense-items",
        element: <ExpenseItems />,
      },

      {
        path: "/edit-expense-item/:id",
        element: <EditExpenseItem />,
      },
      // Expense Items Module Ends Here

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

      // Payment In Module Starts Here
      {
        path: "/paymentIn",
        element: <AllPaymentIn />,
      },
      {
        path: "/add-paymentIn",
        element: <CreatePaymentIn />,
      },
      // Payment In Module Ends Here
    ],
  },
]);

export default router;
