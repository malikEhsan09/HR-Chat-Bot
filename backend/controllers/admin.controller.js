import Admin from "../models/admin.model.js";
import Employee from "../models/employee.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginAdmin = async (req, res) => {
  try {
    const { password, email } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ msg: "Admin login successfully", admin, token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { name, username, password, email } = req.body;
    const createdBy = req.admin.id;
    const employee = new Employee({
      name,
      username,
      password,
      createdBy,
      email,
    });
    await employee.save();
    res.status(201).json({ message: "Employee created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ? get all employees
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    if (!employees) {
      return res.status(400).json({ message: "No Employee found" });
    }

    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ? find admin by id
export const findAdminById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const admin = await Admin.findById(id);
    // check admin exits or not
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.status(200).json({ msg: "Admin found", admin });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ msg: "Admin not found" });
  }
};
