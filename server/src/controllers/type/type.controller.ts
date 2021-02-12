import * as express from "express";
import { Request, Response, NextFunction } from "express";
import IControllerBase from "interfaces/IControllerBase.interface";
import ApiError from "../../error/ApiError";

import { Type } from "../../models/models";

class TypeController implements IControllerBase {
  public path = "/type";
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get(this.path, this.getAll);
    this.router.post(this.path, this.create);
    this.router.delete(this.path, this.delete);
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    const types = await Type.findAll();

    if (!types) {
      return next(ApiError.badRequest("Типов нету"));
    }

    return res.status(200).json({
      status: "success",
      results: types.length,
      data: {
        types,
      },
    });
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    const type = await Type.create({ name });

    if (!name) {
      return next(ApiError.badRequest(""));
    }

    return res.status(200).json({
      status: "success",
      message: "Create new Type",
      data: {
        type,
      },
    });
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    // const { id } = req.params;
    const { id, name } = req.body;

    if (!id && !name) {
      return next(
        ApiError.badRequest("Передайте параметры для поиска устройства")
      );
    }

    let type;

    if (id && !name) {
      type = await Type.destroy({ where: { id } });
    }
    if (!id && name) {
      type = await Type.destroy({ where: { name } });
    }
    if (id && name) {
      type = await Type.destroy({ where: { id, name } });
    }
    if (!type) {
      return next(ApiError.badRequest("Нет такого типа"));
    }

    return res.status(200).json({
      status: "success",
      message: `Delete type by ID: ${id} or by Name: ${name}`,
      data: {
        type,
      },
    });
  };
}

export default TypeController;
