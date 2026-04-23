import mongoose from 'mongoose';
import { ENV } from './env.js';

export const ConnectDB = () => {
  mongoose
    .connect(ENV.MONGODB_URI)
    .then(() => {
      console.log(`Mongo DB connected Successfully`);
    })
    .catch((err) => {
      console.log('Mongo db error', err);
      process.exit(1);
    });
};
