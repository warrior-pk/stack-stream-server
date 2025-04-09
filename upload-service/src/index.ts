import { app } from "./app.js";
import { logger } from "./utils"
const PORT = Bun.env.PORT || 9200;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
