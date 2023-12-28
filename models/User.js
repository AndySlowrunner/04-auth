import { Schema, model } from "mongoose";
import Joi from "joi";

import { addUpdateSetting, handleSaveError } from "./hooks.js";

const userSchema = new Schema({
    password: {
        type: String,
        required: [true, 'Set password for user'],
        minlength: 4,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: String
}, { versionKey: false, timestamps: true });

userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", addUpdateSetting);
userSchema.post("findOneAndUpdate", handleSaveError);

export const userSignupSchema = Joi.object({
    password: Joi.string().min(4).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    subscription: Joi.string().required(),
    token: Joi.string().required(),
});

export const userSigninSchema = Joi.object({
    password: Joi.string().min(4).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
});

const User = model("user", userSchema);

export default User;