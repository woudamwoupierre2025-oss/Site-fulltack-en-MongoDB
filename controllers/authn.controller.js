const UserModel = require('../config/models/user.model');

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
