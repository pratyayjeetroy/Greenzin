import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userRegisterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true,  select: false  },
});

// pre-save hook to hash password
userRegisterSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const blyUser = mongoose.model("blyUser", userRegisterSchema);
export {blyUser};