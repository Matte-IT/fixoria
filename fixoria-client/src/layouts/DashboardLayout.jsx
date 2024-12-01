import { Outlet } from "react-router-dom";
import Header from "../components/custom/Header";
import Sidebar from "../components/custom/Sidebar";

const DashboardLayout = () => {
  return (
    <section className="lg:flex lg:min-h-screen">
      <Sidebar extraClass="hidden" />
      <main className="lg:flex-1 h-screen overflow-y-scroll">
        <Header />
        <div className="p-2 lg:p-4">
          <div className="container">
            <Outlet />
          </div>
        </div>
      </main>
    </section>
  );
};

export default DashboardLayout;
