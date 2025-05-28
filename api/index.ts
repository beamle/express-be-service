

// Only run the server locally (not on Vercel)
import { runDb } from "../src/app/db";
import { SETTINGS } from "../src/app/settings";
import { app } from "../src/app/app";

if (process.env.NODE_ENV !== 'production') {
  const startApp = async () => {
    try {
      await runDb(SETTINGS.MONGO_URI);
      app.listen(SETTINGS.PORT, () => {
        console.log(`Server started on port ${SETTINGS.PORT}`);
      });
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