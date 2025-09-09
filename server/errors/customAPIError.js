const { StatusCodes } = require("http-status-codes");

class CustomAPIError extends Error {
  constructor(message, statusCode = StatusCodes.INTERNAL_SERVER_ERROR, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

class BadRequestError extends CustomAPIError {
  constructor(message = "Bad Request", code = "BAD_REQUEST") {
    super(message, StatusCodes.BAD_REQUEST, code);
  }
}

class UnauthenticatedError extends CustomAPIError {
  constructor(message = "Not authenticated", code = "AUTH_REQUIRED") {
    super(message, StatusCodes.UNAUTHORIZED, code);
  }
}

class NotFoundError extends CustomAPIError {
  constructor(message = "Not Found", code = "NOT_FOUND") {
    super(message, StatusCodes.NOT_FOUND, code);
  }
}

module.exports = {
  CustomAPIError,
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
};
