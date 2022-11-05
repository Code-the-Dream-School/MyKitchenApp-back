const express = require('express')
const router = express.Router()


const { 
  getRecipes,
  getRecipe,
  getRecipeList,
  saveFavorite,
  deleteFavorite,
  getRandomRecipes,
 } = require('../controllers/recipe')

 router.route('/').get(getRecipes)
 router.route('/random').get(getRandomRecipes)
 router.route('/list').get(getRecipeList).post(saveFavorite)
 router.route('/:id').get(getRecipe).delete(deleteFavorite)

 module.exports = router