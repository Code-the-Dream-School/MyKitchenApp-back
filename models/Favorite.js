const mongoose = require('mongoose')
// const bcrypt = require('bcryptjs')  
// const jwt = require('jsonwebtoken')
// const User = require('../models/User')

const FavoriteSchema = new mongoose.Schema({    

    recipeId: {
        type: Number,
        required: true,
    },  
    userId: { 

        type: mongoose.Types.ObjectId, 
        required: true,
    },
    title: {
        type: String,
        required: true,
    },  
    image: {
        type: String,
            
    },

  
  },{timestamps:true})    
  module.exports = mongoose.model('Favorite', FavoriteSchema) 