import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    if (token) {
        try {
            const { id } = jwt.verify(token, 'secretKey');
            req.userId = id;
            next();
        } catch (err) {
            res.status(403).json({ msg: 'Can`t authorization' });
        }
    } else {
        res.status(403).json({ msg: 'token' });
    }
};
