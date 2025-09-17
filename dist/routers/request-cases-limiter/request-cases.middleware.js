"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../app/db");
const request_cases_limiter_manager_1 = __importDefault(require("./request-cases-limiter.manager"));
const REQUEST_LIMIT = 10;
const requestLimiterMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const IP = req.ip;
        const baseURL = req.baseUrl;
        const originalUrl = req.originalUrl;
        const now = new Date();
        const tenSecondsAgo = new Date(now.getTime() - 10000);
        debugger;
        if (!IP || !baseURL) {
            res.status(429).json({ message: "Critical data was not passed." });
            return;
        }
        const recentRequestsCount = yield db_1.requestCasesMetadataCollection.countDocuments({
            IP,
            baseURL,
            date: { $gte: tenSecondsAgo },
        });
        debugger;
        if (recentRequestsCount >= REQUEST_LIMIT) {
            res.status(429).json({ message: "Too many requests. Please wait." });
            return;
        }
        console.log(`[RateLimit] ${IP} -> ${originalUrl} | ${recentRequestsCount} | "requests in last 10s`);
        yield request_cases_limiter_manager_1.default.create({ IP, baseURL, date: now });
        next();
    }
    catch (error) {
        console.error("Rate limiter middleware error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.default = requestLimiterMiddleware;
