import { compare } from "bcrypt";
import { connectDB } from "@/lib/db";
import { blyUser } from "@/lib/models/registerSchema";
import { ErrorHandler, handleApiError } from "@/lib/utility";
import { createTokenResponse } from "@/lib/auth";

export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // Validate fields
    if (!email || !password) {
      throw new ErrorHandler("Email and password are required", 400);
    }

    // Find user and include the (normally hidden) password field
    const user = await blyUser.findOne({ email }).select("+password");
    if (!user) {
      throw new ErrorHandler("User not found", 404);
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      throw new ErrorHandler("Invalid credentials", 401);
    }

    return createTokenResponse(user, 200, `Welcome back ${user.name}`);
  } catch (error) {
    return handleApiError(error);
  }
}
