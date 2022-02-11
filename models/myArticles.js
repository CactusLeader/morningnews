const mongoose = require('mongoose')

const articlesSchema = mongoose.Schema({
    img: String,
    title: String,
    description: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
})

const articlesModel = mongoose.model('article', articlesSchema)

module.exports = articlesModel