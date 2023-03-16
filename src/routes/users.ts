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

  app.post('/api/users', async (request, response, next) => {
    try {
      const body: Record<string, unknown> = Object(request.body);
      const username = (toString(body.username) ?? '').trim();
      const fullName = toString(body.fullName);
      const profilePic = toString(body.profilePic);
      if (!username || !fullName || !profilePic) {
        response.status(400).json({ success: false, error: 'Bad input' });
        return;
      }
      const existingUsers = await db.User.findWhere(
        (user) => user.username.toLowerCase() === username.toLowerCase(),
      );
      if (existingUsers.length) {
        response.status(400).json({ success: false, error: 'Username exists' });
        return;
      }
      const createdUser = await db.User.insert({
        username,
        fullName,
        profilePic,
        bio: '',
        following: [],
        followers: [],
        likedTweets: [],
      });
      response.json({ success: true, user: createdUser });
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

function toString(input: unknown): string | undefined {
  return typeof input === 'string' ? input : undefined;
}
