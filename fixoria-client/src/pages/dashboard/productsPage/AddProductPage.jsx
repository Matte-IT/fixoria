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
import useTanstackQuery, { axiosInstance } from "@/hook/useTanstackQuery";
import { Camera } from "lucide-react";
import { useState } from "react";

import DatePicker from "@/components/custom/DatePicker";
import { useForm } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-toastify";

const AddProductPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [date, setDate] = useState(null);

  const [category, setCategory] = useState(null);
  const [isProduct, setIsProduct] = useState(true);

  const { data, isLoading, error } = useTanstackQuery("/unit");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    const finalData = {
      item_name: formData.productName,
      category_id: category?.category_id,
      type_id: isProduct ? 1 : 2,
      unit_id: parseInt(selectedUnit),
      image_path: selectedImage,
      item_code: formData.code,
      sale_price: parseFloat(formData.salePrice),
      purchase_price: parseFloat(formData.purchasePrice),
      wholesale_price: parseFloat(formData.wholesalePrice),
      minimum_wholesale_quantity: parseInt(formData.wholesaleQty, 10),
      opening_quantity: parseInt(formData.openingQty, 10),
      at_price: parseFloat(formData.productAtPrice),
      as_of_date: date,
      min_stock: parseInt(formData.stockToMaintain, 10),
    };

    try {
      const res = await axiosInstance.post("/product", finalData);
      toast.success(res.data.message);
    } catch (res) {
      toast.error(res.response.data.message);
    }

    reset();
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

      {/* form */}
      <div className="pt-5">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-5 py-6 rounded-md bg-white"
        >
          {/* item type switch */}
          <div className="text-base space-y-2 mb-5">
            <p>Select your product type!</p>

            <div className="flex items-center space-x-2">
              <Label
                htmlFor="isProduct"
                className={`${!isProduct && "text-blue-600"} text-base`}
              >
                Service
              </Label>
              <Switch
                id="isProduct"
                checked={isProduct}
                onCheckedChange={() => setIsProduct(!isProduct)}
              />
              <Label
                htmlFor="isProduct"
                className={`${isProduct && "text-blue-600"} text-base`}
              >
                Product
              </Label>
            </div>
          </div>

          {/* all fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label
                htmlFor="productName"
                className="block mb-2 text-base text-[#333]"
              >
                Product Name
              </label>

              <input
                {...register("productName")}
                className="w-full p-2 border border-gray-300 outline-none rounded bg-gray-100"
                type="text"
                placeholder="Enter The Product Name"
                id="productName"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block mb-2 text-base text-[#333]"
              >
                Category
              </label>

              <ProductCategory setCategory={setCategory} />
            </div>

            <div>
              <label
                htmlFor="unit"
                className="block mb-2 text-base text-[#333]"
              >
                Unit
              </label>

              <Select
                value={selectedUnit}
                onValueChange={(value) => {
                  setSelectedUnit(value);
                }}
              >
                <SelectTrigger className="w-full focus:ring-0 focus:ring-offset-0 p-2 h-[42px]">
                  <SelectValue placeholder="Select Product Unit" />
                </SelectTrigger>

                <SelectContent>
                  {isLoading ? (
                    <SelectItem disabled>Loading...</SelectItem>
                  ) : (
                    data?.map((unit) => (
                      <SelectItem key={unit.unit_id} value={`${unit.unit_id}`}>
                        {unit.unit_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label
                htmlFor="productCode"
                className="block mb-2 text-base text-[#333]"
              >
                Product Code
              </label>

              <input
                {...register("code")}
                className="w-full p-2 border border-gray-300 outline-none rounded bg-gray-100"
                type="text"
                placeholder="Enter an unique product code"
                id="productCode"
              />
            </div>

            <div>
              <label
                htmlFor="image"
                className="block mb-2 text-base text-[#333]"
              >
                Image
              </label>

              <label className="px-4 py-2 bg-gray-100 rounded-md flex items-center gap-2 text-[#333] cursor-pointer">
                <input
                  {...register("image")}
                  type="file"
                  className="hidden"
                  accept="image/*"
                />
                <Camera />
                Upload A Image
              </label>
            </div>
          </div>

          <Tabs defaultValue="price" className="mt-16">
            {isProduct ? (
              <TabsList className="grid w-[400px] grid-cols-2">
                <TabsTrigger
                  value="price"
                  className="w-full px-4 py-2 text-center border-b-2 transition-colors duration-300 
        data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 
        data-[state=inactive]:text-gray-500 data-[state=inactive]:border-transparent"
                >
                  Price
                </TabsTrigger>
                <TabsTrigger
                  value="stock"
                  className="w-full px-4 py-2 text-center border-b-2 transition-colors duration-300 
        data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 
        data-[state=inactive]:text-gray-500 data-[state=inactive]:border-transparent"
                >
                  Stock
                </TabsTrigger>
              </TabsList>
            ) : (
              <TabsList className="w-[200px]">
                <TabsTrigger
                  value="price"
                  className="w-full px-4 py-2 text-center border-b-2 transition-colors duration-300 
        data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 
        data-[state=inactive]:text-gray-500 data-[state=inactive]:border-transparent"
                >
                  Price
                </TabsTrigger>
              </TabsList>
            )}

            <TabsContent value="price">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label
                    htmlFor="SalePrice"
                    className="block mb-2 text-base text-[#333]"
                  >
                    Sale Price
                  </label>

                  <input
                    {...register("salePrice")}
                    className="w-full p-2 border border-gray-300 outline-none rounded bg-gray-100"
                    type="number"
                    placeholder="Enter the product price"
                    id="SalePrice"
                  />
                </div>

                <div>
                  <label
                    htmlFor="wholesale price"
                    className="block mb-2 text-base text-[#333]"
                  >
                    Wholesale Price
                  </label>

                  <input
                    {...register("wholesalePrice")}
                    className="w-full p-2 border border-gray-300 outline-none rounded bg-gray-100"
                    type="number"
                    placeholder="Enter the wholesale product price"
                    id="wholesale price"
                  />
                </div>

                <div>
                  <label
                    htmlFor="wholesale qty"
                    className="block mb-2 text-base text-[#333]"
                  >
                    Minimum Wholesale Qty
                  </label>

                  <input
                    {...register("wholesaleQty")}
                    className="w-full p-2 border border-gray-300 outline-none rounded bg-gray-100"
                    type="number"
                    placeholder="Wholesale quantity"
                    id="wholesale qty"
                  />
                </div>

                <div>
                  <label
                    htmlFor="purchase price"
                    className="block mb-2 text-base text-[#333]"
                  >
                    Purchase Price
                  </label>

                  <input
                    {...register("purchasePrice")}
                    className="w-full p-2 border border-gray-300 outline-none rounded bg-gray-100"
                    type="number"
                    placeholder="Purchased Price"
                    id="purchase price"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stock">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label
                    htmlFor="purchase price"
                    className="block mb-2 text-base text-[#333]"
                  >
                    Minimum stock to maintain
                  </label>

                  <input
                    {...register("stockToMaintain")}
                    className="w-full p-2 border border-gray-300 outline-none rounded bg-gray-100"
                    type="text"
                    placeholder="Minimum stock to maintain"
                    id="purchase price"
                  />
                </div>

                <div className="w-full">
                  <label
                    htmlFor="purchase price"
                    className="block mb-2 text-base text-[#333]"
                  >
                    Product as of date
                  </label>

                  <DatePicker date={date} setDate={setDate} />
                </div>

                <div>
                  <label className="block mb-2 text-base text-[#333]">
                    Opening Qty
                  </label>

                  <input
                    {...register("openingQty")}
                    className="w-full p-2 border border-gray-300 outline-none rounded bg-gray-100"
                    type="number"
                    placeholder="Enter quantity"
                    id="purchase price"
                  />
                </div>

                <div>
                  <label
                    htmlFor="product at price"
                    className="block mb-2 text-base text-[#333]"
                  >
                    Product At Price
                  </label>

                  <input
                    {...register("productAtPrice")}
                    className="w-full p-2 border border-gray-300 outline-none rounded bg-gray-100"
                    type="number"
                    placeholder="Product at Price"
                    id="purchase price"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="max-w-[300px] mx-auto mt-5">
            <button
              type="submit"
              className="w-full bg-defaultBlue hover:bg-defaultBlueHover duration-300 text-white rounded-md p-2 text-lg"
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
