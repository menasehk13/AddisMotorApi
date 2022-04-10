import AppError from "../helpers/appError";

function sendErrorDev(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
}

function sendErrorProd(err, res) {
  if (err.isOperational)
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  else {
    res.status(err.statusCode).json({
      status: err.status,
      message: "something went wrong",
    });
  }
}

export function catchGlobalError(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV == "production") {
    sendErrorProd(err, res);
  } else if (process.env.NODE_ENV == "development") {
    sendErrorDev(err, res);
  }
}

export function catchAsync(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

export function catchUnregisteredUrl(req, res, next) {
  return next(
    new AppError(`can't find ${req.originalUrl} on this server`, 404)
  );
}
