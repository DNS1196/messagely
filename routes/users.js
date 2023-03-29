
const Router = require("express").Router;
const router = new Router();

const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const User = require('../models/user');


/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get('/', ensureLoggedIn, async (req, res, next) => {
    try {
        let users = await User.all();
        return res.json({ users })
    } catch (err) {
        return next(err);
    }
})

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

router.get('/:username', ensureCorrectUser, async (req, res, next) => {
    try {
        let user = await User.get(req.query.params);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
})


/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get('/:username/to', ensureCorrectUser, async (req, res, next) => {
    try {
        let messages = await User.messagesTo(req.query.params);
        return res.json({ messages });
    } catch (err) {
        return next(err);
    }
})

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get('/:username/from', ensureCorrectUser, async (req, res, next) => {
    try {
        let messages = await User.messagesFrom(req.query.params);
        return res.json({ messages });
    } catch (err) {
        return next(err);
    }
})


module.exports = router;