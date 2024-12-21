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
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditExpenseItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm();

  const { data: units, isLoading, error } = useTanstackQuery("/unit");

  // Fetch expense item details for editing
  const {
    data: expenseItem,
    isLoading: itemLoading,
    error: itemError,
  } = useTanstackQuery(`/expense-items/${id}`);

  if (isLoading || itemLoading) return <Loading />;
  if (error || itemError) return <p>Error loading units or expense item</p>;

  // Set the form values once data is fetched
  if (expenseItem) {
    setValue("name", expenseItem.name);
    setValue("price", expenseItem.price);
    setValue("unit_id", expenseItem.unit_id.toString());
    setValue("description", expenseItem.description);
  }

  // Submit handler to update the expense item
  const onSubmit = async (data) => {
    // Convert unit_id to integer before sending it to backend
    const updatedData = {
      ...data,
      name: data.name.toLowerCase(),
      price: Number(data.price),
      unit_id: parseInt(data.unit_id),
    };

    try {
      // Use PUT to update the item
      const response = await axiosInstance.put(
        `/expense-items/${id}`,
        updatedData
      );
      toast.success("Expense item updated successfully!");
      navigate("/expense-items"); // Redirect after update
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  return (
    <div>
      <PageTitle title="Edit Expense Item" />
      <div className="mx-auto mt-8">
        <PageName pageName="Edit Expense Item" />
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
              <Controller
                name="unit_id"
                control={control}
                defaultValue={expenseItem ? expenseItem.unit_id.toString() : ""}
                rules={{ required: "Unit is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
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
                )}
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
              Update Expense Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpenseItem;
