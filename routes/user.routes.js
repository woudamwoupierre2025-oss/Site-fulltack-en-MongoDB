const router = require('express').Router();
const authnController = require('../controllers/authn.controller');
const userController = require('../controllers/user.controller');

// auth - routes spécifiques en premier
router.post('/register', authnController.signUp);
router.post('/login', authnController.signIn);
router.post('/logout', authnController.logout);
router.get('/jwtid', authnController.jwtid);

// users - routes plus spécifiques avant les génériques
router.get('/', userController.getAllUser);
router.patch('/follow/:id', userController.follow);
router.patch('/unfollow/:id', userController.unfollow);

// routes génériques en dernier
router.get('/:id', userController.userInfo);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
