import type { Application } from 'express';

import { db } from '../db';

export default (app: Application) => {
  app.get('/api/tweets', async (request, response, next) => {
    try {
      const tweets = await db.Tweet.getAll();
      tweets.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
      response.json(tweets);
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/tweets', async (request, response, next) => {
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
      const newTweet = await db.Tweet.insert({
        content,
        author: userId,
        likedBy: [],
        createdAt: now,
      });
      response.json(newTweet);
    } catch (error) {
      next(error);
    }
  });
};
