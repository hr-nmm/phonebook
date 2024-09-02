const bcrypt = require('bcrypt')
const usersRouter = require('express').Router();
const User = require('../models/user')

usersRouter.post('/', async (req, res, next) => {
    const { username, name, passwordHash } = req.body
    const saltRounds = 10
    const password = await bcrypt.hash(passwordHash, saltRounds)
    const user = new User({
        username: username, name: name, passwordHash: password
    })
    try {
        const savedUser = await user.save()
        res.status(201).json(savedUser)
    }
    catch (exception) {
        res.status(400)
        next(exception)
    }
})
usersRouter.get('/', async (_, res) => {
    const users = await User.find({})
    res.json(users)
})
module.exports = usersRouter