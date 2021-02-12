import * as express from "express";
import { Request, Response, NextFunction } from "express";
import IControllerBase from "interfaces/IControllerBase.interface";
import ApiError from "../../error/ApiError";

import { Brand } from "../../models/models";

class BrandController implements IControllerBase {
  public path = "/brand";
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get(this.path, this.getAll);
    this.router.post(this.path, this.create);
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    const brands = await Brand.findAll();

    if (!brands.length) {
      return next(ApiError.badRequest("Брендов нет"));
    }

    return res.status(200).json({
      status: "success",
      results: brands.length,
      data: {
        brands,
      },
    });
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    if (!name) {
      return next(ApiError.badRequest(""));
    }

    const brand = await Brand.create({ name });

    return res.status(200).json({
      status: "success",
      message: "Create new Brand",
      data: {
        brand,
      },
    });
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    // const { name } = req.body;
    // const type = await Type.findOne({ name });
    // if (!name) {
    //   return next(ApiError.badRequest(""));
    // }
    // return res.status(200).json({
    //   status: "success",
    //   message: "Create new Type",
    //   data: {
    //     type,
    //   },
    // });
  };
}

export default BrandController;
