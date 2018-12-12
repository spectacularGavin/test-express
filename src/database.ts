import * as config from "../appconfig.json";
import * as mongoose from "mongoose";
import * as readline from "readline";
import { User } from "./components/user/userSchema";
import {Password} from "./components/authentication";

const db = async () : Promise<void> => {

    const cli = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log("Connection has been established");

    return new Promise<void>((ok, fail) => {
        
        mongoose
        .connect(config.db.mongodb.conn)
        .then((mongoose) => {
            ok();
        })
        .catch(err => {
            console.error(err);
        });

    }).then(() => new Promise<void>((ok, fail) => {
        // check if user table is empty
        User.estimatedDocumentCount(null, (err, count) => {

            if (count > 0) {
                ok(null);
                return;
            }

            console.log("User table is empty. Create admin user");

            cli.question("Enter admin password: ", ans => {
                const pwd: string = ans;

                if (pwd.length === 0) {
                    console.warn("Password is empty");
                }
                
                Password.hash(pwd).subscribe(hash => {

                    const admin = new User({
                        username: "Administrator"
                    });

                    admin.setPasswordHash(hash);

                    admin.save(err => {
                        if (err) {
                            console.error("Failed to create admin user", err);
                            fail(err);
                            return;
                        } 

                        ok();
                    });
                });

            });
        });
    }));

}

export default db;