class ApiError extends Error {
  constructor(
    statusCode,
    message = "An error occurred",
    error = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    (this.data = null), (this.message = message);
    this.error = error;
    this.success = false;
  }
}

export { ApiError };
