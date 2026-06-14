import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const config = {
  port: process.env.PORT as string,
  node_env: process.env.NODE_ENV as string,
  database_url: process.env.MONGO_URI as string,
  bcrypt_salt_rounds: process.env.BCRYPT_COST as string,
  isDev: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
  isProd: process.env.NODE_ENV === 'production',
  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET as string,
    access_expire_in: process.env.JWT_ACCESS_EXPIRE_IN as string,
    refresh_secret: process.env.JWT_REFRESH_SECRET as string,
    refresh_expire_in: process.env.JWT_REFRESH_EXPIRE_IN as string,
  },
};

export default config;
