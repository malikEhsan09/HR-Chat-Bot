import { useContext, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import { ThemeContext } from "./theme/ThemeContext.jsx";
import SuperAdminDashboard from "./pages/SuperAdminDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import EmployeeDashboard from "./pages/Employeedashboard.jsx";

const App = () => {
  const { theme } = useContext(ThemeContext);
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Determine if the current path is a dashboard path
  const isDashboardRoute =
    location.pathname === "/superAdmin" ||
    location.pathname === "/admin" ||
    location.pathname === "/employee" ||
    location.pathname === "/login";

  return (
    <div
      className={`${
        theme === "light" ? "bg-white" : "bg-black"
      } min-h-screen flex flex-col text-black dark:text-white`}
    >
      {!isDashboardRoute && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={<LoginPage onLogout={handleLogout} />}
          />
          <Route
            path="/superadmin"
            element={<SuperAdminDashboard onLogout={handleLogout} />}
          />
          <Route
            path="/admin"
            element={<AdminDashboard onLogout={handleLogout} />}
          />
          <Route
            path="/employee"
            element={<EmployeeDashboard onLogout={handleLogout} />}
          />
        </Routes>
      </main>
      {!isDashboardRoute && <Footer />}
    </div>
  );
};
export default App;
