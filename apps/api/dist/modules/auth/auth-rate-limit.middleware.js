"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRateLimitMiddleware = void 0;
const common_1 = require("@nestjs/common");
const WINDOW_MS = 60000;
const MAX_REQUESTS = 20;
let AuthRateLimitMiddleware = class AuthRateLimitMiddleware {
    constructor() {
        this.requests = new Map();
    }
    use(req, _res, next) {
        const key = req.ip ?? "unknown";
        const now = Date.now();
        const timestamps = this.requests.get(key) ?? [];
        const recent = timestamps.filter((ts) => now - ts < WINDOW_MS);
        if (recent.length >= MAX_REQUESTS) {
            throw new common_1.HttpException("Too many auth attempts. Try again.", 429);
        }
        recent.push(now);
        this.requests.set(key, recent);
        next();
    }
};
exports.AuthRateLimitMiddleware = AuthRateLimitMiddleware;
exports.AuthRateLimitMiddleware = AuthRateLimitMiddleware = __decorate([
    (0, common_1.Injectable)()
], AuthRateLimitMiddleware);
