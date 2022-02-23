import { catchGlobalError, catchUnregisteredUrl } from "../middlewares/error";
import userRoute from "./userRoute";
import driverRoute from "./driverRoute";
import authRoute from "./authRoute";

export default (app, api) => {
  app.use(api + "/auth", authRoute);
  app.use(api + "/users", userRoute);
  app.use(api + "/drivers", driverRoute);

  // url doesnt exist -> fallback
  app.all("*", catchUnregisteredUrl);

  // error handling
  app.use(catchGlobalError);
};
