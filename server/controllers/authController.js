import { compare, hash } from "bcrypt";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { ErrorHandler, TryCatch } from "../utils/utility.js";
import { blyUser } from "../models/registerSchema.js";
import { OTP } from "../models/otpSchema.js";
import { Contact } from "../models/contactSchema.js";

import { sendToken } from "../utils/db.js";

const register = TryCatch(async (req, res, next) => {
  const { name, email, phone, password } = req.body;

  // Validate required fields
  if (!name || !email || !phone || !password) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  // Check if email already exists
  const emailExists = await blyUser.findOne({ email });
  if (emailExists) {
    return next(new ErrorHandler("Email already exists", 400));
  }

  // Store password as plaintext (not recommended — ideally you'd hash this)
  const user = new blyUser({
    name,
    email,
    phone,
    password,
  });

  await user.save();

  // res.status(200).json({ check: "200", message: "Registration successful." });
  sendToken(res, user, 201, "Account created successfully!");
});

const login = TryCatch(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await blyUser.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const isMatch = await compare(password, user.password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }
  // res.status(200).send({
  //   check: "200",
  //   message: "Login successful.",
  //   gender: user.gender,
  //   email: user.email,
  //   name: user.name,
  //   phone: user.phone,
  // });
  sendToken(res, user, 200, `Welcome back ${user.name}`);
});

const send_otp = TryCatch(async (req, res, next) => {
  const { email, newPassword } = req.body;

  // Check if user exists
  const user = await blyUser.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Check if an OTP already exists for this email
  const existingOtp = await OTP.findOne({ email });

  if (existingOtp) {
    // Calculate time remaining
    const timeElapsed = Date.now() - existingOtp.createdAt.getTime();
    const timeRemaining = Math.max(0, 300000 - timeElapsed); // in ms

    if (timeRemaining > 0) {
      return res.status(429).json({
        success: false,
        message: `OTP already sent. Please try again after ${Math.ceil(
          timeRemaining / 1000
        )} seconds.`,
      });
    }
  }

  // Generate 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP in database
  await OTP.create({
    email,
    otp: otpCode,
    verified: false,
  });

  // Setup Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "iterve.mail@gmail.com",
      pass: "bkpx efvm ojef wepk",
    },
  });

  // Send the OTP email
  await transporter.sendMail({
    from: "iterve.mail@gmail.com",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otpCode}. Your new password will be: ${newPassword}`,
  });

  res.status(200).json({
    success: true,
    message: "OTP sent successfully!",
  });
});

const verify_otp = TryCatch(async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  // Check OTP validity
  const otpEntry = await OTP.findOne({ email, otp });
  if (!otpEntry) {
    return next(new ErrorHandler("Invalid OTP", 400));
  }

  // Update verified flag
  otpEntry.verified = true;
  await otpEntry.save();
  const hashedPassword = await hash(newPassword, 10);

  // Update user password
  await blyUser.findOneAndUpdate(
    { email: email },
    { password: hashedPassword }
  );

  await OTP.deleteOne({ _id: otpEntry._id });

  res.status(200).send("Password updated successfully!");
});

const verifyUser = TryCatch(async (req, res, next) => {
  console.log(req);
  const user = await blyUser.findById(req.userId);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

const logout = TryCatch(async (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  };
  return res
    .status(200)
    .cookie("token", "", { ...cookieOptions, maxAge: 0 })
    .json({ success: true, message: "Logged out successfully" });
});



const contactDetails = TryCatch(async (req, res, next) => {
  const { name, email, phone, message } = req.body;

  // Validate required fields
  if (!name || !email || !phone || !message) {
    return next(new ErrorHandler("Please fill all the required fields properly", 422));
  }

  // Create new contact
  const newContact = new Contact({
    name,
    email,
    phone,
    message,
  });

  await newContact.save();

  res.status(201).json({
    success: true,
    message: "Contact data saved successfully",
    data: newContact,
  });
});
  
export {register, login,send_otp,verify_otp,verifyUser,logout,contactDetails};


