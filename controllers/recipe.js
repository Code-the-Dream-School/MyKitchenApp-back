const {StatusCodes} = require('http-status-codes')
const { NotFoundError } = require('../errors')
const User = require('../models/User')
const Favorite = require('../models/Favorite')
const apiKey = process.env.apiKey
const axios = require('axios')


const getRecipes = async (req, res) => {
  req.query.apiKey = apiKey;
  const results = await axios.get("https://api.spoonacular.com/recipes/complexSearch", {params: req.query});
  res.status(StatusCodes.OK).json(results.data)
}
const getRecipe = async (req, res) => {
  req.query.apiKey = apiKey;
  const results = await axios.get(`https://api.spoonacular.com/recipes/${req.params.id}/information`, {params: req.query});
  if (!req.params.id) {
    throw new NotFoundError(`no recipe with id ${req.params.id}`)
  }
  let ingredients = results.data.extendedIngredients.map(ingredient => ingredient.original)
  let instructions = results.data.analyzedInstructions[0].steps.map(step => step.step)
  let recipe = {
    id: results.data.id,
    title: results.data.title,
    servings: results.data.servings,
    diets: results.data.diets,
    cuisines: results.data.cuisines,
    sourceUrl: results.data.sourceUrl,
    image: results.data.image,
    ingredients: ingredients,
    instructions: instructions,
    readyInMinutes: results.data.readyInMinutes,
    summary: results.data.summary,
    creditText: results.data.creditsText,
  }
  return recipe;
}

// const getRecipes = async (req, res) => {
//   req.query.apiKey = apiKey;
//   const results = await axios.get("https://api.spoonacular.com/recipes/complexSearch", {params: req.query});
//   res.status(StatusCodes.OK).json(results.data)
// }
// const getRecipe = async (req, res) => {
//   req.query.apiKey = apiKey;
//   //add way for check if recipe has been favorited and in saved list
//   const results = await axios.get(`https://api.spoonacular.com/recipes/${req.params.id}/information`, {params: req.query});
//   if (!req.params.id) {
//     throw new NotFoundError(`no recipe with id ${req.params.id}`)
//   }
//   const recipe = recipeFunc(results)
//   res.status(StatusCodes.OK).json(recipe)
// }

// check if user: user._id or if user: user.id??.......................
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
  res.status(StatusCodes.OK).json(favoritesList) ;
}

const saveFavorite = async (req, res) => {
  req.body.userId = req.user.userId
  const list = await Favorite.find({userId: req.user.userId, recipeId: req.body.recipeId});
  if (list.length > 0) {
    return res.status(StatusCodes.OK).json({message: 'Recipe already saved!'})
  }
  await Favorite.create(req.body)
  res.status(StatusCodes.OK).json({message: 'Favorite recipe saved'}) ;

}
//get random recipe from api route https://api.spoonacular.com/recipes/random

const getRandomRecipes = async (req, res) => { 
  req.query.apiKey = apiKey;
  const savedRecipe = await Random.findOne();
  let results = null;
  if (savedRecipe) {
    const thisDate = new Date(Date.now())
    if(savedRecipe.updatedAt.getDate() === thisDate.getDate()) {
      results = await axios.get(`https://api.spoonacular.com/recipes/${savedRecipe.recipeId}/information`, {params: req.query})
    }
  }
  if (!results) { //added ?number=1 to path....need to test after 24 hrs
    results = await axios.get(`https://api.spoonacular.com/recipes/random?number=10`, {params: req.query});
    results.data = results.data.recipes[0]
    if(savedRecipe) {
      savedRecipe.recipeId = results.data.id;
      savedRecipe.save();
    }
    await Random.create({recipeId: results.data.id, title: results.data.title})
  }
  const recipe = recipeFunc(results);
  res.status(StatusCodes.OK).json(recipe)
}














module.exports = {
  getRecipe,
  getRecipes,
  getRecipeList,
  saveFavorite,
  deleteFavorite,
  getRandomRecipes,
}