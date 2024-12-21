import DatePicker from "@/components/custom/DatePicker";
import CustomInput from "@/components/custom/shared/CustomInput";
import CustomLabel from "@/components/custom/shared/CustomLabel";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { axiosInstance } from "@/hook/useTanstackQuery";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const PartyForm = ({ onClose, refetch, defaultValues }) => {
  const [date, setDate] = useState(() => {
    if (defaultValues?.balance_as_of_date) {
      try {
        const parsedDate = new Date(defaultValues.balance_as_of_date);
        if (!isNaN(parsedDate.getTime())) {
          return new Date(
            parsedDate.getFullYear(),
            parsedDate.getMonth(),
            parsedDate.getDate(),
            12
          );
        }
      } catch (e) {
        console.error("Error parsing date:", e);
      }
    }
    // Return current date for new parties
    return new Date();
  });

  // Reset form when defaultValues changes
  useEffect(() => {
    if (defaultValues?.balance_as_of_date) {
      try {
        const parsedDate = new Date(defaultValues.balance_as_of_date);
        if (!isNaN(parsedDate.getTime())) {
          setDate(
            new Date(
              parsedDate.getFullYear(),
              parsedDate.getMonth(),
              parsedDate.getDate(),
              12
            )
          );
        }
      } catch (e) {
        console.error("Error parsing date:", e);
      }
    } else {
      setDate(new Date()); // Reset date when creating new party
    }
  }, [defaultValues]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: defaultValues || {
      opening_balance: "0.00",
      balance_as_of_date: new Date().toISOString().split('T')[0]
    },
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
      const formattedDate = date
        ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}-${String(date.getDate()).padStart(2, "0")}`
        : null;

      const dataWithDate = {
        ...formData,
        balance_as_of_date: formattedDate,
      };

      if (defaultValues?.party_id) {
        await axiosInstance.put(
          `/party/${defaultValues.party_id}`,
          dataWithDate
        );
        toast.success("Party Updated Successfully!");
      } else {
        await axiosInstance.post("/party", dataWithDate);
        toast.success("Party Created Successfully!");
      }

      reset();
      setDate(null); // Reset date after submission
      refetch();
      onClose();
    } catch (error) {
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

            <div>
              <CustomLabel
                htmlFor={"opening_balance"}
                labelName={"Opening Balance"}
              />
              <CustomInput
                inputType={"number"}
                inputName={"opening_balance"}
                inputId={"opening_balance"}
                defaultValue={"0.00"}
                step="0.01"
                {...register("opening_balance")}
              />
            </div>

            <div className="w-full">
            <CustomLabel
                labelName={"Balance as of Date"}
              />

              <DatePicker
                selected={date}
                onChange={(date) => {
                  setDate(date);
                }}
                date={date}
                setDate={setDate}
                dateFormat="yyyy-MM-dd"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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
