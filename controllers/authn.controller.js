const UserModel = require('../config/models/user.model');
const jwt = require('jsonwebtoken');

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_key', {
    expiresIn: '24h'
  });
};


module.exports.signUp = async (req, res) => {
  const { pseudo, email, password } = req.body;

  try {
    const newUser = new UserModel({ pseudo, email, password });
    await newUser.save();
    res.status(201).json({ message: 'Utilisateur créé avec succès !' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge });
    res.status(200).json({ user: user._id, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json({ message: 'Logout successful' });
};

module.exports.jwtid = (req, res) => {
  const token = (req.cookies && req.cookies.jwt) ||
    (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });
    return res.status(200).json({ id: decoded && decoded.id });
  });
};