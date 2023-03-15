import type { Application } from 'express';

import { db } from '../db';

export default (app: Application) => {
  app.get('/api/chirps', async (request, response, next) => {
    try {
      const chirps = await db.Chirp.getAll();
      chirps.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
      response.json(chirps);
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/chirps', async (request, response, next) => {
    try {
      const body: undefined | Record<string, unknown> = request.body;
      const userId = String(body?.userId);
      const content = String(body?.content);
      const user = await db.User.getById(userId);
      if (!user) {
        response.status(400).json({ success: false, error: 'Bad userId' });
        return;
      }
      const now = new Date().toISOString();
      const newChirp = await db.Chirp.insert({
        content,
        author: userId,
        likedBy: [],
        createdAt: now,
      });
      response.json(newChirp);
    } catch (error) {
      next(error);
    }
  });
};
