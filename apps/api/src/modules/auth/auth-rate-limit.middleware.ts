import { HttpException, Injectable, NestMiddleware } from "@nestjs/common";
import type { Request, Response, NextFunction } from "express";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;

@Injectable()
export class AuthRateLimitMiddleware implements NestMiddleware {
  private readonly requests = new Map<string, number[]>();

  use(req: Request, _res: Response, next: NextFunction) {
    const key = req.ip ?? "unknown";
    const now = Date.now();
    const timestamps = this.requests.get(key) ?? [];
    const recent = timestamps.filter((ts) => now - ts < WINDOW_MS);

    if (recent.length >= MAX_REQUESTS) {
      throw new HttpException("Too many auth attempts. Try again.", 429);
    }

    recent.push(now);
    this.requests.set(key, recent);
    next();
  }
}
