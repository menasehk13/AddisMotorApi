import { DB } from "../helpers/connection";
import driverQuery from "../queries/driver";
import { catchAsync } from "../middlewares/error";
import bcrypt from "bcryptjs";
import AppError from "../helpers/appError";
import { io } from "../app";
import { staticFilePath } from "../helpers/utils";

const getDrivers = catchAsync(async function (req, res, next) {
  DB.query(driverQuery.getdrivers(), function (err, drivers, fields) {
    if (err) return next(new AppError(err.message, 400));


    return res.json({
      status: "success",
      users: drivers,
    });
  });
});

const getDriver = catchAsync(async function (req, res, next) {
  DB.query(
    driverQuery.getdriver(req.params.id),
    function (err, result, fields) {
      if (err) return next(new AppError(err.message, 400));
      const driver = result[0];

      return res.json({
        status: "success",
        user: driver,
      });
    }
  );
});

const addDriver = catchAsync(async (req, res, next) => {
  const data = req.body;

  if (!data.password)
    return next(new AppError("Please input your password", 400));

  data.password = await bcrypt.hash(data.password, 12);
  data.photo = staticFilePath(req.file.filename);

  console.log(data.photo);

  DB.query(driverQuery.add_driver(), data, function (err, result) {
    if (err) return next(new AppError(err.message, 400));

    return res.json({
      status: "success",
      message: "Driver registered successfully",
      user: result,
    });
  });
});

const updateCurrentLocation = catchAsync(async (req, res, next) => {
  const data = req.body;
  const { driverid } = req.params;

  DB.query(
    driverQuery.updatecurrentlocation({ ...data, driverid }),
    function (err, result, fields) {
      if (err) return next(new AppError(err.message, 400));

      return res.json({
        status: "success",
        message: "Driver location updated successfully",
        user: result,
      });
    }
  );
});

const history = catchAsync(async function (req, res, next) {
  DB.query(
    driverQuery.history(req.params.driverid),
    function (err, result, fields) {
      if (err) return next(new AppError(err.message, 400));

      return res.json({
        status: "success",
        message: "driver history loaded successfully",
        history: result,
      });
    }
  );
});

const displayStatus = catchAsync(async function (req, res, next) {
  DB.query(
    driverQuery.displaystatus(req.params.driverid),
    function (err, result, fields) {
      if (err) return next(new AppError(err.message, 400));

      return res.json({
        status: "success",
        status: result,
      });
    }
  );
});

// MIGRATED FROM USER

// online driver view
const onlineDriver = catchAsync(async (req, res, next) => {
  DB.query(driverQuery.getOnlineDrivers(), (err, results) => {
    if (err) return next(new AppError(err.message, 400));
    return res.json({ divers: results });
  });
});

export default {
  getDrivers,
  getDriver,
  addDriver,
  displayStatus,
  history,
  updateCurrentLocation,
  onlineDriver,
};
