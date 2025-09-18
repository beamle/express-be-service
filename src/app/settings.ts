import dotenv from "dotenv";
dotenv.config(); // добавление переменных из файла .env в process.env

export const SETTINGS = {
  PORT: process.env.PORT || 3004,
  MONGO_URI: process.env.MONGO_URL || "",
  PATH: {
    BLOGS: "/blogs",
    POSTS: "/posts",
    USERS: "/users",
    AUTH: "/auth",
    COMMENTS: "/comments",
    EMAIL: "/email",
    SESSION: "/session",
    REFRESH_TOKEN_BLACKLIST: "/refresh-token-blacklist",
    REQUEST_CASES: "/request-cases-list",
    TESTING: "/testing",
  },
  DB_NAME: process.env.DB_NAME || "lesson-2-3",
  JWT_SECRET: process.env.JWT_SECRET || "!23",
  // require('crypto').randomBytes(64).toString('hex') // dynamic import is asyncrounoys, dynamic require is syncrounous
};
