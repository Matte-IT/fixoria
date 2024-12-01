import { NavLink } from "react-router-dom";

const CustomNavLink = ({ pageLink, pageName, children }) => {
  return (
    <li className="mt-2">
      <NavLink
        to={pageLink}
        className={({ isActive }) =>
          `flex items-center gap-x-2 text-gray-600 text-sm py-2 px-4 rounded-md ${
            isActive && "bg-white border border-gray-400 text-gray-900"
          }`
        }
      >
        {children}
        <span>{pageName}</span>
      </NavLink>
    </li>
  );
};

export default CustomNavLink;
