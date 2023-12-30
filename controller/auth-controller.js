import bcrypt from 'bcrypt';
import User from "../models/User.js";
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helper/HttpError.js';

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({email});
    if (user) {
        throw HttpError(409, 'Email in use');
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({...req.body, password: hashPassword});
    res.json({
        'user': {
            'email': newUser.email,
            'subscription': newUser.subscription,
        }
    })
};

const login = async (res, req) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, 'Email or password is wrong');
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, 'Email or password is wrong');
    }
    const token = '124.5333.555';
    res.json({
        token,
        'user': {
            'email': newUser.email,
            'subscription': newUser.subscription,
        }
    });
}

export default {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
};