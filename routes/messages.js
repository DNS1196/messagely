const Router = require("express").Router;
const router = new Router();
const ExpressError = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");
const Message = require('../models/message');

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/

router.get('/:id', ensureLoggedIn, async (req, res, next) => {
    try {
        let username = req.user.username;
        let msg = await Message.get(req.query.params);
        if (msg.from_user.username !== username && msg.to_user.username !== username) {
            throw new ExpressError('This message cannot be read.', 401);
        }
    } catch (err) {
        return next(err);
    }
})


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post('/', ensureLoggedIn, async (req, res, next) => {
    try {
        let message = await Message.create({
            from_username: req.user.username,
            to_username: req.body.to_username,
            body: req.body.body
        })
        return res.json({ message });
    } catch (err) {
        return next(err);
    }
})


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
router.post('/:id/read', ensureLoggedIn, async (req, res, next) => {
    try {
        let username = req.user.username;
        let msg = await Message.get(req.query.params);
        if (msg.to_user.username !== username) {
            throw new ExpressError('This message cannot be read.', 401);
        }
        let message = await Message.markRead(req.params.id);
        return res.json({ message });
    } catch (err) {
        return next(err);
    }
})


module.exports = router;