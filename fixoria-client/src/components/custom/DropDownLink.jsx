import { NavLink } from "react-router-dom";

const DropDownLink = ({ pageLink, pageName }) => {
  return (
    <li>
      <NavLink
        to={pageLink}
        className={({ isActive }) =>
          `flex items-center gap-x-1 text-gray-600 text-sm p-1 mb-1 relative after:absolute after:content-[''] after:h-[2px] after:bg-gray-300 after:top-[12px] after:-left-3 ${
            isActive &&
            "bg-white border border-gray-400 rounded-md text-gray-900 after:w-3 font-semibold"
          }`
        }
      >
        <span>{pageName}</span>
      </NavLink>
    </li>
  );
};

export default DropDownLink;
