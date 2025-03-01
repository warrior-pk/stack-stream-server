import { asyncHandler, ApiError, ApiResponse, logger } from "@/utils";
import { HTTP_STATUS } from "@/constants";
import type { Request, Response } from "express";
import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  ListPartsCommand,
  CompleteMultipartUploadCommand,
  GetObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = Bun.env.S3_REGION;
if (!region) {
  throw new Error("S3_REGION is not defined");
}

const accessKeyId = Bun.env.S3_ACCESS_KEY_ID;
if (!accessKeyId) {
  throw new Error("S3_ACCESS_KEY_ID is not defined");
}

const secretAccessKey = Bun.env.S3_SECRET_ACCESS_KEY;
if (!secretAccessKey) {
  throw new Error("S3_SECRET_ACCESS_KEY is not defined");
}

const client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// Multipart upload -------------------------------------------------------------------

export const initializeUpload = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info("Initializing upload...");
    const { filename, contentType, fileExtension } = req.body;

    const hasher = new Bun.CryptoHasher("md5");
    hasher.update(filename);
    const hashedFilename = hasher.digest("hex");
    const videokey = `${contentType}/${hashedFilename}/master.${fileExtension || ""}`;

    const input = {
      Bucket: Bun.env.S3_BUCKET_NAME,
      Key: videokey,
      ContentType: "video/mp4",
    };
    const command = new CreateMultipartUploadCommand(input);
    const data = await client.send(command);

    logger.info("Upload initialized ------------------", data);
    res.status(200).json(
      new ApiResponse(HTTP_STATUS.OK, "upload initialized", {
        uploadId: data.UploadId,
        videoKey: videokey,
      })
    );
  }
);

export const uploadChunk = asyncHandler(async (req: Request, res: Response) => {
  logger.info("Uploading chunk...");
  const { filename, chunkNumber, uploadId } = req.body;

  const chunk = req.file;
  if (!chunk) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "chunk is required");
  }

  const input = {
    Bucket: Bun.env.S3_BUCKET_NAME,
    Key: filename,
    UploadId: uploadId,
    PartNumber: chunkNumber,
    Body: chunk.buffer,
  };
  const command = new UploadPartCommand(input);
  const data = await client.send(command);

  logger.info("Chunk uploaded --------------------", data);
  res.status(200).json(new ApiResponse(HTTP_STATUS.OK, "chunk uploaded", {}));
});

export const completeUpload = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info("Completing upload...");
    const { filename, uploadId } = req.body;

    const input = {
      Bucket: Bun.env.S3_BUCKET_NAME,
      Key: filename,
      UploadId: uploadId,
    };
    const command = new ListPartsCommand(input);
    const data = await client.send(command);

    if (!data.Parts) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Parts is required");
    }

    const parts = data.Parts.map((part) => ({
      ETag: part.ETag,
      PartNumber: part.PartNumber,
    }));

    const completeInput = {
      Bucket: Bun.env.S3_BUCKET_NAME,
      Key: filename,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts,
      },
    };

    const completeCommand = new CompleteMultipartUploadCommand(completeInput);
    const completionData = await client.send(completeCommand);

    const getObjectInput = {
      "Bucket": Bun.env.S3_BUCKET_NAME,
      "Key": filename
    }
    const videoUrl = await getSignedUrl(client, new GetObjectCommand(getObjectInput), { expiresIn: 24 * 60 * 60 });
    logger.info("Upload completed ------------------", videoUrl);
    res
      .status(200)
      .json(
        new ApiResponse(HTTP_STATUS.OK, "upload completed", { videoUrl })
      );
  }
);


export const pushVideoForEncoding = asyncHandler(
  async () => {



  }
);
