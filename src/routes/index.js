import { catchGlobalError, catchUnregisteredUrl } from "../middlewares/error";
import userRoute from "./userRoute";
import authRoute from "./authRoute";

export default (app, api) => {
  app.use(api + "/auth", authRoute);
  app.use(api + "/user", userRoute);
  //   app.use(api + "/location", locationRoute);
  //   app.use(api + "/level", levelRoute);

  // url doesnt exist -> fallback
  app.all("*", catchUnregisteredUrl);

  // error handling
  app.use(catchGlobalError);
};
