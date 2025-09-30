import { NextFunction, Request, Response } from "express";
import { requestCasesMetadataCollection } from "../../app/db";
import requestCasesLimiterManager from "./request-cases-limiter.manager";

const REQUEST_LIMIT = 10;

const requestLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    debugger;
    const IP = req.ip;
    const baseURL = req.baseUrl;
    const originalUrl = req.originalUrl;
    const now = new Date();
    const tenSecondsAgo = new Date(now.getTime() - 10_000);
    debugger;
    if (!IP || !baseURL) {
      res.status(429).json({ message: "Critical data was not passed." });
      return;
    }
    debugger;
    const recentRequestsCount =
      await requestCasesMetadataCollection.countDocuments({
        IP,
        baseURL,
        date: { $gte: tenSecondsAgo },
      });

    debugger;

    if (recentRequestsCount >= REQUEST_LIMIT) {
      res.status(429).json({ message: "Too many requests. Please wait." });
      return;
    }

    console.log(
      `[RateLimit] ${IP} -> ${originalUrl} | ${recentRequestsCount} | "requests in last 10s`
    );

    await requestCasesLimiterManager.create({ IP, baseURL, date: now });

    next();
  } catch (error) {
    console.error("Rate limiter middleware error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export default requestLimiterMiddleware;
