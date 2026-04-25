import nodemailer from "nodemailer";
import { connectDB } from "@/lib/db";
import { blyUser } from "@/lib/models/registerSchema";
import { OTP } from "@/lib/models/otpSchema";
import { ErrorHandler, handleApiError } from "@/lib/utility";

export async function POST(request) {
  try {
    await connectDB();

    const { email, newPassword } = await request.json();

    // Check if user exists
    const user = await blyUser.findOne({ email });
    if (!user) {
      throw new ErrorHandler("User not found", 404);
    }

    // Rate-limit: check if a valid OTP already exists
    const existingOtp = await OTP.findOne({ email });
    if (existingOtp) {
      const timeElapsed = Date.now() - existingOtp.createdAt.getTime();
      const timeRemaining = Math.max(0, 300_000 - timeElapsed);

      if (timeRemaining > 0) {
        return Response.json(
          {
            success: false,
            message: `OTP already sent. Please try again after ${Math.ceil(timeRemaining / 1000)} seconds.`,
          },
          { status: 429 }
        );
      }
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100_000 + Math.random() * 900_000).toString();

    await OTP.create({ email, otp: otpCode, verified: false });

    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otpCode}. Your new password will be: ${newPassword}`,
    });

    return Response.json(
      { success: true, message: "OTP sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
