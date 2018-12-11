import { Schema, Document, Model, model } from "mongoose";
import { UserInterface } from "./interface/userInterface";

// see https://brianflove.com/2016/10/04/typescript-declaring-mongoose-schema-model/ for tutorial snippet
export interface UserModelInterface extends UserInterface, Document {
  getPasswordHash(): string;
  setPasswordHash(hash: string): UserModelInterface;
}

export const UserSchema: Schema = new Schema(
    {
        ID: Schema.Types.ObjectId,
        username: String,
        passwordHash: String
    },
    {
        timestamps: true
    }
);

UserSchema.methods.getPasswordHash = function(): string {
    return this.passwordHash;
};

UserSchema.methods.setPasswordHash = function(
    hash: string
): UserModelInterface {
    console.log("set password hash : " + hash);
    this.passwordHash = hash;
    return this;
};

export const User: Model<UserModelInterface> = model<UserModelInterface>(
    "user",
    UserSchema
);
