const jwt = require('jsonwebtoken');
const UserModel = require('../config/models/user.model');

module.exports.cherckUser = (req, res, next) => {
    const token = req.cookies && req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET || 'secret_key', async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                res.cookie('jwt', '', { maxAge: 1 });
                return next();
            } else{
                console.log('Decoded token:', decodedToken);
                if (decodedToken && decodedToken.id) {
                    try {
                        const user = await UserModel.findById(decodedToken.id).select('_id');
                        res.locals.user = user ? user._id : null;
                        console.log('User ID set in locals:', res.locals.user);
                    } catch (e) {
                        console.error('Error fetching user in cherckUser:', e.message);
                        res.locals.user = null;
                    }
                } else {
                    res.locals.user = null;
                }
                return next();
            }
        });
    } else {
        res.locals.user = null;
        return next();
    }         
};


module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies && req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, decodedToken) => {
            if (err) {
                console.log('JWT verify error:', err.message);
                return res.status(401).json({ error: 'Unauthorized' });
            }
            req.userId = decodedToken && decodedToken.id;
            return next();
        });
    } else {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};