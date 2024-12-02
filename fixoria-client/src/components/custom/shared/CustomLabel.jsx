const CustomLabel = ({ htmlFor, labelName }) => {
  return (
    <label className="block mb-2 text-base text-[#333]" htmlFor={htmlFor}>
      {labelName}
    </label>
  );
};

export default CustomLabel;
