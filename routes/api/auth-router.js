import express from "express";

import authController from "../../controller/auth-controller.js";
import isEmptyBody from '../../middleware/isEmptyBody.js';
import isValidId from '../../middleware/isValidId.js';
import validateBody from '../../decorators/validateBody.js';
import { userSignupSchema } from "../../models/User.js";

const authRouter = express.Router();

authRouter.post('/signup', isEmptyBody, validateBody(userSignupSchema), authController.signup);

export default authRouter;