import React from "react";

const CustomInput = React.forwardRef(
  ({ inputType, inputName, inputId, ...rest }, ref) => {
    return (
      <input
        type={inputType}
        name={inputName}
        id={inputId}
        ref={ref}
        className="w-full p-2 border border-gray-300 outline-none rounded bg-gray-100"
        {...rest}
      />
    );
  }
);

export default CustomInput;
