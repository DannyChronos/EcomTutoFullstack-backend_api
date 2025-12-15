import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      // Replace req.body with ONLY the validated data (strips any extra fields)
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue: any) => ({
          message: `${issue.path.join('.')} is ${issue.message}`,
        }));
        return res.status(400).json({ error: 'Invalid data', details: errorMessages });
      } else {
        return res.status(400).json({ error: 'Internal Server Error' });
      }
    }
  };
}