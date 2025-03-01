import { asyncHandler, logger } from "@/utils";
import { User } from "@/models";

export const addUserToDatabase = async (data) => {
  try {
    logger.info(`Adding user to database: ${data.fullName}`);
    const user = await User.create(data);
    logger.info(`User added to database: ${user.fullName}`);
    return user;
  } catch (error) {
    logger.error(`Error adding user to database: ${error.message}`);
    return null;
  }
};
