import * as express from "express";
import {Strategy as LocalStrategy} from "passport-local";
import * as passport from "passport";
import { User } from "../../components/user/userSchema";
import {Password} from "../authentication";
import * as jwt from "express-jwt";

const initPassport = () : passport.PassportStatic => {

    passport.use( new LocalStrategy({passReqToCallback : true}, (req, username, password, done) : void => {
        User.findOne({
            username : username
        }, (err, user) => {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, {
                    message : "Unknown user"
                })
            }

            console.log("Logging in");
            console.log("verify " + user.getPasswordHash());

            Password.verify(password, user.getPasswordHash()).subscribe(result => {
                
                if (!result) {
                    return done(null, false);
                } else {
                    console.log("ok");
                    done(null, user);
                }
                
            });
            
        })
    }));

    return passport;
}

class Authentication {
    public express;
    public passport: passport.PassportStatic;

    constructor() {
        this.express = express();
        this.passport = initPassport();
        this.mountRoutes();
    }

    private mountRoutes(): void {
        const router = express.Router();
        
        router.post("/login", this.passport.authenticate('local', { session: false }), (req, res) => {
            console.log("User has been authorized");

            res.json({
                message: req.user.username
            });
        });
        
        this.express.use(router);
    }
}

export default new Authentication().express;