const mongoose = require('mongoose')

const urlSchema = mongoose.Schema({
  url: String,
  id: Number
})
const counterSchema = mongoose.Schema({
  name: String,
  id: Number
})

const URL = mongoose.model('URL', urlSchema)
const Counter = mongoose.model('Counter', counterSchema)

module.exports = {URL:URL,Counter:Counter} 