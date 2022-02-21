export const protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.split(" ")[1];

  if (!token || !authorization)
    return next(new AppError("please provide a token", 401));

  const decodedToken = jwt.verify(token, JWTSecretKey);
  const userId = decodedToken.id;

  if (req.body.userId && req.body.userId !== userId) {
    return next(new AppError("Invalid user ID", 402));
  } else {
    req.headers.user = userId;
    next();
  }
});
