import { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "@/hook/useTanstackQuery";
import Loading from "@/components/custom/Loading";
import { format, parseISO } from "date-fns";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

import { Mail, Download, Printer } from "lucide-react";
import PageTitle from "@/components/custom/PageTitle";
import WhatsAppIcon from "./WhatsAppIcon";
import { toast } from "react-toastify";

export default function Invoice({ type }) {
  const { id } = useParams();
  const [saleData, setSaleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const invoiceRef = useRef();

  // Fetch sale data based on type
  useEffect(() => {
    const fetchSaleData = async () => {
      try {
        let response;
        if (type === "sales") {
          response = await axiosInstance.get(`/sales/${id}`);
        } else {
          response = await axiosInstance.get(`/sales-order/${id}`);
        }

        setSaleData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSaleData();
  }, [id, type]);

  if (loading) return <Loading />;
  if (!saleData) return <div>No data found</div>;

  // Get the correct ID and date based on type
  const documentId =
    type === "sales" ? saleData.sales_id : saleData.sales_order_id;
  const documentDate =
    type === "sales" ? saleData.sales_date : saleData.sales_order_date;
  const details =
    type === "sales" ? saleData.sales_details : saleData.sales_order_details;

  const downloadInvoicePDF = async () => {
    try {
      const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // Save with dynamic name based on type and ID
      const fileName = `${
        type === "sales" ? "invoice" : "sales-order"
      }-${documentId}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <>
      <style>
        {`
          @media print {
            /* Hide everything except the invoice */
            .sidebar, .actions {
              display: none !important;
            }
          
      
            .invoice-container {
              width: 100%;
              margin: 0;
              padding: 0;
            }
            /* Optional: Center the invoice content */
            body {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
        `}
      </style>

      <div className="print-hide">
        <PageTitle title={type === "sales" ? "Invoice" : "Sales Order"} />
      </div>

      <div className="flex min-h-screen bg-gray-100 p-4">
        {/* Left sidebar */}
        <div className="w-64 bg-white rounded-lg shadow-sm mr-4 p-4 sidebar">
          <h2 className="text-lg font-semibold mb-4">Select Theme</h2>
          <div className="bg-blue-50 p-3 rounded border border-blue-100">
            <p className="text-sm text-gray-700">Default theme</p>
          </div>
        </div>

        {/* Middle section - Invoice Preview */}
        <div
          className="flex-1 bg-white rounded-lg shadow-sm p-6 invoice-container"
          ref={invoiceRef}
        >
          <h1 className="text-xl font-bold text-center mb-7">Invoice Copy</h1>

          <div className="max-w-3xl mx-auto border rounded-lg p-6">
            {/* Invoice Header */}
            <div className="mb-8">
              <h1 className="text-xl font-bold">Noman Traders</h1>
              <p className="text-gray-600">Phone: 1880845652</p>
            </div>

            {/* Bill To Section */}
            <div className="flex justify-between mb-8">
              <div>
                <h2 className="font-semibold mb-2">Bill To:</h2>
                <p>{saleData.party_name}</p>
              </div>
              <div>
                <h2 className="font-semibold mb-2">
                  {type === "sales" ? "Invoice Details:" : "Order Details:"}
                </h2>
                <p>No: {documentId}</p>
                <p>Date: {format(parseISO(documentDate), 'dd/MM/yyyy')}</p>
              </div>
            </div>

            {/* Invoice Table */}
            <table className="w-full mb-8 border border-collapse">
              <thead>
                <tr className="bg-emerald-500 text-white text-center">
                  <th className="py-3 px-4 border">#</th>
                  <th className="py-3 px-4 border">Item Name</th>
                  <th className="py-3 px-4 border">Quantity</th>
                  <th className="py-3 px-4 border">Price/Unit</th>
                  <th colSpan={2} className="py-3 px-4 border">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody>
                {details.map((item, index) => (
                  <tr
                    key={
                      type === "sales"
                        ? item.sales_detail_id
                        : item.sales_order_detail_id
                    }
                    className="border-b hover:bg-gray-100 text-center"
                  >
                    <td className="py-2 px-4 border">{index + 1}</td>
                    <td className="py-2 px-4 border">{item.item_name}</td>
                    <td className="py-2 px-4 border">{item.quantity}</td>
                    <td className="py-2 px-4 border">${item.price}</td>
                    <td colSpan={2} className="py-2 px-4 border">
                      ${item.total}
                    </td>
                  </tr>
                ))}

                <tr className="border-t">
                  <td
                    colSpan="5"
                    className="text-right py-2 px-4 font-semibold border"
                  >
                    Subtotal:
                  </td>
                  <td className="text-center py-2 px-4 font-semibold border">
                    ${saleData.total_amount}
                  </td>
                </tr>

                {saleData.discount_amount > 0 && (
                  <tr>
                    <td colSpan="5" className="text-right py-2 px-4 border">
                      Discount:
                    </td>
                    <td className="text-center py-2 px-4 border">
                      -${saleData.discount_amount}
                    </td>
                  </tr>
                )}

                {saleData.tax_amount > 0 && (
                  <tr>
                    <td colSpan="5" className="text-right py-2 px-4 border">
                      Tax:
                    </td>
                    <td className="text-center py-2 px-4 border">
                      +${saleData.tax_amount}
                    </td>
                  </tr>
                )}

                <tr>
                  <td
                    colSpan="5"
                    className="text-right py-2 px-4 font-semibold border"
                  >
                    Grand Total:
                  </td>
                  <td className="text-center py-2 px-4 font-semibold border">
                    ${saleData.grand_total}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Notes if any */}
            {saleData.notes && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Notes:</h3>
                <p className="text-gray-600">{saleData.notes}</p>
              </div>
            )}

            {/* Greetings */}
            <div>
              <p className="text-sm text-center">
                Thanks for doing business with us!
              </p>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-64 bg-white rounded-lg shadow-sm ml-4 p-4 actions">
          <h2 className="text-lg font-semibold mb-4">Share</h2>

          <div className="space-y-4">
            <button className="flex items-center justify-center w-full gap-2 p-2 bg-green-500 text-white rounded hover:bg-green-600">
              <WhatsAppIcon />

              <span>WhatsApp</span>
            </button>

            <hr />
            <h2 className="text-lg font-semibold mb-4">Actions</h2>

            <button
              className="flex items-center justify-center w-full gap-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={downloadInvoicePDF}
            >
              <Download size={20} />
              <span>Download PDF</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center justify-center w-full gap-2 p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              <Printer size={20} />
              <span>Print Invoice</span>
            </button>

            <hr />

            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center w-full gap-2 p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
