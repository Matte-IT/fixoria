import DatePicker from "@/components/custom/DatePicker";
import Loading from "@/components/custom/Loading";
import PageName from "@/components/custom/PageName";
import PageTitle from "@/components/custom/PageTitle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useTanstackQuery, { axiosInstance } from "@/hook/useTanstackQuery";
import { Paperclip } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreatePaymentIn = () => {
  const navigate = useNavigate();
  const [fileDisplay, setFileDisplay] = useState("Upload A File");
  const [originalFileName, setOriginalFileName] = useState(null);
  const [date, setDate] = useState(new Date());

  const { data, isLoading, error, refetch } = useTanstackQuery("/party");
  const {
    data: paymentTypes,
    isLoading: paymentTypeLoading,
    error: paymentTypeError,
  } = useTanstackQuery("/payment-type");

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();

  // Get selected payment type to check if it's Bkash
  const selectedPaymentType = watch("payment_type_id");

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("payment_date", date.toISOString());
      formData.append("party_id", data.party_id);
      formData.append("payment_type_id", data.payment_type_id);
      formData.append("notes", data.notes || "");
      formData.append("received_amount", data.received_amount);

      if (originalFileName) {
        const fileInput = document.querySelector('input[type="file"]');
        formData.append("file", fileInput.files[0]);
      }

      await axiosInstance.post("/payment-in", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      refetch();
      toast.success("Payment added successfully");
      navigate("/payment-in");
    } catch (error) {
      console.error("Error creating payment:", error);
      toast.error(error.response?.data?.error || "Failed to create payment");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fullFileName = file.name;
      setOriginalFileName(fullFileName);

      // Create truncated display version
      const fileExtension = fullFileName.split(".").pop();
      const baseName = fullFileName.replace(`.${fileExtension}`, "");
      const displayName =
        baseName.length > 6 ? baseName.slice(0, 6) + "..." : baseName;
      setFileDisplay(`${displayName}.${fileExtension}`);
    } else {
      setFileDisplay("Upload A File");
      setOriginalFileName(null);
    }
  };

  if (isLoading || paymentTypeLoading) return <Loading />;
  if (error || paymentTypeError) return <p>Error</p>;

  return (
    <>
      <div className="flex gap-3 flex-wrap items-center justify-between my-6">
        <PageName pageName="Add Payment-In" />
        <PageTitle title="Add Payment-In" />
      </div>
      <div className="p-2 rounded-md bg-white">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-start gap-4 mb-4">
            <div>
              <label className="text-base w-[120px]">Date</label>
              <div className="w-auto mt-2">
                <DatePicker date={date} setDate={setDate} />
              </div>
            </div>

            <div className="shrink-0">
              <div className="mb-2">
                <label className="text-base">Select A Party</label>
              </div>
              <Controller
                name="party_id"
                control={control}
                rules={{ required: "Party is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-auto focus:ring-offset-0 focus:ring-0">
                      <SelectValue placeholder="Select A Party" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.map((party) => (
                        <SelectItem
                          key={party.party_id}
                          value={`${party.party_id}`}
                        >
                          {party.party_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.party_id && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.party_id.message}
                </p>
              )}
            </div>

            <div className="shrink-0">
              <div className="mb-2">
                <label className="text-base">Select Payment Type</label>
              </div>
              <Controller
                name="payment_type_id"
                control={control}
                rules={{ required: "Payment type is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-auto focus:ring-offset-0 focus:ring-0">
                      <SelectValue placeholder="Select A Party" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentTypes.map((type) => (
                        <SelectItem
                          key={type.payment_type_id}
                          value={`${type.payment_type_id}`}
                        >
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.payment_type_id && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.payment_type_id.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <div className="mb-2">
                <label className="text-base">Notes</label>
              </div>

              <textarea
                {...register("notes", {
                  required:
                    selectedPaymentType === "2"
                      ? "Notes required for this payment type"
                      : false,
                })}
                className="border border-gray-400 p-2 rounded-md outline-none resize-none bg-[#F9FAFA] w-full"
                placeholder="Add notes here"
              />
              {errors.notes && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.notes.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-baseline justify-center gap-4">
            <div className="shrink-0">
              <div className="mb-2">
                <label className="text-base">Upload A File</label>
              </div>

              <label className="px-4 py-2 bg-gray-100 rounded-md flex items-center gap-2 text-[#333] cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*, .pdf, .doc, .docx, .xls, .xlsx"
                  onChange={handleFileChange}
                />
                <Paperclip />
                {fileDisplay}
              </label>
            </div>

            <div className="shrink-0">
              <div className="flex items-end gap-4">
                <div>
                  <div className="mb-2">
                    <label className="text-base">Received Amount</label>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    {...register("received_amount", {
                      required: "Amount is required",
                      min: {
                        value: 0.01,
                        message: "Amount must be greater than 0",
                      },
                      pattern: {
                        value: /^\d+(\.\d{1,2})?$/,
                        message: "Amount can have up to 2 decimal places",
                      },
                    })}
                    className="p-2 rounded-md border border-gray-400  bg-[#F9FAFA] focus:outline-none"
                  />
                  {errors.received_amount && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.received_amount.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-5 py-2 bg-defaultBlue rounded-md text-white"
                >
                  Add Payment In
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreatePaymentIn;
