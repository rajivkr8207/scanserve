import mongoose from 'mongoose';
import { ENV } from './env.js';
import logger from './logger.js';

export const ConnectDB = () => {
  mongoose
    .connect(ENV.MONGODB_URI)
    .then(() => {
      logger.info(`Mongo DB connected Successfully`);
    })
    .catch((err) => {
      logger.error('Mongo db connection failed', err);
      process.exit(1);
    });
};
