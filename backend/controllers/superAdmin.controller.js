import SuperAdmin from "../models/superAdmin.model.js";
import Admin from "../models/admin.model.js";
import ChartData from "../models/chartData.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ? Create super admin controller
export const createSuperAdmin = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const superAdmin = new SuperAdmin({ username, password, email });
    await superAdmin.save();
    res.status(201).json({ message: "SuperAdmin created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ? Login controller for super admin
export const loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const superAdmin = await SuperAdmin.findOne({ email });
    if (!superAdmin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, superAdmin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: superAdmin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ msg: "Login successfully", superAdmin, token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ? Create admin controller
export const createAdmin = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const createdBy = req.superAdmin.id;
    const admin = new Admin({ username, password, createdBy, email });
    await admin.save();
    res.status(201).json({ message: "Admin created successfully", admin });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//? get all admin
export const getAllAdmin = async (req, res) => {
  try {
    const admins = await Admin.find();
    if (!admins) {
      return res.status(400).json({ message: "No admin found" });
    }

    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ? get super admin deatils
export const getSuperAdminDetails = async (req, res) => {
  try {
    // const superAdminId = req.superAdminId;
    // find all the super admin
    const superAdmin = await SuperAdmin.find();
    if (!superAdmin) {
      return res.status(404).json({ message: "Super admin not found" });
    }
    res.status(200).json(superAdmin);
  } catch (error) {
    console.error("Error fetching super admin details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getChartData = async (req, res) => {
  try {
    const chartData = await ChartData.find().sort({ date: 1 }); // Sort by date
    const labels = chartData.map(
      (data) => data.date.toISOString().split("T")[0]
    ); // Format date to YYYY-MM-DD
    const data = chartData.map((data) => data.value);
    res.status(200).json({ labels, data });
  } catch (error) {
    console.error("Error fetching chart data:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//? Update admin controller
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    admin.username = username;
    admin.email = email;
    if (password) {
      admin.password = await bcrypt.hash(password, 10);
    }
    await admin.save();
    res.status(200).json({ message: "Admin updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete admin controller
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
