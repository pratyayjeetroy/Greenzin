// ---------------------------------------------------------------------------
// Slug generator — converts a display name to a URL-safe slug
// ---------------------------------------------------------------------------
export function generateSlug(name = "") {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ---------------------------------------------------------------------------
// Error helper class
// ---------------------------------------------------------------------------
export class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// ---------------------------------------------------------------------------
// Unified error response helper for Next.js Route Handlers
// ---------------------------------------------------------------------------
export function handleApiError(error) {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  return Response.json({ success: false, message }, { status: statusCode });
}
