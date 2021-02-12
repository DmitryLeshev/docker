import * as fs from "fs";
import * as express from "express";
import { Request, Response, NextFunction } from "express";
import IControllerBase from "interfaces/IControllerBase.interface";
import IUser from "../../interfaces/IUser.interface";
import * as faker from "faker/locale/ru";

const pathToData = `${__dirname}/../../db/data.json`;

class HomeController implements IControllerBase {
  private data = JSON.parse(String(fs.readFileSync(pathToData)));
  private users: IUser[] = this.data.users;

  public path = "/testing";
  public router = express.Router();

  constructor() {
    // console.log('[initialization] : TestingController');
    // console.log('[Data] -> ', this.data);
    this.initRoutes();
  }

  public initRoutes() {
    this.router.param("id", this.checkID);
    this.router.get(this.path, this.getUsers);
    this.router.get(this.path + "/:id", this.getUser);
    this.router.post(this.path, this.checkBody, this.createUser);
    this.router.patch(this.path + "/:id", this.updateUser);
    this.router.delete(this.path + "/:id", this.deleteUser);
  }

  checkBody = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.name || !req.body.isVip) {
      return res.status(404).json({
        status: "faild",
        message: `Missing Name or is Vip`,
      });
    }
    next();
  };

  checkID = (req: Request, res: Response, next: NextFunction, val: any) => {
    console.log("User ID: ", val);
    if (req.params.id) {
      const user = this.users.find((u) => u.id === Number(req.params.id));
      if (!user) {
        return res.status(404).json({
          status: "faild",
          message: `User with ID ${req.params.id} not found`,
        });
      }
    }
    next();
  };

  getUsers = (req: Request, res: Response) => {
    const users: IUser[] = this.data.users;

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users: this.data.users,
      },
    });
  };

  getUser = (req: Request, res: Response) => {
    const { id } = req.params;

    const users: IUser[] = this.data.users;
    const user = users.find((u) => u.id === Number(id));

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  };

  createUser = async (req: Request, res: Response) => {
    const { name, isVip } = req.body;
    console.log("TEST request body: ", name, isVip);

    const users: IUser[] = this.users;
    let newId: number = 0;
    users.forEach((user) => {
      if (user.id >= newId) newId = user.id + 1;
    });

    const user: IUser = {
      id: newId,
      name: faker.name.findName(),
      isVip: faker.random.boolean(),
    };

    users.push(user);
    this.data.users = users;

    fs.writeFileSync(pathToData, JSON.stringify(this.data));

    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  };

  updateUser = (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, isVip } = req.body;

    const users: IUser[] = [...this.data.users];
    const userIdx = users.findIndex((u) => u.id === Number(id));

    const user = users[userIdx];

    user.name = name;
    user.isVip = isVip;

    const newUsers = [
      ...users.slice(0, userIdx),
      user,
      ...users.slice(userIdx + 1),
    ];

    this.data.users = newUsers;

    fs.writeFileSync(pathToData, JSON.stringify(this.data));

    res.status(201).json({
      status: "success",
      data: {
        user: user,
      },
    });
  };

  deleteUser = (req: Request, res: Response) => {
    const { id } = req.params;
    const user = this.users.find((u) => u.id === Number(id));

    const users = this.users.filter((u) => u.id !== Number(id));

    this.data.users = users;

    fs.writeFileSync(pathToData, JSON.stringify(this.data));

    res.status(204).json({
      status: "success",
      data: {
        user: user,
      },
    });
  };
}

export default HomeController;
