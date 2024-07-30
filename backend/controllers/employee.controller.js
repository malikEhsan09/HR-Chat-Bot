import Employee from "../models/employee.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//? add MEssage
export const addMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const employeeId = req.employee.id;
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    employee.messages.push(message);
    await employee.save();
    res.status(201).json({ message: "Message added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ? loginEmployee
export const loginEmployee = async (req, res) => {
  try {
    const { password, email } = req.body;
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ msg: "Employee login successfully", employee, token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
