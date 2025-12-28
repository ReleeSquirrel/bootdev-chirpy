// HTTP Status Code 400
export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}

// HTTP Status Code 401
export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
  }
}

// HTTP Status Code 403
export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
  }
}

// HTTP Status Code 404
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}