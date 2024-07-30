import SuperAdmin from "../models/superAdmin.model.js";
import Admin from "../models/admin.model.js";
import Employee from "../models/employee.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginn = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  let user =
    (await SuperAdmin.findOne({ email: email })) ||
    (await Admin.findOne({ email: email })) ||
    (await Employee.findOne({ email: email }));

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const role =
    user instanceof SuperAdmin
      ? "superAdmin"
      : user instanceof Admin
      ? "admin"
      : "employee";

  const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ msg: "User logged in successfully", role, token });
};
