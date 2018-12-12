import * as express from "express";
import {Strategy as LocalStrategy} from "passport-local";
import * as passport from "passport";

const initPassport = () : passport.PassportStatic => {

    passport.use( new LocalStrategy({passReqToCallback : true}, (req, username, password, done) => {

    }));

    return passport;
}

class Authentication {
    public express;
    public passport: passport.PassportStatic;

    constructor() {
        this.express = express();
        this.passport = passport;
        this.mountRoutes();
    }

    private mountRoutes(): void {
        const router = express.Router();
        
        router.post("/login", (req, res) => {
            res.json({
                message: "LOGIN TEST"
            });
        });
  
        this.express.use(router);
    }
}

export default new Authentication().express;