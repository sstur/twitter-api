import type { Application } from 'express';

import { db } from '../db';

export default (app: Application) => {
  app.get('/api/users', async (request, response, next) => {
    try {
      const users = await db.User.getAll();
      response.json(users);
    } catch (error) {
      next(error);
    }
  });
};
