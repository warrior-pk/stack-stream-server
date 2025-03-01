import type { Request, Response } from "express";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { ApiResponse, ApiError } from "@/utils";
import { HTTP_STATUS } from "@/constants";
import { v1 } from "@/routes";
import { logger } from "@/utils";
import morgan from "morgan";

const morganFormat = ":method :url :status :response-time ms";

const app = express();

app.use(
  cors({
    allowedHeaders: ["*"],
    origin: "*",
  })
);

app.use(express.static("static"));

app.use(
  express.urlencoded({
    extended: true,
    limit: "20kb",
  })
);
app.use(express.json({ limit: "20kb" }));

app.use(cookieParser());

app.use(clerkMiddleware());

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.http(JSON.stringify(logObject));
      },
    },
  })
);

app.use("/api/v1/", v1);

app.get("/health", (req: Request, res: Response): void => {
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "Healthy", {
      greeting: "Hi there!, upload-service is healthy",
    })
  );
});

app.get("/favicon.ico", (req: Request, res: Response): void => {
  res.sendFile("favicon.ico", { root: "static" });
});

app.use("*", (req: Request, res: Response): void => {
  res
    .status(HTTP_STATUS.NOT_FOUND)
    .json(new ApiError(HTTP_STATUS.NOT_FOUND, "Not Found"));
});

export { app };
