import User from "../models/User.js";
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helper/HttpError.js';

const signup = async (req, res) => {
    const { email } = req.body;
    const user = User.findOne(email);
    if (user) {
        throw HttpError(409, 'Email in use')
    }
    const newUser = await User.create(req.body);
    res.json({
        email: newUser.email,
    })
};

export default {
    signup: ctrlWrapper(signup),
};