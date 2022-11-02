const mongoose = require('mongoose')

const GoogleUserSchema = new mongoose.Schema({
  name: {
    type:String,
    required:[true, 'please provide a name'],
  },
  email: {
    type:String,
    required:[true, 'please provide a email'],
    unique: true,
  },
  subject: {
    type:String,
    required: true,
  }
})



module.exports = mongoose.model('GoogleUser', GoogleUserSchema)