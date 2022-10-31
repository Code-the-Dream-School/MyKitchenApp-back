const mongoose = require('mongoose')
// const bcrypt = require('bcryptjs')  
// const jwt = require('jsonwebtoken')
// const User = require('../models/User')

const FavoriteSchema = new mongoose.Schema({    

    recipeId: {
        type: String,
        required: true,
    },  
    userId: { 

        type: String, 
        required: true,
    },
    title: {
        type: String,
        required: true,
    },  
    image: {
        type: String,
            
    },
    imageType: {
      type: String,
    
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true, 'please provide user']
      }
  },{timestamps:true})    
  module.exports = mongoose.model('Favorite', FavoriteSchema) 