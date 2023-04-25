var express = require('express');
var router = express.Router();

const auth_controller = require("../controllers/authController");
const user_controller = require("../controllers/userController");
const message_controller = require("../controllers/messageController");

/* GET home page. */
router.get('/', message_controller.index);

//GET and POST Sign-up page
router.get('/sign-up', auth_controller.sign_up_get);
router.post('/sign-up', auth_controller.sign_up_post);

//GET and POST login page
router.get('/login', auth_controller.login_get);
router.post('/login', auth_controller.login_post);

//GET logout page
router.get('/logout', auth_controller.logout_get);

//GET and POST make Member page
router.get('/member', user_controller.make_member_get);
router.post('/member', user_controller.make_member_post);

//GET and POST make Admin page
router.get('/admin', user_controller.make_admin_get);
router.post('/admin', user_controller.make_admin_post);

//GET and POST new Message page
router.get('/newMessage', message_controller.make_message_get);
router.post('/newMessage', message_controller.make_message_post);

module.exports = router;
