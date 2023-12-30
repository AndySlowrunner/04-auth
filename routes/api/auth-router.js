import express from "express";

import authController from "../../controller/auth-controller.js";
import isEmptyBody from '../../middleware/isEmptyBody.js';
import isValidId from '../../middleware/isValidId.js';
import validateBody from '../../decorators/validateBody.js';
import { userLoginSchema, userSignupSchema } from "../../models/User.js";

const authRouter = express.Router();

authRouter.post('/register', isEmptyBody, validateBody(userSignupSchema), authController.register);
authRouter.post('/login', isEmptyBody, validateBody(userLoginSchema), authController.login);

export default authRouter;