import type { Application } from 'express';

import { db } from '../db';
import { authenticate } from './helpers/auth';

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
      const user = await authenticate(request.header('authorization') ?? '');
      if (!user) {
        response.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }
      const body: Record<string, unknown> = request.body ?? {};
      const content = String(body.content);
      const now = new Date().toISOString();
      const newTweet = await db.Tweet.insert({
        content,
        author: user.id,
        likedBy: [],
        createdAt: now,
      });
      response.json(newTweet);
    } catch (error) {
      next(error);
    }
  });
};
