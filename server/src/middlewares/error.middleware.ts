import ApiError from "../error/ApiError";
import { Request, Response, NextFunction } from "express";

export default (err: any, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      status: err.status >= 500 ? "error" : "fail",
      message: err.message,
    });
  }
  return res.status(500).json({
    status: "error",
    message: "Непредвиденная ошибка!",
  });
};
