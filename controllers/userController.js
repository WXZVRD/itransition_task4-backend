import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import db from "../database.js";
import {io} from "../socket.js";


const comparePasswords = (pass, passHash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(pass, passHash, (error, match) => {
            if (error || !match) {
                reject(new Error('Incorrect password'));
            } else {
                resolve();
            }
        });
    });
};

export const getMe = async (req, res) => {
    try {
        const user = await db.getUserById(req.userId);
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ msg: 'Something went wrong...' });
    }
};

export const getAll = async (req, res) => {
    try {
        const users = await db.getAllUsers();
        if (users.length === 0) {
            return res.status(401).json({ msg: 'Empty list' });
        }
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong...' });
    }
};

export const authorization = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await db.getUserByEmail(email);

        if (!user) {
            return res.status(401).json({ msg: 'Incorrect password or email' });
        }

        await comparePasswords(password, user.pass);

        const token = jwt.sign({ id: user.id }, 'secretKey');
        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ msg: 'Something went wrong...' });
    }
};

export const registration = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json(errors.array());
            return;
        }


        const salt = await bcrypt.genSalt(10);
        const passHash = await bcrypt.hash(req.body.password, salt);

        await db.createUser({
            nick: req.body.nick,
            secondName: req.body.secondName,
            pass: passHash,
            email: req.body.email,
        });

        res.status(200).json({ msg: 'Success!' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json([{ path: 'email', msg: 'Email already exists' }]);
        } else {
            res.status(500).json({ msg: 'Something went wrong...' });
        }    }
};

export const updateData = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json(errors.array());
    } else {
        try {
            const id = req.body.id;
            const email = req.body.email;
            const nick = req.body.nick;
            const secondName = req.body.secondName;

            await db.updateUser({ id, email, nick, secondName });

            res.status(200).json({ msg: 'Data updated successfully' });
        } catch (error) {
            res.status(500).json({ msg: 'Failed to update data' });
        }
    }
};

export const deleteUser = async (req, res) => {
    try {
        const toDelete = req.body.map((el) => el.email);

        await db.deleteUsers(toDelete);

        io.emit('deleteUsers', req.body);
        res.status(200).json('completed');
    } catch (error) {
        res.status(403).json({ msg: 'Something went wrong...' });
    }
};

export const changeStatus = async (req, res) => {
    try {
        const toChange = req.body.map((el) => el.email);

        await db.changeStatus(toChange);

        io.emit('changeStatus', req.body);
        res.status(200).json('completed');
    } catch (error) {
        res.status(403).json({ msg: 'Error change' });
    }
};
