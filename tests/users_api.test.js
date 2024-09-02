const { test, describe, beforeEach, after } = require("node:test")
const assert = require("node:assert")
const mongoose = require('mongoose')
const supertest = require("supertest")
const app = require("../app")
const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)
describe("users_api test", () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash("secretPWD@123", 10)
        const user = new User({ username: 'root', passwordHash })
        await user.save()
    })
    test("creation succeeds with a fresh username", async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'eminem',
            name: 'Marshall Mathers',
            passwordHash: 'simplepwd',
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })
    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()
        console.log(usersAtStart)
        const newUser = {
            username: 'root',
            name: 'Superuser',
            passwordHash: 'xccxefghji',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })


})
after(async () => {
    await mongoose.connection.close()
    console.log(`conn closeddddd`)
})