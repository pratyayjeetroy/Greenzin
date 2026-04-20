export async function GET() {
  // Clear the token cookie by setting Max-Age=0
  return Response.json(
    { success: true, message: "Logged out successfully" },
    {
      status: 200,
      headers: {
        "Set-Cookie":
          "token=; HttpOnly; SameSite=None; Secure; Max-Age=0; Path=/",
      },
    }
  );
}
