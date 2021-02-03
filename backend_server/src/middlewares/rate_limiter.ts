import { IRateLimiterOptions, RateLimiterMemory } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';

const opts: IRateLimiterOptions = {
    points: 4, // 4 points
    duration: 1, // Per second
    blockDuration: 300, // block for 5 minutes if more than points consumed
};

const rateLimiter: RateLimiterMemory = new RateLimiterMemory(opts);

export async function rateLimiterMiddleware (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        await rateLimiter.consume(req.connection.remoteAddress);
        next();
    } catch (error) {
        res.status(429).json({error, stats: 429, message: 'Too Many Requests'});
    }

}
