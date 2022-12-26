import type { Express, Request, Response, NextFunction } from 'express';
import utils from './index';
export default (app: Express) => {
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err) {
      utils.log.error(err);
      res.status(403);
      res.json({ error: err.message });
    }

    next(err);
  });
};
