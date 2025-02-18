class ApiError extends Error {
  statusCode: number;
  message: string;
  errors: string[];
  data: unknown | null;
  success: boolean;

  constructor(
    statusCode: number,
    message = "Something Went Wrong",
    errors: string[] = [],
    stack?: string
  ) {
    // Calling the parent Error constructor
    super(message);

    // Set custom properties
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.data = null; // This is optional, could be any data related to the error.
    this.success = false; // Always false for errors

    // If a stack trace is provided, use it; otherwise, capture it.
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
