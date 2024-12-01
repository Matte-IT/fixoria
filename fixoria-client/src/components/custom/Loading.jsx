import FadeLoader from "react-spinners/FadeLoader";

const Loading = () => {
  const color = "black";

  return (
    <div className="flex items-center justify-center h-[500px]">
      <FadeLoader
        color={color}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loading;
