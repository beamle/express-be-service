import requestCasesLimiterManager from "./request-cases-limiter.manager";
import { requestCasesMetadataCollection } from "../../app/db";
import { NextFunction, Response, Request } from "express";


const REQUEST_LIMIT = 5;

const requestLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const IP = req.ip;
    const endpointUrl = req.originalUrl;
    const now = new Date();
    const tenSecondsAgo = new Date(now.getTime() - 10_000);

    if (!IP || !endpointUrl) {
      res.status(401).json({ message: "Critical data was not passed." });
      return;
    }

    const recentRequestsCount =
      await requestCasesMetadataCollection.countDocuments({
        IP,
        baseURL: endpointUrl,
        date: { $gte: tenSecondsAgo },
      });

    if (recentRequestsCount >= REQUEST_LIMIT) {
      res.status(429).json({ message: "Too many requests. Please wait." });
      return;
    }

    console.log(
      `[RateLimit] ${IP} -> ${endpointUrl} | ${recentRequestsCount} | requests in last 10s`
    );

    await requestCasesLimiterManager.create({ IP, baseURL: endpointUrl, date: now });

    next();
  } catch (error) {
    console.error("Rate limiter middleware error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export default requestLimiterMiddleware;