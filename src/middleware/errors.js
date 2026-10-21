export class AppError extends Error {
  constructor(status, message, code = "REQUEST_ERROR") {
    super(message);
    this.status = status;
    this.code = code;
  }
}
export function notFound(req, res) {
  res
    .status(404)
    .json({ error: { code: "NOT_FOUND", message: "Route not found" } });
}
export function errorHandler(error, req, res, next) {
  void next;
  const isJsonError =
    error instanceof SyntaxError && error.status === 400 && "body" in error;
  const status = isJsonError ? 400 : error.status || 500;
  if (status >= 500) console.error(error);
  res
    .status(status)
    .json({
      error: {
        code: isJsonError ? "INVALID_JSON" : error.code || "INTERNAL_ERROR",
        message: isJsonError
          ? "Malformed JSON body"
          : status >= 500
            ? "Internal server error"
            : error.message,
      },
    });
}
