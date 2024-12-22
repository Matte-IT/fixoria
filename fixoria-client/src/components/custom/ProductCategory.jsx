import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useTanstackQuery, { axiosInstance } from "@/hook/useTanstackQuery";

import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Loading from "./Loading";

const ProductCategory = ({ setCategory, initialCategoryId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const dropdownRef = useRef(null);

  const { data, isLoading, error, refetch } = useTanstackQuery("/category");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // Set selected category based on category_id from initialCategoryId
    if (initialCategoryId && data) {
      const matchedCategory = data.find(
        (category) => category.category_id === initialCategoryId
      );
      if (matchedCategory) {
        setSelectedCategory(matchedCategory);
        setCategory(matchedCategory); // Notify parent component
      }
    }
  }, [initialCategoryId, data, setCategory]);

  const createCategory = async (formData) => {
    try {
      const response = await axiosInstance.post("/category", {
        category_name: formData.category_name,
      });

      await refetch();
      reset();
      setIsDialogOpen(false);
      toast.success("Category Created!");

      selectCategory(response.data);
    } catch (error) {
      toast.error("Category Already Exists!");
    }
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setCategory(category); // Notify parent component
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <p>Error loading categories</p>;
  }

  return (
    <div className="w-full relative" ref={dropdownRef}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-start font-normal p-2 bg-gray-100 border border-gray-300 outline-none rounded text-base"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          {selectedCategory
            ? selectedCategory.category_name
            : "Select Product Category"}
        </button>

        {isOpen && (
          <div
            className="absolute top-full left-0 w-full mt-1 border rounded-md max-h-72 overflow-y-auto bg-white shadow-lg z-50"
            role="listbox"
          >
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-start font-normal flex items-center gap-x-2 bg-defaultBlue hover:bg-defaultBlue text-white hover:text-white"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus /> Add New Category
            </Button>

            {data.map((category) => (
              <div
                key={category.category_id}
                onClick={() => selectCategory(category)}
                className={`px-3 py-2 cursor-pointer hover:bg-slate-50 ${
                  selectedCategory?.category_id === category.category_id
                    ? "bg-blue-100"
                    : ""
                }`}
                role="option"
                aria-selected={
                  selectedCategory?.category_id === category.category_id
                }
              >
                {category.category_name}
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <input
              {...register("category_name", {
                required: "Category name is required",
              })}
              placeholder="e.g., Grocery"
              className="w-full px-3 py-2 border rounded-md outline-none"
            />

            {errors.category_name && (
              <span className="text-red-600">
                {errors.category_name.message}
              </span>
            )}

            <Button
              type="button"
              onClick={handleSubmit(createCategory)}
              className="w-full bg-defaultBlue hover:bg-defaultBlue text-white"
            >
              Create
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductCategory;
