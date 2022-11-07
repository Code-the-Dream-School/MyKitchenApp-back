const mongoose = require('mongoose')


const RandomSchema = new mongoose.Schema({    

    recipeId: {
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
  
  },{timestamps:true})    
  module.exports = mongoose.model('Random', RandomSchema) 