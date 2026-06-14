// Sets required environment variables before any module is loaded in tests.
process.env.NODE_ENV = 'test';
process.env.PORT = '4000';
process.env.MONGO_URI = 'mongodb://localhost:27017/expense_tracker_test';
process.env.BCRYPT_COST = '4';
process.env.JWT_ACCESS_SECRET = 'test_access_secret_key_at_least_32_chars_long';
process.env.JWT_ACCESS_EXPIRE_IN = '15m';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_key_at_least_32_chars_long';
process.env.JWT_REFRESH_EXPIRE_IN = '7d';
