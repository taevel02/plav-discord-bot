const mongoose = require("mongoose")

const personSchema = mongoose.Schema({
  person: {
    type: String
  }
})

const Person = mongoose.model("Person", personSchema)

module.exports = { Person };
