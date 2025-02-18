import type { NextFunction, Request, Response } from "express";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ApiResponse, ApiError } from "./utils";
import { HTTP_STATUS } from "./constants";
import { v1 } from "./routes";
import morgan from 'morgan';

const app = express();
const logger = morgan('tiny');

app.use(
  cors({
    allowedHeaders: ["*"],
    origin: "*",
  })
);

// Setup Pino-HTTP middleware for automatic request logging
app.use(express.json({ limit: "20kb" }));
app.use(logger);
app.use(
  express.urlencoded({
    extended: true,
    limit: "20kb",
  })
);

app.use(express.static("static"));
app.use(cookieParser());
app.use("/api/v1/", v1);


app.get("/health", (req: Request, res: Response): void => {
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "Healthy", {
      greeting: "Hi there!, core-service is healthy",
    })
  );
});

app.get("/favicon.ico", (req: Request, res: Response): void => {
  res.status(HTTP_STATUS.NO_CONTENT).send();
});

app.use("*", (req: Request, res: Response): void => {
  console.log(req.path);
  res
    .status(HTTP_STATUS.NOT_FOUND)
    .json(new ApiError(HTTP_STATUS.NOT_FOUND, "Not Found"));
});

export { app };
