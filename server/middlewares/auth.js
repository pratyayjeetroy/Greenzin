import jwt from "jsonwebtoken";
import { ErrorHandler, TryCatch } from "../utils/utility.js";
import { blyUser } from "../models/registerSchema.js";

const isAuthenticated = async (req, res, next) => {
  try {
    console.log("/////////////////////////////////////////////////////////////////////////////////////Authentication called")
    const token = req.cookies.token;

    if (!req.cookies.token) {
      return next(new ErrorHandler("Please login to access this route", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    const user = await blyUser.findById(decodedData.id);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    req.userId = decodedData.id;

    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid token", 401));
  }
};

export { isAuthenticated };
