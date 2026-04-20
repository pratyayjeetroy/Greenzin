import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // expires in 300 seconds (5 minutes)
});

const OTP = mongoose.models.OTP || mongoose.model("OTP", otpSchema);

export { OTP };
