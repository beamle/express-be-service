import {SETTINGS} from './settings'
import { runDb } from "./db";
import { app } from "./app";

// Only run the server locally (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  const startApp = async () => {
    try {
      await runDb(SETTINGS.MONGO_URI);
      app.listen(SETTINGS.PORT, () => {
        console.log(`Server started on port ${SETTINGS.PORT}`);
      });
      app.set('trust proxy', true)
    } catch (e) {
      console.log("Something went wrong, shutting down the backend app service", e);
      process.exit(1);
    }
  };

  startApp();
}

// Vercel serverless handler
export default (req: any, res: any) => {
  app(req, res); // Use your Express app to handle the request in the serverless environment
};