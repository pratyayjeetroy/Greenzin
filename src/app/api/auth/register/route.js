import { connectDB } from "@/lib/db";
import { blyUser } from "@/lib/models/registerSchema";
import { ErrorHandler, handleApiError } from "@/lib/utility";
import { createTokenResponse } from "@/lib/auth";

export async function POST(request) {
  try {
    await connectDB();

    const { name, email, phone, password } = await request.json();

    // Validate required fields
    if (!name || !email || !phone || !password) {
      throw new ErrorHandler("All fields are required", 400);
    }

    // Check for duplicate email
    const emailExists = await blyUser.findOne({ email });
    if (emailExists) {
      throw new ErrorHandler("Email already exists", 400);
    }

    // Password is hashed by the pre-save Mongoose hook in the model
    const user = new blyUser({ name, email, phone, password });
    await user.save();

    return createTokenResponse(user, 201, "Account created successfully!");
  } catch (error) {
    return handleApiError(error);
  }
}
