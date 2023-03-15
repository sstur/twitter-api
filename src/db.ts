import { fromSchema, Model } from './support/orm';
import { User, Chirp } from './types';

export const db = fromSchema({
  User: Model<User>(),
  Chirp: Model<Chirp>(),
});
