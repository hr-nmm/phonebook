const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const config = require('../utils/config')

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body
    console.log(request.body)
    const user = await User.findOne({ username })
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)
    if (user) {
        if (passwordCorrect) {
            const userForToken = {
                username: user.username,
                id: user._id,
            }
            // token expires in 60*60 seconds, that is, in one hour
            const token = jwt.sign(
                userForToken,
                process.env.SECRET,
                { expiresIn: 60 * 60 }
            )
            response
                .status(200)
                .send({ token, username: user.username, name: user.name })

        } else return response.status(401).json({ error: 'invalid password' })
    } else return response.status(401).json({ error: 'invalid username' })
}
)

module.exports = loginRouter