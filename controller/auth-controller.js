import bcrypt from 'bcrypt';
import User from "../models/User.js";
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helper/HttpError.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const { JWT_SECRET } = process.env;

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

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, 'Email or password is wrong');
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, 'Email or password is wrong');
    }
    const { _id: id } = user;
    const payload = {
        id
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' });
    await User.findByIdAndUpdate(id, { token });
    const subscription = user.subscription;
    res.json({
        'token': token,
        'user': {
            'email': email,
            'subscription': subscription,
        }
    });
};

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;
    res.json({
        'email': email,
        'subscription': subscription,
    });
};

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: '' });
    res.status(204).json('No Content');
};

export default {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
};