import dotenv from 'dotenv'
dotenv.config() // добавление переменных из файла .env в process.env

export const SETTINGS = {
  PORT: process.env.PORT || 3004,
  MONGO_URI: process.env.MONGO_URL || "",
  PATH: {
    BLOGS: '/blogs',
    POSTS: '/posts',
    USERS: '/users',
    TESTING: '/testing',
  },
  DB_NAME: process.env.DB_NAME || "lesson-2-3"
}
