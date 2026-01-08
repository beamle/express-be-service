import { NextFunction, Request, Response } from 'express';
import { requestCasesMetadataCollection } from '../../app/db';
import requestCasesLimiterManager from './request-cases-limiter.manager';

const REQUEST_LIMIT = 5;

const requestLimiterMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const IP = req.ip || req.headers['x-forwarded-for'] || 'unknown-ip';
    const endpointUrl = req.originalUrl;
    const now = new Date();
    const tenSecondsAgo = new Date(now.getTime() - 10_000);

    await requestCasesLimiterManager.create({ IP, baseURL: endpointUrl, date: now });

    const recentRequestsCount = await requestCasesMetadataCollection.countDocuments({
      IP: IP,
      baseURL: endpointUrl,
      date: { $gte: tenSecondsAgo },
    });

    if (recentRequestsCount > 5) {
      res.sendStatus(429);
      return;
    }

    next();
  } catch (error) {
    res.status(500).send();
  }
};
export default requestLimiterMiddleware;
