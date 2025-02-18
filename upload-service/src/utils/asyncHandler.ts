import type { Request, Response, NextFunction } from "express";
interface ApiError extends Error {
  code?: number;
}

const asyncHandler =
  (
    requestHandler: (
      req: Request,
      res: Response,
      next: NextFunction
    ) => Promise<void>
  ) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        await requestHandler(req, res, next);
      } catch (error) {
        const err = error as ApiError; // Type assertion to access code
        const statusCode = err.code || 500;

        // If in development, also include stack trace
        const response = {
          success: false,
          message: err.message || "Something went wrong",
          ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
        };

        res.status(statusCode).json(response);
      }
    };

export { asyncHandler };
