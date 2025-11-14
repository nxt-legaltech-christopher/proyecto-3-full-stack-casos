import type { Request, Response } from 'express';

export interface HttpException extends Error {
  statusCode: number;
  message: string;
}

export const HttpExceptionFilter = (
  err: HttpException | Error,
  req: Request,
  res: Response,
  next: (err?: any) => void
) => {
  const statusCode = (err as HttpException).statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    statusCode,
    message,
    timestamp: new Date().toISOString(),
    path: req.path,
  });
};

export class BadRequestException extends Error implements HttpException {
  statusCode = 400;
  constructor(message: string) {
    super(message);
  }
}

export class NotFoundException extends Error implements HttpException {
  statusCode = 404;
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedException extends Error implements HttpException {
  statusCode = 401;
  constructor(message: string = 'Unauthorized') {
    super(message);
  }
}
