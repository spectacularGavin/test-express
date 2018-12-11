import app from "./app";
import * as config from "../appconfig.json";
import * as mongoose from "mongoose";
import { User } from "./components/user/userSchema";
import * as bcrypt from "bcrypt";
import * as readline from "readline";
// setup server here

const port = process.env.PORT || 3000;
const cli = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// todo: use rxjs or aync functions here instead of this callback mess
mongoose.connect(
    config.db.mongodb.conn,
    () => {
        console.log("Connection has been established");

        // check if user table is empty
        User.estimatedDocumentCount(null, (err, count) => {
            console.log(`count is ${count}`);

            if (count > 0) {
                return;
            }

            console.log("User table is empty. Create admin user");

            cli.question("Enter admin password: ", ans => {
                const salt: number = 12;
                const pwd: string = ans;

                if (pwd.length === 0) {
                    console.warn("Password is empty");
                }

                bcrypt.genSalt(salt, function(err, salt) {
                    bcrypt.hash(pwd, salt, function(err, hash) {
                        const admin = new User({
                            username: "Administrator"
                        });

                        console.log("Creating administrator user");

                        admin.setPasswordHash(hash);

                        admin.save(err => {
                            if (err) {
                                console.error("Failed to create admin user", err);
                            }
                        });

                        app.listen(port, err => {
                            if (err) {
                                return console.log(err);
                            }

                            return console.log(`server is listening on ${port}`);
                        });
                    });
                });
            });
        });
    }
);
