import { AnyZodObject, ZodError } from 'zod';
import { NextFunction, Request, Response } from 'express';

export function validateRequest(schema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (parsed.body) req.body = parsed.body;
      if (parsed.query) req.query = parsed.query as Request['query'];
      if (parsed.params) req.params = parsed.params;
      next();
    } catch (error) {
      next(error as ZodError);
    }
  };
}