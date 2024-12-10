import CustomInput from "@/components/custom/shared/CustomInput";
import CustomLabel from "@/components/custom/shared/CustomLabel";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { axiosInstance } from "@/hook/useTanstackQuery";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const PartyForm = ({ onClose, refetch, defaultValues }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: defaultValues || {},
  });

  // Set form values when editing
  useEffect(() => {
    if (defaultValues) {
      Object.keys(defaultValues).forEach((key) => {
        setValue(key, defaultValues[key]);
      });
    } else {
      reset(); // Reset the form when defaultValues is null
    }
  }, [defaultValues, setValue, reset]);

  const onSubmit = async (formData) => {
    try {
      if (defaultValues?.party_id) {
        // Update party logic
        const response = await axiosInstance.put(
          `/party/${defaultValues.party_id}`,
          formData
        );
        toast.success("Party Updated Successfully!");
      } else {
        // Create new party logic
        const response = await axiosInstance.post("/party", formData);
        toast.success("Party Created Successfully!");
      }
      reset(); // Reset form fields after submission
      refetch();
      onClose(); // Close the modal
    } catch (error) {
      console.error("API Error:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <DialogContent className="w-full lg:max-w-[80%]">
      <DialogHeader>
        <DialogTitle>
          {defaultValues ? "Update Party" : "Add A Party"}
        </DialogTitle>
      </DialogHeader>
      <div className="pt-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-5 py-6 rounded-md bg-white"
        >
          <div className="grid grid-cols-2 gap-6">
            <div>
              <CustomLabel htmlFor={"party_name"} labelName={"Party Name"} />
              <CustomInput
                inputType={"text"}
                inputName={"party_name"}
                inputId={"party_name"}
                {...register("party_name", {
                  required: "Party Name is required",
                })}
              />
              {errors.party_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.party_name.message}
                </p>
              )}
            </div>
            <div>
              <CustomLabel
                htmlFor={"party_number"}
                labelName={"Party Number"}
              />
              <CustomInput
                inputType={"text"}
                inputName={"party_number"}
                inputId={"party_number"}
                {...register("party_number", {
                  required: "Party Number is required",
                })}
              />
              {errors.party_number && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.party_number.message}
                </p>
              )}
            </div>
            <div>
              <CustomLabel htmlFor={"email"} labelName={"Party Email"} />
              <CustomInput
                inputType={"email"}
                inputName={"email"}
                inputId={"email"}
                {...register("email")}
              />
            </div>
            <div>
              <CustomLabel
                htmlFor={"billing_address"}
                labelName={"Billing Address"}
              />
              <CustomInput
                inputType={"text"}
                inputName={"billing_address"}
                inputId={"billing_address"}
                {...register("billing_address")}
              />
            </div>
          </div>
          <div className="mt-6 text-center">
            <button
              type="submit"
              className="px-8 py-2 bg-defaultBlue text-white rounded-md text-lg"
            >
              {defaultValues ? "Update Party" : "Add Party"}
            </button>
          </div>
        </form>
      </div>
    </DialogContent>
  );
};

export default PartyForm;
