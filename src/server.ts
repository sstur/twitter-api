import express from 'express';
import type { Application, Request, Response, NextFunction } from 'express';

import { loadPlayground } from './playground/loadPlayground';
import * as routes from './routes';

export function attachHandlers(app: Application) {
  app.disable('x-powered-by');
  app.use('/api', express.json());
  loadPlayground(app);
  for (const attachRoutes of Object.values(routes)) {
    attachRoutes(app);
  }
  app.use(
    '/api',
    (
      err: unknown,
      request: Request,
      response: Response,
      _next: NextFunction,
    ) => {
      const error = err instanceof Error ? err : new Error(String(err));
      response.status(500).json({
        name: error.name,
        message: error.message,
        stack: String(error.stack).split('\n'),
      });
    },
  );
  app.use('/api', (request, response) => {
    response.status(404).send('404 Not Found');
  });
}
