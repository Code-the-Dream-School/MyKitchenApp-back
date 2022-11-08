const mongoose = require('mongoose')


const RandomSchema = new mongoose.Schema({    

    recipeId: {
        type: Number,
        required: true,
    },  
    title: {
        type: String,
        required: true,
    },  
   
  },{timestamps:true})    
  module.exports = mongoose.model('Random', RandomSchema) 