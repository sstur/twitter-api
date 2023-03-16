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
        const now = new Date().toISOString();
        const session = await db.Session.insert({
          user: user.id,
          createdAt: now,
        });
        response.json({ success: true, token: session.id });
      } else {
        response.status(401).json({ success: false });
      }
    } catch (error) {
      next(error);
    }
  });
};
