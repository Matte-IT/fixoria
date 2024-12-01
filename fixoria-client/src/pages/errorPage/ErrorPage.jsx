import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ErrorImage from "../../assets/error.svg";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <img src={ErrorImage} alt="Error Image" className="w-1/2" />
        <Button
          onClick={() => navigate("/")}
          className="bg-defaultBlue px-4 py-2 rounded-md hover:bg-defaultBlue"
        >
          Back To Home
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
