const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const { readConfig } = require('./config/env');
async function startServer() {
  const config = readConfig();
  const app = require('./app');
  await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 5000, socketTimeoutMS: 45000 });
  return app.listen(config.port, () => console.log(`API listening on port ${config.port}`));
}
if (require.main === module) {
  startServer().catch(() => {
    console.error('API startup failed. Check database connectivity, MONGODB_URI and JWT_SECRET.');
    process.exitCode = 1;
  });
}
module.exports = { startServer };
