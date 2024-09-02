const Contact = require("../models/contact")
const User = require("../models/user")

// person API
const initialPersons = [
    {
        name: 'Kobe Bryant',
        phoneNumber: "95-419-7326",
    },
    {
        name: 'Hitler',
        phoneNumber: "12-213-1324",
    },
]

const nonExistingId = async () => {
    const contact = new Contact({ content: 'willremovethissoon' })
    await contact.save()
    await contact.deleteOne()

    return contact._id.toString()
}

const contactsInDb = async () => {
    const contact = await Contact.find({})
    return contact.map(contact => contact.toJSON())
}
// user API
const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    initialPersons, nonExistingId, contactsInDb, usersInDb
}