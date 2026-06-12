import dotenv from "dotenv";
import path from "path";
dotenv.config({path: path.join(process.cwd(), '.env')});

export const env = {

    port: process.env.PORT,
    node_env: process.env.NODE_ENV,
    ip: process.env.IP,
    database_url: process.env.MONGO_URI,
    bcrypt_salt_rounds: process.env.BCRYPT_COST,
    isDev : process.env.NODE_ENV === 'development',
    isTest : process.env.NODE_ENV === 'test',
    isProd : process.env.NODE_ENV === 'production',
    
    jwt: {
        access_secret: process.env.JWT_ACCESS_SECRET,
        access_expire_in: process.env.JWT_ACCESS_EXPIRE_IN,
        refresh_secret: process.env.JWT_REFRESH_SECRET,
        refresh_expire_in: process.env.JWT_REFRESH_EXPIRE_IN
    },
    email:{
        from: process.env.EMAIL_FROM,
        user: process.env.EMAIL_USER,
        port: process.env.EMAIL_PORT,
        host: process.env.EMAIL_HOST,
        pass: process.env.EMAIL_PASS
    },
    admin: {
        email:process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD
    },
    redis:{
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    },
}

