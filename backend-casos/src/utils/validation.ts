import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import type { Request, Response } from 'express';

export const validateDTO = (dtoClass: any) => {
  return async (req: Request, res: Response, next: (err?: any) => void) => {
    const dto = plainToClass(dtoClass, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const messages = errors
        .map((error) => {
          const constraints = Object.values(error.constraints || {});
          return `${error.property}: ${constraints.join(', ')}`;
        })
        .join('; ');

      return res.status(400).json({
        statusCode: 400,
        message: `Validation failed: ${messages}`,
        timestamp: new Date().toISOString(),
      });
    }

    next();
  };
};
