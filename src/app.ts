import * as express from "express";
import * as bodyParser from "body-parser";
import { User } from "./components/user/userSchema";
import { authenticationModule } from "./components/authentication";

class App {
	public express;

	constructor() {
		this.express = express();
		this.mountRoutes();
	}

	private mountRoutes(): void {
		const router = express.Router();
    this.express.use(bodyParser());
    
		this.express.use((req, res, next) => {
			console.log(req.method, req.path);
			next();
		});

		router.get("/", (req, res) => {
			res.json({
				message: "Hello World!"
			});
		});

		this.express.use(router);
		this.express.use(authenticationModule);
	}
}

export default new App().express;
