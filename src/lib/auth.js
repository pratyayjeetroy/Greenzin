import jwt from "jsonwebtoken";

// ---------------------------------------------------------------------------
// Signs a JWT and sets it as an httpOnly cookie in the response headers
// ---------------------------------------------------------------------------
export function createTokenResponse(user, statusCode, message) {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const cookieValue = `token=${token}; HttpOnly; SameSite=None; Secure; Max-Age=${7 * 24 * 60 * 60}; Path=/`;

  return Response.json(
    { success: true, message, user, token },
    {
      status: statusCode,
      headers: {
        "Set-Cookie": cookieValue,
      },
    }
  );
}

// ---------------------------------------------------------------------------
// Verifies the JWT from cookies and returns the decoded payload
// ---------------------------------------------------------------------------
export function verifyToken(cookieHeader) {
  if (!cookieHeader) return null;

  // Parse raw cookie header
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [key, ...v] = c.trim().split("=");
      return [key, v.join("=")];
    })
  );

  const token = cookies.token;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}
