import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  messages: [{ type: String }],
});

employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
