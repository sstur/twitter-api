import { fromSchema, Model } from './support/orm';
import { User, Tweet } from './types';

export const db = fromSchema({
  User: Model<User>(),
  Tweet: Model<Tweet>(),
});
