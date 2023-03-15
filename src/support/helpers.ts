import type { Request, Response, NextFunction } from 'express';

type Payload = Array<unknown> | Record<string, unknown> | null | undefined;

type Handler = (request: Request) => Promise<Payload>;

export function json(fn: Handler) {
  const handle = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const payload = await fn(request);
    if (payload) {
      response.json(payload);
    } else {
      next();
    }
  };
  return (request: Request, response: Response, next: NextFunction) => {
    handle(request, response, next).catch(next);
  };
}
