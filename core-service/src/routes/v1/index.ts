import { Router } from "express";
import webhooksRouter from "./webhooks.route";
import type { Request, Response } from "express";
import { ApiResponse } from "@/utils";
import { HTTP_STATUS } from "@/constants";
import { verifyWebhook } from "@/middlewares";

const router = Router();
router.use("/webhooks", verifyWebhook, webhooksRouter);

router.get("/health", (req: Request, res: Response): void => {
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "Healthy", {
      greeting: "Hi there!, core-service api/v1 route is healthy",
    })
  );
});

export default router;
