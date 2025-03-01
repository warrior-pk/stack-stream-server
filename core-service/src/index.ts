import { app } from "@/app.js";
import { logger } from "@/utils"
import { connectToDatabase } from "@/configs/mongo.js";
const PORT = Bun.env.PORT || 9100;

(async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
})();

