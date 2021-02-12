import * as express from "express";
import { Request, Response, NextFunction } from "express";
import IControllerBase from "interfaces/IControllerBase.interface";
import ApiError from "../../error/ApiError";
import * as path from "path";

import { Device } from "../../models/models";

class DeviceController implements IControllerBase {
  public path = "/device";
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get(this.path, this.getAll);
    this.router.get(this.path + "/:id", this.getOne);
    this.router.post(this.path, this.create);
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    const { brandId, typeId } = req.query;
    const limit = Number(req.query.limit) || 9;
    const page = Number(req.query.page) || 1;
    const offset = page * limit - limit;

    let devices;

    if (!brandId && !typeId) {
      devices = await Device.findAndCountAll({ limit, offset });
    }

    if (brandId && !typeId) {
      devices = await Device.findAndCountAll({
        where: { brandId },
        limit,
        offset,
      });
    }

    if (!brandId && typeId) {
      devices = await Device.findAndCountAll({
        where: { typeId },
        limit,
        offset,
      });
    }

    if (brandId && typeId) {
      devices = await Device.findAndCountAll({
        where: { brandId, typeId },
        limit,
        offset,
      });
    }

    if (!devices.rows.length) {
      return next(ApiError.badRequest("Устройств нету"));
    }

    return res.status(200).json({
      status: "success",
      results: devices.rows.length,
      data: {
        devices,
      },
    });
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return next(ApiError.badRequest(`Передайте id устройства`));
    }

    const device = await Device.findOne();

    if (!device) {
      return next(ApiError.badRequest(`Устройство с таким ${id} нету`));
    }

    return res.status(200).json({
      status: "success",
      data: {
        device,
      },
    });
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, price, brandId, typeId, info } = req.body;
      const img: any = req.files.img;
      let fileName = `${name.split(" ").join("_")}.jpeg`;

      img.mv(
        path.resolve(__dirname, "..", "..", "..", "static", "img", fileName)
      );

      if (!name) {
        return next(ApiError.badRequest(""));
      }

      const device = await Device.create({
        name,
        price,
        brandId,
        typeId,
        img: fileName,
      });

      return res.status(200).json({
        status: "success",
        message: "Create new Device",
        data: {
          device,
        },
      });
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
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

export default DeviceController;
