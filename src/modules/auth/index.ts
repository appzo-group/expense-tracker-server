// Public API of the auth module.
export { authRouter } from './auth.routes';
// Re-export the JWT guard from one place so feature routers import it from here.
export { authMiddleware } from '../../core/middleware/auth.middleware';
