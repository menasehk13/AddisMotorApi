import AppError from "../helpers/appError";

function handleDBCastError(err) {
  let path = Object.keys(err.errors).map((er) => err.errors[er].path);
  let value = Object.keys(err.errors).map((er) => err.errors[er].value);

  let message = `${path.map(
    (p, i) => `Invalid value [${value[i]}] given for ${path[i]}!`
  )}`;

  return new AppError(message, 400);
}

function handleDBDuplicateError(err) {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  let message = `Duplicate field value ${value}, try changing ${Object.keys(
    err.keyValue
  ).join(",")}`;

  return new AppError(message, 400);
}

function handleDBValidationError(err) {
  const errors = Object.values(err.errors).map((er) => er.message);
  let message = `Duplicate field value ${errors.join(
    ", "
  )}, try changing value`;

  return new AppError(message, 400);
}

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
  else
    res.status(err.statusCode).json({
      status: err.status,
      message: "something went wrong",
    });
}

export function catchGlobalError(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV == "production") {
    let error = { ...err };
    let errmsg = err.errmsg;

    // if (err.name == "CastError") {
    if (err._message == "user validation failed") {
      err = handleDBCastError(err);
    } else if (error.code == 11000) err = handleDBDuplicateError(err);
    else if (err.name == "ValidationError") {
      err = handleDBValidationError(err);
    }
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
