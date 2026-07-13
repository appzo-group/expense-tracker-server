
import mongoose from 'mongoose';

import config from '../../config';
import { errorLogger, logger } from '../../shared/logger';

export async function dbconnect(): Promise<string> {

    try {
        // mongoose.set('strictQuery', true);
        await mongoose.connect(config.database_url);
        logger.info('Database connected successfully');
        console.log('Database connected successfully');
        
        return 'Database connected successfully';
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        logger.warn(`Database connection attempt  failed: ${message}`);
        await new Promise((resolve) => setTimeout(resolve));
        return message ;
    }

}
