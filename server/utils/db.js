import mongoose, { get } from "mongoose";
import jwt from "jsonwebtoken";

const connectDB = (mongoURI) =>
    mongoose
      .connect(mongoURI, {
      })
      .then((data) => {
        console.log(`Connected to DB: ${data.connection.host}`);
      })
      .catch((error) => {
        console.log("Error:", error.message);
      });



const sendToken = (res, user, statusCode, message) => {
  console.log("JWT secret: ", process.env.JWT_SECRET);

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }  // token valid for 7 days
  );

  res.status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
  
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};

export { connectDB,sendToken};
