import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera } from "lucide-react";
import { useState } from "react";
import PlaceholderImage from "../../../assets/dashboard/plahoderimage.png";

const AddModal = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <DialogContent className="max-w-full w-2/3">
      <DialogHeader>
        <DialogTitle>Add A Product</DialogTitle>
        <div className="pt-5">
          <form action="#" className="px-3 py-6 rounded-md bg-white">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="productName"
                  className="block mb-2 text-base text-[#333]"
                >
                  Product Name
                </label>
                <input
                  className="w-full p-3 border border-gray-300 outline-none rounded bg-gray-100"
                  type="text"
                  placeholder="Enter The Product Name"
                  id="productName"
                />
              </div>
              <div>
                <label
                  htmlFor="productCategory"
                  className="block mb-2 text-base text-[#333]"
                >
                  Product Category
                </label>
                <input
                  className="w-full p-3 border border-gray-300 outline-none rounded bg-gray-100"
                  type="text"
                  placeholder="Enter The Product Category"
                  id="productCategory"
                />
              </div>
              <div>
                <label
                  htmlFor="productSKU"
                  className="block mb-2 text-base text-[#333]"
                >
                  Product SKU
                </label>
                <input
                  className="w-full p-3 border border-gray-300 outline-none rounded bg-gray-100"
                  type="text"
                  placeholder="Enter The Product SKU"
                  id="productSKU"
                />
              </div>
              <div>
                <label
                  htmlFor="productIncoming"
                  className="block mb-2 text-base text-[#333]"
                >
                  Incoming Product
                </label>
                <input
                  className="w-full p-3 border border-gray-300 outline-none rounded bg-gray-100"
                  type="number"
                  placeholder="Enter The Incoming Product Number"
                  id="productIncoming"
                />
              </div>
              <div>
                <label
                  htmlFor="productStock"
                  className="block mb-2 text-base text-[#333]"
                >
                  Stock Product
                </label>
                <input
                  className="w-full p-3 border border-gray-300 outline-none rounded bg-gray-100"
                  type="number"
                  placeholder="Enter The Stock Product Number"
                  id="productStock"
                />
              </div>
              <div>
                <label
                  htmlFor="productPrice"
                  className="block mb-2 text-base text-[#333]"
                >
                  Product Price
                </label>
                <input
                  className="w-full p-3 border border-gray-300 outline-none rounded bg-gray-100"
                  type="number"
                  placeholder="Enter The Product Price"
                  id="productPrice"
                />
              </div>
              <div className="flex items-center gap-4 justify-between">
                <div>
                  <label
                    htmlFor="productStatus"
                    className="block mb-2 text-base text-[#333]"
                  >
                    Product Status
                  </label>
                  <Select>
                    <SelectTrigger className="w-auto focus:ring-0 focus:ring-offset-0">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in stock">In Stock</SelectItem>
                      <SelectItem value="out of stock">Out Of Stock</SelectItem>
                      <SelectItem value="low stock">Low Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label
                    htmlFor="productImage"
                    className="block mb-2 text-base text-[#333]"
                  >
                    Product Image
                  </label>
                  <label className="px-4 py-2 bg-gray-100 rounded-md flex items-center gap-2 text-[#333] cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <Camera />
                    Upload A Product Image
                  </label>
                </div>
              </div>
              <div className="flex gap-4 justify-between items-center">
                <div className="border-gray-300 border rounded-md w-[100px] h-[100px] shrink-0 flex items-center justify-center">
                  <img
                    src={selectedImage || PlaceholderImage}
                    alt="Selected"
                    className="rounded-md w-[90px] h-[90px] object-cover"
                  />
                </div>
                <div className="pt-4 w-full">
                  <button
                    type="submit"
                    className="w-full bg-defaultBlue text-white rounded-md p-3 text-lg"
                  >
                    Upload This Product
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </DialogHeader>
    </DialogContent>
  );
};

export default AddModal;
