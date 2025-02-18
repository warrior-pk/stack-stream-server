import { Router } from "express";
import { ApiResponse } from "../../utils";
import { HTTP_STATUS } from "../../constants";
const router = Router();

router.get("/", (req, res) => {
  res.status(200).json(new ApiResponse(HTTP_STATUS.OK, "Welcome to upload api", {}));
});

router.get("/health", (req, res) => {
  res.status(200).json(new ApiResponse(HTTP_STATUS.OK, "Healthy", {
    greeting: "Hi there!, upload api route is healthy",
  }));
});

export default router;
