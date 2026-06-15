import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const NODE_ENV = 'production' as string;

const config = {
  port: process.env.PORT || 5001,
  node_env: NODE_ENV as string,
  database_url: process.env.MONGO_URI as string,
  bcrypt_salt_rounds: '12' as string,
  isDev: NODE_ENV === 'development',
  isTest: NODE_ENV === 'test',
  isProd: NODE_ENV === 'production',
  jwt: {
    access_secret: 'abcdefghijklmnopqrstuvwxyz1234567890@' as string,
    access_expire_in: '1d' as string,
    refresh_secret: 'abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIKLMNOPQRSTUVWXYZ' as string,
    refresh_expire_in: '1y' as string,
  },
};

export default config;
