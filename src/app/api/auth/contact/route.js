import { connectDB } from "@/lib/db";
import { Contact } from "@/lib/models/contactSchema";
import { ErrorHandler, handleApiError } from "@/lib/utility";

export async function POST(request) {
  try {
    await connectDB();

    const { name, email, phone, message } = await request.json();

    if (!name || !email || !phone || !message) {
      throw new ErrorHandler(
        "Please fill all the required fields properly",
        422
      );
    }

    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();

    return Response.json(
      {
        success: true,
        message: "Contact data saved successfully",
        data: newContact,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
