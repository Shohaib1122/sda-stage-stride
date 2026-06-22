import { env } from './src/config/env.js';
import { connectDB } from './src/config/db.js';
import app from './src/app.js';

async function startServer() {
  try {
    await connectDB();
    
    app.listen(env.PORT, () => {
      console.log(`Server is running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
