const path = require('path');
const dotenv = require('dotenv');

const envFile =
  process.env.NODE_ENV === 'test' ? '.env.test' : '.env.development';
dotenv.config({ path: path.resolve(__dirname, envFile) });

module.exports = {
  reactStrictMode: true,
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
  },
};
