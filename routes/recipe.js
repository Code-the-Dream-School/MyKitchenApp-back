const express = require('express')
const router = express.Router()


const { 
  getRecipes,
  getRecipe,
 } = require('../controllers/recipe')

 router.route('/').get(getRecipes)
 router.route('/:id').get(getRecipe)

 module.exports = router