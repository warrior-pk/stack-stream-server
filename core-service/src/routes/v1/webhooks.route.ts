import { Router } from "express";
import { ApiResponse } from "@/utils";
import { HTTP_STATUS } from "@/constants";
import type { Request, Response } from "express";
import { webhooks } from "@/controllers/v1";

const router = Router();

router.post("/user", webhooks.userWebhooks);

router.get("/health", (req: Request, res: Response) => {
  res.status(200).json(new ApiResponse(HTTP_STATUS.OK, "Healthy", {
    greeting: "Hi there!, auth api route is healthy",
  }));
});

export default router;
