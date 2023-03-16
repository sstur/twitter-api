import type { Application } from 'express';

import { db } from '../db';
import { authenticate } from './helpers/auth';

export default (app: Application) => {
  app.get('/api/users', async (request, response, next) => {
    try {
      const users = await db.User.getAll();
      response.json(users);
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/users/me', async (request, response, next) => {
    try {
      const user = await authenticate(request.header('authorization') ?? '');
      if (!user) {
        response.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }
      response.json(user);
    } catch (error) {
      next(error);
    }
  });
};
