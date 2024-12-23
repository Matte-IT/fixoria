import Loading from "@/components/custom/Loading";
import PageName from "@/components/custom/PageName";
import PageTitle from "@/components/custom/PageTitle";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useTanstackQuery, { axiosInstance } from "@/hook/useTanstackQuery";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CreateExpenseItem() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm();

  const { data: units, isLoading, error } = useTanstackQuery("/unit");

  if (isLoading) return <Loading />;
  if (error) return <p>Error loading units</p>;

  const onSubmit = async (data) => {
    // Ensure the name is in lowercase before submitting
    data.name = data.name.toLowerCase();
    data.price = Number(data.price);
    try {
      await axiosInstance.post("/expense-items", data);
      toast.success("Expense item created!");
      navigate("/expense-items");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("Expense item with the same name already exists.");
      } else {
        toast.error("Failed to create expense item");
      }
    }
  };

  return (
    <div>
      <PageTitle title="Create An Expense Item" />
      <div className="mx-auto mt-8">
        <PageName pageName="Create An Expense Item" />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-6 rounded-lg shadow mt-6"
        >
          <div className="grid grid-cols-3 gap-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <input
                type="text"
                id="name"
                {...register("name", { required: "Name is required" })}
                className={`w-full mt-1 px-3 py-2 border rounded-md focus:outline-none ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <input
                id="price"
                type="number"
                {...register("price", { required: "Price is required" })}
                className={`w-full mt-1 px-3 py-2 border rounded-md focus:outline-none ${
                  errors.price ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter price"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <Label>Unit</Label>
              <Select
                onValueChange={(value) => {
                  setValue("unit_id", value);
                  trigger("unit_id");
                }}
              >
                <SelectTrigger
                  className={`w-full mt-1 focus:ring-offset-0 focus:ring-0 ${
                    errors.unit_id ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Select a unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem
                      key={unit.unit_id}
                      value={unit.unit_id.toString()}
                    >
                      {unit.unit_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="hidden"
                {...register("unit_id", { required: "Unit is required" })}
              />
              {errors.unit_id && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.unit_id.message}
                </p>
              )}
            </div>
          </div>

          <div className="w-full mt-6">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              {...register("description")}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none resize-none"
              rows="3"
              placeholder="Enter description"
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-defaultBlue text-white rounded-md"
            >
              Create An Expense Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
