import { Mail, Download, Printer } from "lucide-react";
import PageTitle from "@/components/custom/PageTitle";

export default function Invoice() {
  return (
    <>
      <PageTitle title="Invoice" />

      <div className="flex min-h-screen bg-gray-100 p-4">
        {/* Left sidebar */}
        <div className="w-64 bg-white rounded-lg shadow-sm mr-4 p-4">
          <h2 className="text-lg font-semibold mb-4">Select Theme</h2>
          <div className="bg-blue-50 p-3 rounded border border-blue-100">
            <p className="text-sm text-gray-700">Default Theme</p>
          </div>
        </div>

        {/* Middle section - Invoice Preview */}
        <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
          <div className="max-w-3xl mx-auto border rounded-lg p-6">
            {/* Invoice Header */}
            <div className=" mb-8">
              <h1 className="text-xl font-bold">Company 007</h1>
              <p className="text-gray-600">Phone: 1880845652</p>
            </div>

            {/* Bill To Section */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="font-semibold mb-2">Bill To:</h2>
                <p>Jahid</p>
              </div>
              <div>
                <h2 className="font-semibold mb-2">Invoice Details:</h2>
                <p>No: 3</p>
                <p>Date: 23/12/2024</p>
              </div>
            </div>

            {/* Invoice Table */}
            <table className="w-full mb-8">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">#</th>
                  <th className="text-left py-2">Item name</th>
                  <th className="text-right py-2">Quantity</th>
                  <th className="text-right py-2">Price/Unit</th>
                  <th className="text-right py-2">Amount</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="py-2">1</td>
                  <td className="py-2">laptop</td>
                  <td className="text-right py-2">1</td>
                  <td className="text-right py-2">200.00</td>
                  <td className="text-right py-2">200.00</td>
                </tr>
                <tr>
                  <td className="py-2">2</td>
                  <td className="py-2">Mouse</td>
                  <td className="text-right py-2">1</td>
                  <td className="text-right py-2">100.00</td>
                  <td className="text-right py-2">100.00</td>
                </tr>

                <tr className="border-t">
                  <td colSpan="4" className="text-right py-2 font-semibold">
                    Total:
                  </td>
                  <td className="text-right py-2 font-semibold">300.00</td>
                </tr>
              </tbody>
            </table>

            {/* greetings */}
            <div>
              <p className="text-sm text-center ">
                Thanks for doing business with us!
              </p>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-64 bg-white rounded-lg shadow-sm ml-4 p-4">
          <h2 className="text-lg font-semibold mb-4">Share Invoice</h2>
          <div className="space-y-4">
            <button className="flex items-center justify-center w-full gap-2 p-2 bg-green-500 text-white rounded hover:bg-green-600">
              {/* <WhatsappIcon size={20} /> */}
              <span>WhatsApp</span>
            </button>
            <button className="flex items-center justify-center w-full gap-2 p-2 bg-red-500 text-white rounded hover:bg-red-600">
              <Mail size={20} />
              <span>Gmail</span>
            </button>
            <hr />
            <button className="flex items-center justify-center w-full gap-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              <Download size={20} />
              <span>Download PDF</span>
            </button>
            <button className="flex items-center justify-center w-full gap-2 p-2 bg-gray-500 text-white rounded hover:bg-gray-600">
              <Printer size={20} />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
