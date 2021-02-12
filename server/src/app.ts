import * as express from "express";
import { Application } from "express";
import * as path from "path";

class App {
  public app: Application;
  public port: number;

  constructor(appInit: {
    port: number;
    middleWares: any;
    devMiddleWares: any;
    lastMiddlewares: any;
    controllers: any;
  }) {
    this.app = express();
    this.port = appInit.port;

    if (process.env.NODE_ENV === "development") {
      this.devMiddlewares(appInit.devMiddleWares);
    }

    this.middlewares(appInit.middleWares);
    this.routes(appInit.controllers);
    this.lastMiddlewares(appInit.lastMiddlewares);
    this.assets();
    this.template();
  }

  private devMiddlewares(devMiddleWares: any) {
    devMiddleWares.forEach((devMiddleWare: any) => {
      this.app.use(devMiddleWare);
    });
  }

  private middlewares(middleWares: any) {
    middleWares.forEach((middleWare: any) => {
      this.app.use(middleWare);
    });
  }

  private lastMiddlewares(middleWares: any) {
    middleWares.forEach((middleWare: any) => {
      this.app.use(middleWare);
    });
  }

  private routes(controllers: any) {
    controllers.forEach((controller: any) => {
      this.app.use("/api/v1/", controller.router);
    });
  }

  private assets() {
    this.app.use(express.static(path.resolve(__dirname, "..", "static")));
  }

  private template() {
    // this.app.set('view engine', 'pug')
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the http://localhost:${this.port}`);
    });
  }
}

export default App;
