import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name:String,
    email: String,
    phone:String,
    message:String,
  });

const Contact = mongoose.model("contact", contactSchema );
export {Contact };