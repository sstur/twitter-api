import { db } from '../../db';

function parseAuthHeader(input: string) {
  return input.replace(/^Bearer /i, '');
}

export async function authenticate(authHeader: string) {
  const authToken = parseAuthHeader(authHeader);
  if (authToken) {
    const session = await db.Session.getById(authToken);
    if (session) {
      return await db.User.getById(session.user);
    }
  }
  return null;
}
