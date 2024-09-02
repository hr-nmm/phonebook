const bcrypt = require('bcrypt')
const usersRouter = require('express').Router();
const User = require('../models/user')

usersRouter.post('/', async (req, res, next) => {
    const { username, name, passwordHash } = req.body
    const saltRounds = 10
    console.log(req.body, saltRounds)
    const password = await bcrypt.hash(passwordHash, saltRounds)
    const user = new User({
        username: username, name: name, passwordHash: password
    })
    try {
        const savedUser = await user.save()
        res.status(201).json(savedUser)
        console.log(`ssssssssssssssss`)
    }
    catch (exception) {
        next(exception)
    }
})

module.exports = usersRouter