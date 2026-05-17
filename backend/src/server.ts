import app from './app.js';
import { ConnectDB } from './config/database.js';
import { ENV } from './config/env.js';
import logger from './config/logger.js';

const PORT = ENV.PORT;

ConnectDB();
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
