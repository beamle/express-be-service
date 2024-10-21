import {config} from 'dotenv'
config() // добавление переменных из файла .env в process.env

export const SETTINGS = {
  // все хардкодные значения должны быть здесь, для удобства их изменения
  PORT: 3003,
  PATH: {
    BLOGS: '/blogs',
    POSTS: '/posts',
    TESTING: '/testing',
  },
}