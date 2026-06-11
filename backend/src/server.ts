import { createServer } from 'http';
import app from './app.js';
import { ConnectDB } from './config/database.js';
import { ENV } from './config/env.js';
import logger from './config/logger.js';
import { initSocket } from './socket/socket.server.js';

const PORT = ENV.PORT;

ConnectDB();

const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
