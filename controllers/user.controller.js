const UserModel = require('../config/models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllUser = async (req, res) => {
  try {
    const users = await UserModel.find().select('-password'); // Exclude password from the results
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.userInfo = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknown : ' + req.params.id);

  try {
    const user = await UserModel.findById(req.params.id).select('-password');
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    console.log('Error fetching user: ' + err);
    res.status(500).json({ error: err.message });
  }
};
        ////////////////////////////////////////////////////////////////////// Update user bio only, not password or email
module.exports.updateUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknown : ' + req.params.id);

  try {
    const updated = await UserModel.findByIdAndUpdate(
      req.params.id,
      { $set: { bio: req.body.bio } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    if (!updated) return res.status(404).send('User not found');
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};  

//////////////////////////////////// delete user
module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknown : ' + req.params.id);

  try {
    const deleted = await UserModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send('User not found');
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};




////////////////////////////////

module.exports.follow = async (req, res) => {
    if(!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idTofollow))
        return res.status(400).send('ID unknown : ' + req.params.id);
    try{
        // add idTofollow to current user's following list
        const user = await UserModel.findByIdAndUpdate(
            req.params.id,
            {$addToSet: { following: req.body.idTofollow}},
            {new: true}
        );
        if (!user) return res.status(404).send('User not found');
        
        // add current user id to target user's followers list
        const targetUser = await UserModel.findByIdAndUpdate(
            req.body.idTofollow,
            {$addToSet: { followers: req.params.id}},
            {new: true}
        );
        if (!targetUser) return res.status(404).send('Target user not found');
        
        return res.status(201).json({ message: 'Follow successful', user });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}



////////////////////////// 

module.exports.unfollow = async (req, res) => {
      if(!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnfollow))
        return res.status(400).send('ID unknown : ' + req.params.id);
    try{
        // remove idToUnfollow from current user's following list
        const user = await UserModel.findByIdAndUpdate(
            req.params.id,
            {$pull: { following: req.body.idToUnfollow}},
            {new: true}
        );
        if (!user) return res.status(404).send('User not found');
        
        // remove current user id from target user's followers list
        const targetUser = await UserModel.findByIdAndUpdate(
            req.body.idToUnfollow,
            {$pull: { followers: req.params.id}},
            {new: true}
        );
        if (!targetUser) return res.status(404).send('Target user not found');
        
        return res.status(200).json({ message: 'Unfollow successful', user });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}