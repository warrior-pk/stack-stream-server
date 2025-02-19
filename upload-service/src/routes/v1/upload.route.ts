import { Router } from "express";
import { ApiResponse, logger } from "../../utils";
import { HTTP_STATUS } from "../../constants";
import multer from "multer";
import { uploadToS3 } from "../../controllers/v1";
const router = Router();
const uploadVideo = multer();

const uploadMulter = {
  none: uploadVideo.none(),
  singleChunk: uploadVideo.single("chunk")
};

// Initialize the multipart upload
router.post("/v/initialize", uploadMulter.none, uploadToS3.initializeUpload);

// Upload a file chunk
router.post("/v/chunk", uploadMulter.singleChunk, uploadToS3.uploadChunk);

// Complete the multipart upload
router.post("/v/complete", uploadMulter.none, uploadToS3.completeUpload);


// Health check
router.get("/health", (req, res) => {
  logger.debug("Debug data", {
    obj: { foo: "bar" },
    arr: [1, 2, 3],
    buffer: Buffer.from("test"),
  }); res.status(200).json(new ApiResponse(HTTP_STATUS.OK, "Healthy", {
    greeting: "Hi there!, upload api route is healthy",
  }));
});

export default router;
