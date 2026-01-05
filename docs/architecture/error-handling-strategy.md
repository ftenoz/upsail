# Error Handling Strategy

## Error Flow
```mermaid
sequenceDiagram
  participant Web as Next.js Web
  participant API as NestJS API
  participant DB as PostgreSQL

  Web->>API: Request
  API->>DB: Query/Command
  DB-->>API: Result or Error
  alt Validation error
    API-->>Web: 400 + ApiError
  else Unauthorized
    API-->>Web: 401 + ApiError
  else Not Found
    API-->>Web: 404 + ApiError
  else Server Error
    API-->>Web: 500 + ApiError
  end
```

## Error Response Format
```typescript
interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: string;
    requestId: string;
  };
}
```

## Frontend Error Handling
```typescript
export function normalizeApiError(err: unknown): ApiError {
  if (typeof err === "object" && err && "error" in err) {
    return err as ApiError;
  }
  return {
    error: {
      code: "UNKNOWN",
      message: "An unexpected error occurred.",
      timestamp: new Date().toISOString(),
      requestId: "unknown",
    },
  };
}
```

## Backend Error Handling
```typescript
@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;

    res.status(status).json({
      error: {
        code: exception instanceof HttpException ? exception.name : "INTERNAL_ERROR",
        message: exception instanceof HttpException ? exception.message : "Internal server error",
        details: exception instanceof HttpException ? exception.getResponse() : undefined,
        timestamp: new Date().toISOString(),
        requestId: req.headers["x-request-id"] || "unknown",
      },
    });
  }
}
```
