import * as dotenv from "dotenv";
dotenv.config({ path: "config.env" });
import dbPostgres from "./db/db.postgres";

import * as models from "./models/models";

import App from "./app";

import * as cors from "cors";
import * as bodyParser from "body-parser";
import * as morgan from "morgan";
import * as fileUpload from "express-fileupload";

import errorMiddleware from "./middlewares/error.middleware";

import TestingController from "./controllers/testing/testing.controller";
import UserController from "./controllers/user/user.controller";
import TypeController from "./controllers/type/type.controller";
import BrandController from "./controllers/brand/brand.controller";
import DeviceController from "./controllers/device/device.controller";

const app = new App({
  port: Number(process.env.PORT || 4000),
  controllers: [
    new TestingController(),
    new UserController(),
    new TypeController(),
    new BrandController(),
    new DeviceController(),
  ],
  devMiddleWares: [morgan("dev")],
  middleWares: [
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    cors(),
    fileUpload({}),
  ],
  lastMiddlewares: [errorMiddleware],
});

const start = async () => {
  try {
    try {
      await dbPostgres.authenticate();
      await dbPostgres.sync();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
    app.listen();
  } catch (error) {
    console.log(error);
  }
};

start();
