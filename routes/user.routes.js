const router = require('express').Router();
const authnController = require('../controllers/authn.controller');
const userController = require('../controllers/user.controller');

// auth
router.post('/register', authnController.signUp);

// users
router.get('/', userController.getAllUser);
router.get('/:id', userController.userInfo);
router.put('/:id', userController.updateUser); // pour mettre à jour les informations de l'utilisateur updateUser
router.delete('/:id', userController.deleteUser); // pour supprimer un utilisateur deleteUser
router.patch('/follow/:id', userController.follow);
router.patch('/unfollow/:id', userController.unfollow); 

module.exports = router;
