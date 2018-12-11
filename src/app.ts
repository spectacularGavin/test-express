import * as express from "express";
import { User } from "./components/user/userSchema";

class App {
  public express;

  constructor() {
      this.express = express();
      this.mountRoutes();
  }

  private mountRoutes(): void {
      const router = express.Router();

      router.get("/", (req, res) => {
          res.json({
              message: "Hello World!"
          });
      });

      this.express.use("/", router);

      /*let test = new User({
      username : "kek"
    });

    test.setPasswordHash("123");

    test.save(err => {
      if (err) {
        console.error(err);
      }
    }); */
  }
}

export default new App().express;
