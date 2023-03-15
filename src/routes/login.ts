import type { Application } from 'express';

import { db } from '../db';

export default (app: Application) => {
  app.post('/api/login', async (request, response, next) => {
    try {
      const body: undefined | Record<string, unknown> = request.body;
      const username = String(body?.username);
      const password = String(body?.password);
      const users = await db.User.findWhere(
        (user) => user.username === username,
      );
      const user = users[0];
      if (user && password === 'asdf') {
        // Hacky: We're using the user ID as a session token
        response.json({ success: true, token: user.id });
      } else {
        response.status(401).json({ success: false });
      }
    } catch (error) {
      next(error);
    }
  });
};
