import { fromSchema, Model } from './support/orm';
import { User, Tweet, Session } from './types';

export const db = fromSchema({
  User: Model<User>(),
  Tweet: Model<Tweet>(),
  Session: Model<Session>(),
});
