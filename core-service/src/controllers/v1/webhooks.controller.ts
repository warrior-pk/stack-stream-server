import { HTTP_STATUS } from "@/constants";
import { asyncHandler, ApiError, ApiResponse, logger } from "@/utils";
import { addUserToDatabase } from "@/services/user.service";

export const userWebhooks = asyncHandler(async (req: Request, res: Response) => {
  const evt = req?.webhookEvent;

  if (!evt) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, "Error: Webhook payload not found", {}));
  }

  const eventType = evt.type
  const clerkUser = evt.data;
  logger.info(`Received webhook event type of ${eventType}`)
  // FIXME: fix the clerkUser object to match the expected shape
  const userData = {
    clerkId: clerkUser.id,
    username: clerkUser.username || null,
    email: clerkUser.email_addresses[0].email_address,
    fullName: `${clerkUser.first_name} ${clerkUser.last_name}`,
    avatar: clerkUser.image_url,
    coverImage: "",
    watchHistory: [],
    profileCompleted: false
  };

  if (eventType === "user.created") {
    const createdUser = await addUserToDatabase(userData);
    if (!createdUser) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new ApiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Error: Could not create user", {}));
    }
  }

  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, `Webhook received ${eventType} `, {}))
})  
