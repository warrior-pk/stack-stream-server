import { asyncHandler, ApiError, ApiResponse, logger } from "@/utils";
import { HTTP_STATUS } from "@/constants";
import type { Request, Response, NextFunction } from "express";
import { Webhook } from "svix";

export const verifyWebhook = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  const SIGNING_SECRET = Bun.env.WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env')
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)

  // Get headers and body
  const headers = req.headers
  const payload = req.body

  // Get Svix headers for verification
  const svix_id = headers['svix-id']
  const svix_timestamp = headers['svix-timestamp']
  const svix_signature = headers['svix-signature']

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return void res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, 'Error: Missing svix headers', {}))
  }

  let evt;

  try {
    evt = wh.verify(JSON.stringify(payload), {
      'svix-id': svix_id as string,
      'svix-timestamp': svix_timestamp as string,
      'svix-signature': svix_signature as string,
    })
  } catch (err) {
    logger.error('Error: Could not verify webhook:', err.message);
    return void res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, err.message, {}))
  }
  req.webhookEvent = evt;
  next()
})
