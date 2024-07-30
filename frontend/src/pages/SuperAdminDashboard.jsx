import { useState, useEffect, useContext } from "react";
import {
  MdAdminPanelSettings,
  MdAutoDelete,
  MdCheckCircle,
} from "react-icons/md";
import {
  FaUsers,
  FaUserSecret,
  FaPencilAlt,
  FaHome,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { RiLogoutCircleLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import axios from "axios";
import { ThemeContext } from "../theme/ThemeContext.jsx"; // Import the ThemeContext

const SuperAdminDashboard = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [admins, setAdmins] = useState([]);
  const [superAdmin, setSuperAdmin] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [editAdminId, setEditAdminId] = useState(null);
  const [deletedAdminId, setDeletedAdminId] = useState(null);
  const [employee, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const adminsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuperAdminDetails = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/superadmin/details"
        );
        setSuperAdmin(response.data);
      } catch (error) {
        console.error("Failed to fetch super admin details", error);
      }
    };

    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3000/api/superadmin/getAllAdmin",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAdmins(response.data || []);
      } catch (error) {
        setMessage("Failed to fetch admins");
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/admin/getAllEmployees"
        );
        setEmployees(response.data || []);
      } catch (error) {
        setMessage("Failed to fetch admins");
      }
    };

    fetchSuperAdminDetails();
    fetchAdmins();
    fetchEmployees();
  }, []);

  const createAdmin = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/superadmin/createAdmin",
        {
          username,
          password,
          email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(response.data.message);
      setAdmins((prevAdmins) => [...prevAdmins, response.data.admin]);
      setModalIsOpen(false);
      setUsername("");
      setPassword("");
      setEmail("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create admin");
    }
  };

  const updateAdmin = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:3000/api/superadmin/updateAdmin/${editAdminId}`,
        {
          username,
          password,
          email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(response.data.message);
      setAdmins((prevAdmins) =>
        prevAdmins.map((admin) =>
          admin._id === editAdminId ? response.data : admin
        )
      );
      setModalIsOpen(false);
      setUsername("");
      setPassword("");
      setEmail("");
      setEditAdminId(null);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update admin");
    }
  };

  const deleteAdmin = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:3000/api/superadmin/deleteAdmin/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("Admin deleted successfully");
      setDeletedAdminId(id);
      setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin._id !== id));
      setDeleteModalIsOpen(true);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to delete admin");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditAdminId(null);
    setUsername("");
    setPassword("");
    setEmail("");
  };

  const closeDeleteModal = () => {
    setDeleteModalIsOpen(false);
    setDeletedAdminId(null);
  };

  const openModal = (admin = null) => {
    if (admin) {
      setEditAdminId(admin._id);
      setUsername(admin.username);
      setEmail(admin.email);
    } else {
      setEditAdminId(null);
      setUsername("");
      setPassword("");
      setEmail("");
    }
    setModalIsOpen(true);
  };

  // Pagination logic
  const indexOfLastAdmin = currentPage * adminsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
  const currentAdmins = admins.slice(indexOfFirstAdmin, indexOfLastAdmin);

  const totalPages = Math.ceil(admins.length / adminsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div
      className={`flex min-h-screen ${
        theme === "light" ? "bg-gray-100" : "bg-gray-900 text-white"
      }`}
    >
      <aside
        className={`w-1/5 p-5 ${
          theme === "light" ? "bg-gray-100" : "bg-gray-800"
        }`}
      >
        <div className="flex flex-col items-center">
          <img
            className="rounded-full w-24 h-24 mb-4"
            src="https://th.bing.com/th/id/OIP.Pt9cVnyYk94e4mV_jSAGfQAAAA?w=370&h=344&rs=1&pid=ImgDetMain"
            alt="Super Admin"
          />
          <h2 className="text-2xl font-bold">
            {superAdmin.map((sa) => sa.username)}
          </h2>
          <p className="text-yellow-500 font-bold text-xl">Super Admin</p>
        </div>
        <nav className="mt-10">
          <ul>
            <li className="mb-6 ml-6">
              <Link
                to={"#"}
                className={`flex items-center px-4 py-2 rounded-md transition ease-in-out duration-300 ${
                  theme === "light"
                    ? "text-gray-700 hover:bg-yellow-500 hover:text-white"
                    : "text-white hover:bg-yellow-500 hover:text-gray-900"
                }`}
              >
                <FaHome size={20} className="mr-3" />
                <span>Home</span>
              </Link>
            </li>
            <li className="mb-6 ml-6">
              <a
                href="#admins"
                className={`flex items-center px-4 py-2 rounded-md transition ease-in-out duration-300 ${
                  theme === "light"
                    ? "text-gray-700 hover:bg-yellow-500 hover:text-white"
                    : "text-white hover:bg-yellow-500 hover:text-gray-900"
                }`}
              >
                <MdAdminPanelSettings size={20} className="mr-3" />
                <span>Admins</span>
              </a>
            </li>
            <li className="mb-6 ml-6">
              <a
                href="#employees"
                className={`flex items-center px-4 py-2 rounded-md transition ease-in-out duration-300 ${
                  theme === "light"
                    ? "text-gray-700 hover:bg-yellow-500 hover:text-white"
                    : "text-white hover:bg-yellow-500 hover:text-gray-900"
                }`}
              >
                <FaUsers size={20} className="mr-3" />
                <span>Employees</span>
              </a>
            </li>
            <li className="mb-6 ml-6">
              <a
                href="#settings"
                className={`flex items-center px-4 py-2 rounded-md transition ease-in-out duration-300 ${
                  theme === "light"
                    ? "text-gray-700 hover:bg-yellow-500 hover:text-white"
                    : "text-white hover:bg-yellow-500 hover:text-gray-900"
                }`}
              >
                <IoSettings size={20} className="mr-3" />
                <span>Settings</span>
              </a>
            </li>
            <li className="mb-6 ml-6">
              <button
                onClick={logout}
                className={`flex items-center px-4 py-2 rounded-md transition ease-in-out duration-300 ${
                  theme === "light"
                    ? "text-gray-700 hover:bg-red-500 hover:text-white"
                    : "text-white hover:bg-red-500 hover:text-gray-900"
                }`}
              >
                <RiLogoutCircleLine size={20} className="mr-3" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-3xl font-bold">Welcome to Super Admin Portal</h1>
          <button
            onClick={toggleTheme}
            className={`flex text-xl items-center text-${
              theme === "light" ? "black" : "white"
            }`}
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div
            className={`p-6 rounded-lg shadow-lg ${
              theme === "light" ? "bg-white" : "bg-gray-800 text-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Employees</p>
                <h2 className="text-3xl font-bold">{employee.length}</h2>
              </div>
              <div className="bg-green-600 p-2 rounded-full text-white">
                <FaUserSecret size={30} />
              </div>
            </div>
          </div>
          <div
            className={`p-6 rounded-lg shadow-lg ${
              theme === "light" ? "bg-white" : "bg-gray-800 text-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Admins</p>
                <h2 className="text-3xl font-bold">{admins.length}</h2>
              </div>
              <div className="bg-gray-600 p-2 rounded-full text-white">
                <MdAdminPanelSettings size={30} />
              </div>
            </div>
          </div>
          <div
            className={`p-6 rounded-lg shadow-lg ${
              theme === "light" ? "bg-white" : "bg-gray-800 text-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Total Users</p>
                <h2 className="text-3xl font-bold">
                  {admins.length + employee.length + 1}
                </h2>
              </div>
              <div className="bg-yellow-600 p-2 rounded-full text-white">
                <FaUsers size={30} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-semibold">Admin List</h3>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded transition ease-in-out duration-300 hover:bg-yellow-600"
            onClick={() => openModal()}
          >
            ADD NEW ADMIN
          </button>
        </div>
        <div
          className={`p-8 rounded-lg shadow-lg ${
            theme === "light" ? "bg-white" : "bg-gray-800 text-white"
          }`}
        >
          <table className="w-full table-auto">
            <thead>
              <tr
                className={`${
                  theme === "light" ? "bg-gray-200" : "bg-gray-600"
                }`}
              >
                <th className="px-4 py-2">Sr. #</th>
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Date of Creation</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentAdmins.map((admin, index) => (
                <tr
                  key={admin._id}
                  className={`${
                    theme === "light"
                      ? "bg-white border-b border-gray-200"
                      : "bg-gray-700 border-b border-gray-600"
                  }`}
                >
                  <td className="px-4 py-2">
                    {indexOfFirstAdmin + index + 1}.
                  </td>
                  <td className="px-4 py-2">{admin.username}</td>
                  <td className="px-4 py-2">{admin.email}</td>
                  <td className="px-4 py-2">
                    {new Date(admin.createdAt).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="text-yellow-500 mr-2 transition ease-in-out duration-300 hover:text-yellow-600"
                      onClick={() => openModal(admin)}
                    >
                      <FaPencilAlt size={23} />
                    </button>
                    <button
                      className="text-red-500 ml-3 transition ease-in-out duration-300 hover:text-red-600"
                      onClick={() => deleteAdmin(admin._id)}
                    >
                      <MdAutoDelete size={23} />
                    </button>
                    {deletedAdminId === admin._id && (
                      <MdCheckCircle
                        size={23}
                        className="ml-2 text-green-500"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-4">
          <nav>
            <ul className="flex list-none">
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index} className="mx-1">
                  <button
                    onClick={() => paginate(index + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === index + 1
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Create Admin"
          className="Modal"
          overlayClassName="Overlay"
        >
          <h2 className="text-2xl font-bold mb-4">
            {editAdminId ? "Edit Admin" : "Create Admin"}
          </h2>
          {message && <p className="text-red-500 mb-4">{message}</p>}
          <form
            onSubmit={editAdminId ? updateAdmin : createAdmin}
            className="space-y-4"
          >
            <div>
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full p-2 border rounded ${
                  theme === "light" ? "border-gray-300" : "border-gray-600"
                }`}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-2 border rounded ${
                  theme === "light" ? "border-gray-300" : "border-gray-600"
                }`}
              />
            </div>
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-2 border rounded ${
                  theme === "light" ? "border-gray-300" : "border-gray-600"
                }`}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-gray-700 text-white p-2 rounded transition ease-in-out duration-300 hover:bg-gray-800 ml-28"
            >
              {editAdminId ? "Update Admin" : "Create Admin"}
            </button>
          </form>
        </Modal>

        <Modal
          isOpen={deleteModalIsOpen}
          onRequestClose={closeDeleteModal}
          contentLabel="Admin Deleted"
          className="Modal"
          overlayClassName="Overlay"
        >
          <h2 className="text-2xl font-bold mb-4">Admin Deleted</h2>
          <p className="text-green-500 mb-4">Admin deleted successfully</p>
          <button
            onClick={closeDeleteModal}
            className="bg-gray-700 text-white p-2 rounded transition ease-in-out duration-300 hover:bg-gray-800"
          >
            Close
          </button>
        </Modal>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
