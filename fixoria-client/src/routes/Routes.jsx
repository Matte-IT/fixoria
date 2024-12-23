import InventoryPage from "@/pages/dashboard/inventoryPage/InventoryPage";
import MarketingPage from "@/pages/dashboard/marketingPage/MarketingPage";
import PartiesPage from "@/pages/dashboard/partiesPage/PartiesPage";
import AddProductPage from "@/pages/dashboard/productsPage/AddProductPage";
import ProductsPage from "@/pages/dashboard/productsPage/ProductsPage";
import AddSalePage from "@/pages/dashboard/salePage/AddSalePage";
import EditSale from "@/pages/dashboard/salePage/EditSale";

import Purchase from "@/pages/dashboard/purchasePage/Purchase";
import PurchaseOrders from "@/pages/dashboard/purchasePage/PurchaseOrders";
import SalePage from "@/pages/dashboard/salePage/SalePage";
import SettingsPage from "@/pages/dashboard/settingsPage/settingsPage";
import StorePage from "@/pages/dashboard/storePage/StorePage";
import TransactionPage from "@/pages/dashboard/transactionPage/TransactionPage";
import DashboardLayout from "../layouts/DashboardLayout";

import CreateExpenseItem from "@/pages/dashboard/expenseItemsPage/CreateExpenseItem";
import EditExpenseItem from "@/pages/dashboard/expenseItemsPage/EditExpenseItem";
import ExpenseItems from "@/pages/dashboard/expenseItemsPage/ExpenseItems";
import AllPaymentIn from "@/pages/dashboard/paymentInPage/AllPaymentIn";
import CreatePaymentIn from "@/pages/dashboard/paymentInPage/CreatePaymentIn";
import EditPaymentIn from "@/pages/dashboard/paymentInPage/EditPaymentIn";
import EditProduct from "@/pages/dashboard/productsPage/EditProduct";
import AddExpense from "@/pages/dashboard/purchasePage/AddExpense";
import AddPurchase from "@/pages/dashboard/purchasePage/AddPurchase";
import AddPurchaseOrder from "@/pages/dashboard/purchasePage/AddPurchaseOrder";
import AllExpenses from "@/pages/dashboard/purchasePage/AllExpenses";
import EditExpense from "@/pages/dashboard/purchasePage/EditExpense";
import EditPurchase from "@/pages/dashboard/purchasePage/EditPurchase";
import EditPurchaseOrder from "@/pages/dashboard/purchasePage/EditPurchaseOrder";
import HomePage from "../pages/dashboard/homePage/HomePage";
import ErrorPage from "../pages/errorPage/ErrorPage";

import Invoice from "@/pages/dashboard/invoice/Invoice";
import AddSaleOrder from "@/pages/dashboard/salePage/AddSaleOrder";
import EditSaleOrder from "@/pages/dashboard/salePage/EditSaleOrder";
import SaleOrders from "@/pages/dashboard/salePage/SaleOrders";

import { createBrowserRouter } from "react-router-dom";

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
      // sales routes start
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
      // sales routes end

      // purchase routes start
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
      // purchase routes end

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
      {
        path: "/edit-expense/:id",
        element: <EditExpense />,
      },
      // Expense Module Ends Here

      // Payment In Module Starts Here
      {
        path: "/payment-in",
        element: <AllPaymentIn />,
      },
      {
        path: "/add-payment-in",
        element: <CreatePaymentIn />,
      },
      {
        path: "/edit-payment-in/:id",
        element: <EditPaymentIn />,
      },
      // Payment In Module Ends Here
    ],
  },
  {
    path: "invoice",
    element: <Invoice />,
  },
]);

export default router;
