/**
 * Augments Express's Request with the authenticated user id set by
 * `auth.middleware`. Every protected controller can read `req.user.id`.
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface UserPayload {
      id: string;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
