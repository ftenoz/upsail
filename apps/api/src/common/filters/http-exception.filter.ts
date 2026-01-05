import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import type { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const responseBody =
      exception instanceof HttpException ? exception.getResponse() : undefined;
    const details = typeof responseBody === "object" ? responseBody : undefined;

    response.status(status).json({
      error: {
        code:
          exception instanceof HttpException
            ? exception.name
            : "INTERNAL_ERROR",
        message:
          exception instanceof HttpException
            ? exception.message
            : "Internal server error",
        details,
        timestamp: new Date().toISOString(),
        requestId: request.headers["x-request-id"] || "unknown"
      }
    });
  }
}
