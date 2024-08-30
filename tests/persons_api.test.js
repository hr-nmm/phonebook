const { test, after, beforeEach } = require("node:test")
const assert = require("node:assert")
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const helper = require('./test_helper')

beforeEach(async () => {
    await Contact.deleteMany({})
    let personObject = new Contact(helper.initialPersons[0])
    await personObject.save()
    personObject = new Contact(helper.initialPersons[1])
    await personObject.save()
})
const api = supertest(app)

test("Contact is returned as JSON", async () => {
    await api.get("/api/persons").expect(200).expect('Content-Type', /application\/json/)
})
test("there are 7 contacts in DB", async () => {
    const response = await api.get("/api/persons")
    assert.strictEqual(response.body.length, helper.initialPersons.length)
})

test('A Contact by the name Kobe exists ', async () => {
    const response = await api.get('/api/persons')

    const contents = response.body.map(e => e.name)
    // assert.strictEqual(contents.includes('Hitler'), true)
    assert(contents.includes('Kobe Bryant'))

})
test('a valid contact can be added ', async () => {
    const newContact = {
        name: 'kakuzu',
        phoneNumber: "12-123-0000",
    }

    await api
        .post('/api/persons')
        .send(newContact)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/persons')

    const contents = response.body.map(r => r.name)

    assert.strictEqual(response.body.length, helper.initialPersons.length + 1)

    assert(contents.includes('kakuzu'))
})
test('contact without content is not added', async () => {
    const newContact = {
        important: true
    }

    await api
        .post('/api/persons')
        .send(newContact)
        .expect(400)

    const response = await api.get('/api/persons')

    assert.strictEqual(response.body.length, initialPersons.length)
})
after(async () => {
    await mongoose.connection.close()
})

