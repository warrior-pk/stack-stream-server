import { Router } from "express";
import uploadRoutes from "./upload.route";
import type { Request, Response } from "express";
import { ApiResponse } from "../../utils";
import { HTTP_STATUS } from "../../constants";

const router = Router();

router.use("/upload", uploadRoutes);

router.get("/health", (req: Request, res: Response): void => {
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "Healthy", {
      greeting: "Hi there!, upload-service api route is healthy",
    })
  );
});
export default router;
