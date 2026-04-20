import { hash } from "bcrypt";
import { connectDB } from "@/lib/db";
import { blyUser } from "@/lib/models/registerSchema";
import { OTP } from "@/lib/models/otpSchema";
import { ErrorHandler, handleApiError } from "@/lib/utility";

export async function POST(request) {
  try {
    await connectDB();

    const { email, otp, newPassword } = await request.json();

    // Validate OTP
    const otpEntry = await OTP.findOne({ email, otp });
    if (!otpEntry) {
      throw new ErrorHandler("Invalid OTP", 400);
    }

    // Mark as verified
    otpEntry.verified = true;
    await otpEntry.save();

    // Hash and update password
    const hashedPassword = await hash(newPassword, 10);
    await blyUser.findOneAndUpdate({ email }, { password: hashedPassword });

    // Clean up OTP
    await OTP.deleteOne({ _id: otpEntry._id });

    return Response.json(
      { success: true, message: "Password updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
