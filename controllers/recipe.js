const {StatusCodes} = require('http-status-codes')
const { NotFoundError } = require('../errors')
const User = require('../models/User')
const Favorite = require('../models/Favorite')
const apiKey = process.env.apiKey
const axios = require('axios')


const getRecipes = async (req, res) => {
  req.query.apiKey = apiKey;
  const results = await axios.get("https://api.spoonacular.com/recipes/complexSearch", {params: req.query});
  console.log(results);
  res.status(StatusCodes.OK).send(results.data)
}
const getRecipe = async (req, res) => {
  req.query.apiKey = apiKey;
  const results = await axios.get(`https://api.spoonacular.com/recipes/${req.params.id}/information`, {params: req.query});
  if (!req.params.id) {
    throw new NotFoundError(`no recipe with id ${req.params.id}`)
  }
  res.status(StatusCodes.OK).send(results.data) ;
} //get id, title, image, readyInMinutes, servings, sourceUrl, summary, analyzedInstructions, extendedIngredients (name, amount, unit, image)

const deleteFavorite = async (req, res) => {
  const {id} = req.params
  const {user} = req
  const favorite = await Favorite.findOneAndDelete({user: user._id, recipeId: id})
  if(!favorite) { 
    throw new NotFoundError(`no favorite with id ${id}`)  
  } 
  res.status(StatusCodes.OK).json({message: 'favorite deleted'})  
} 

const getRecipeList = async (req, res) => {
  const favoritesList = await Favorite.find({userId: req.user.userId})
  console.log(favoritesList);
  res.status(StatusCodes.OK).json(favoritesList) ;
}

const saveFavorite = async (req, res) => {
  req.body.userId = req.user.userId
  console.log(req.user.userId)
  const list = await Favorite.find({userId: req.user.userId, recipeId: req.body.recipeId});
  if (list.length > 0) {
    return res.status(StatusCodes.OK).json({message: 'Recipe already saved!'})
  }
  await Favorite.create(req.body)
  res.status(StatusCodes.OK).json({message: 'Favorite recipe saved'}) ;

}


module.exports = {
  getRecipe,
  getRecipes,
  getRecipeList,
  saveFavorite,
  deleteFavorite
}