import ApiError from "../../error/ApiError";
import * as express from "express";
import { Request, Response, NextFunction } from "express";
import IControllerBase from "interfaces/IControllerBase.interface";

class UserController implements IControllerBase {
  public path = "/user/auth";
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get(this.path, this.check);
  }

  registration = async (req: Request, res: Response) => {};

  login = async (req: Request, res: Response) => {};

  check = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query;

    if (!id) {
      return next(ApiError.badRequest("Не задан ID"));
    }

    res.status(200).json({
      status: "success",
      message: "bla-bla-bla",
      data: { id },
    });
  };
}

export default UserController;
