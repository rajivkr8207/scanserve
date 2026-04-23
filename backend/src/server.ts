import app from './app.js';
import { ConnectDB } from './config/database.js';
import { ENV } from './config/env.js';

const PORT = ENV.PORT;

ConnectDB();
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
