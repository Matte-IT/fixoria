import Loading from "@/components/custom/Loading";
import PageName from "@/components/custom/PageName";
import PageTitle from "@/components/custom/PageTitle";
import ProductCategory from "@/components/custom/ProductCategory";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useTanstackQuery from "@/hook/useTanstackQuery";
import { Camera } from "lucide-react";
import { useState } from "react";
import PlaceholderImage from "../../../assets/dashboard/plahoderimage.png";

const AddProductPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState("");
  const { data, isLoading, error } = useTanstackQuery(
    "http://localhost:5000/unit"
  );

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

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <p>Error</p>;
  }

  return (
    <div>
      <PageTitle title="Create Product" />
      <PageName pageName="Create A Product" />
      <div className="pt-5">
        <form action="#" className="px-3 py-6 rounded-md bg-white">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="productName"
                className="block mb-2 text-base text-[#333]"
              >
                Product Name
              </label>
              <input
                className="w-full p-2 border border-gray-300 outline-none rounded bg-gray-100"
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
              <ProductCategory />
            </div>
            <div>
              <label
                htmlFor="productCategory"
                className="block mb-2 text-base text-[#333]"
              >
                Product Unit
              </label>

              <Select
                value={selectedUnit}
                onValueChange={(value) => setSelectedUnit(value)}
              >
                <SelectTrigger className="w-full focus:ring-0 focus:ring-offset-0 p-2 h-[42px]">
                  <SelectValue placeholder="Select Product Unit">
                    {selectedUnit || "Select Product Unit"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <SelectItem disabled>Loading...</SelectItem>
                  ) : (
                    data?.map((unit) => (
                      <SelectItem key={unit.unit_id} value={unit.unit_name}>
                        {unit.unit_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label
                htmlFor="productSKU"
                className="block mb-2 text-base text-[#333]"
              >
                Product SKU
              </label>
              <input
                className="w-full p-2 border border-gray-300 outline-none rounded bg-gray-100"
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
                className="w-full p-2 border border-gray-300 outline-none rounded bg-gray-100"
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
                className="w-full p-2 border border-gray-300 outline-none rounded bg-gray-100"
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
                className="w-full p-2 border border-gray-300 outline-none rounded bg-gray-100"
                type="number"
                placeholder="Enter The Product Price"
                id="productPrice"
              />
            </div>
            <div className="flex items-start gap-2 justify-between">
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
              <div className="border-gray-300 border rounded-md w-[100px] h-[100px] shrink-0 flex items-center justify-center">
                <img
                  src={selectedImage || PlaceholderImage}
                  alt="Selected"
                  className="rounded-md w-[90px] h-[90px] object-cover"
                />
              </div>
            </div>
          </div>
          <div className="max-w-[300px] mx-auto mt-5">
            <button
              type="submit"
              className="w-full bg-defaultBlue text-white rounded-md p-2 text-lg"
            >
              Upload This Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
