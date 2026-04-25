import { connectDB } from "@/lib/db";
import { blyUser } from "@/lib/models/registerSchema";
import { ErrorHandler, handleApiError } from "@/lib/utility";
import { verifyToken } from "@/lib/auth";

export async function GET(request) {
  try {
    await connectDB();

    // Extract JWT from cookie header
    const cookieHeader = request.headers.get("cookie");
    const decoded = verifyToken(cookieHeader);

    if (!decoded) {
      throw new ErrorHandler("Please login to access this route", 401);
    }

    const user = await blyUser.findById(decoded.id);
    if (!user) {
      throw new ErrorHandler("User not found", 404);
    }

    return Response.json({ success: true, user }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
