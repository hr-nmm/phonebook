const { test, after, beforeEach } = require("node:test")
const assert = require("node:assert")
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const helper = require('./test_helper')
const Contact = require('../models/contact')

// beforeEach(async () => {
//     await Contact.deleteMany({})
//     let personObject = new Contact(helper.initialPersons[0])
//     await personObject.save()
//     personObject = new Contact(helper.initialPersons[1])
//     await personObject.save()
// }) // old one- works

// beforeEach(async () => {
//     await Note.deleteMany({})
//     console.log('cleared')

//     helper.initialNotes.forEach(async (note) => {
//         let noteObject = new Note(note)
//         await noteObject.save()
//         console.log('saved')
//     })
//     console.log('done')
// }) // this does not work => the await commands defined inside of the forEach loop are not in the beforeEach function, but in separate functions that beforeEach will not wait for.


// beforeEach(async () => {
//     await Note.deleteMany({})
//     const noteObjects = helper.initialNotes.map(note => new Note(note))
//     const promiseArray = noteObjects.map(note => note.save())
//     await Promise.all(promiseArray)
// }) // this works

// If the promises need to be executed in a particular order, this will be problematic. In situations like this, the operations can be executed inside of a for...of block, that guarantees a specific execution order.
beforeEach(async () => {
    await Contact.deleteMany({})

    for (let contact of helper.initialPersons) {
        let contactObject = new Contact(contact)
        await contactObject.save()
    }
}) // this is the best

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

    const contactsAtEnd = await helper.contactsInDb()
    assert.strictEqual(contactsAtEnd.length, helper.initialPersons.length + 1)
    const contents = contactsAtEnd.map(n => n.name)
    assert(contents.includes('kakuzu'))
})
test('contact without content is not added', async () => {
    const newContact = { important: true }
    await api.post('/api/persons').send(newContact).expect(400)
    const contactsAtEnd = await helper.contactsInDb()
    assert.strictEqual(contactsAtEnd.length, helper.initialPersons.length)
})

test('a specific contact can be fetched from id', async () => {
    const contactsAtStart = await helper.contactsInDb()
    const contactToView = contactsAtStart[1]

    const response = await api.get(`/api/persons/${contactToView.id}`).expect(200).expect('Content-Type', /application\/json/)
    assert.deepStrictEqual(response.body, contactToView)
})

test('delete a contact', async () => {
    const contactAtStart = await helper.contactsInDb()
    const contactToDelete = contactAtStart[1]
    await api.delete(`/api/persons/${contactToDelete.id}`).expect(204)

    const contactAtEnd = await helper.contactsInDb()
    const contents = contactAtEnd.map(r => r.name)

    assert(!contents.includes(contactToDelete.content))
    assert.strictEqual(contactAtEnd.length, helper.initialPersons.length - 1)


})

after(async () => {
    await mongoose.connection.close()
})

