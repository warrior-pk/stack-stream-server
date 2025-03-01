import { Router } from "express";
import uploadRouter from "./upload.route";
import type { Request, Response } from "express";
import { ApiResponse } from "@/utils";
import { HTTP_STATUS } from "@/constants";

const router = Router();

router.use("/upload", uploadRouter);

router.get("/health", (req: Request, res: Response): void => {
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "Healthy", {
      greeting: "Hi there!, upload-service api/v1 route is healthy",
    })
  );
});

export default router;
