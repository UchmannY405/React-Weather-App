const { CustomAPIError } = require('../errors/customAPIError');

const errorHandlerMiddleware = (err, req, res, next) => {
  const isProd = process.env.NODE_ENV === "production";
  const status = err instanceof CustomAPIError ? err.statusCode : 500;

  return res.status(status).json({
    success: false,
    message:
      err instanceof CustomAPIError ? err.message : "Internal Server Error",
    code: err.code || undefined,
    ...(isProd ? {} : { stack: err.stack }),
  });
};

module.exports = errorHandlerMiddleware;
