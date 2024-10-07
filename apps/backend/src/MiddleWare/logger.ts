import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    const requestTime = Date.now();

    // Log the incoming request
    this.logger.log(
      `[REQ] ${method} ${originalUrl} - User-Agent: ${userAgent}`,
    );

    // Listen for the response finish event
    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - requestTime;

      // Log the outgoing response
      this.logger.log(
        `[RES] ${method} ${originalUrl} ${statusCode} - ${responseTime}ms`,
      );
    });

    next();
  }
}
