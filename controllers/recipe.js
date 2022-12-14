const {StatusCodes} = require('http-status-codes')
const { NotFoundError } = require('../errors')
const User = require('../models/User')
const Favorite = require('../models/Favorite')
const Random = require('../models/Random')
const API_KEY = process.env.API_KEY
const axios = require('axios')


const recipeFunc = async (req, results) => {
  // console.log('results data:', JSON.stringify(results.data.nutrition, null, 2))
  let nutrition = results.data.nutrition
  let ingredients = results.data.extendedIngredients.map(ingredient => ingredient.original)
  let instructions = []
  if(results.data.analyzedInstructions.length > 0) {
    instructions = results.data.analyzedInstructions[0].steps.map(step => step.step)
  }
  let favorite = await Favorite.find({userId: req.user.userId, recipeId: results.data.id})

  let recipe = {
    isFavorite: favorite.length ? true : false,
    id: results.data.id,
    title: results.data.title,
    servings: results.data.servings,
    healthScore: results.data.healthScore,
    veryPopular: results.data.veryHealthy,
    glutenFree: results.data.glutenFree,
    dairyFree: results.data.dairyFree,
    vegetarian: results.data.vegetarian,
    vegan: results.data.vegan,
    diets: results.data.diets,
    cuisines: results.data.cuisines,
    sourceUrl: results.data.sourceUrl,
    image: results.data.image,
    ingredients: ingredients,
    instructions: instructions,
    readyInMinutes: results.data.readyInMinutes,
    summary: results.data.summary,
    creditText: results.data.creditsText,}
    if (nutrition) {
    recipe.nutrition = nutrition;
  }
  return recipe;
}

const getRecipes = async (req, res) => {
  req.query.apiKey = API_KEY;
  const results = await axios.get("https://api.spoonacular.com/recipes/complexSearch", {params: req.query});
  res.status(StatusCodes.OK).json(results.data)
}
const getRecipe = async (req, res) => {
  req.query.apiKey = API_KEY;
  const results = await axios.get(`https://api.spoonacular.com/recipes/${req.params.id}/information?includeNutrition=true`, {params: req.query});
  if (!req.params.id) {
    throw new NotFoundError(`no recipe with id ${req.params.id}`)
  }
  const recipe = await recipeFunc(req, results)
  res.status(StatusCodes.OK).json(recipe)
}

const deleteFavorite = async (req, res) => {
  const {id} = req.params
  const {user} = req
  const favorite = await Favorite.findOneAndDelete({userId: user.userId, recipeId: id})
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

const getRandomRecipes = async (req, res) => { 
  req.query.apiKey = API_KEY;
  const savedRecipe = await Random.findOne();
  let results = null;
  if (savedRecipe) {
    const thisDate = new Date(Date.now())
    if(savedRecipe.updatedAt.getDate() === thisDate.getDate()) {
      results = await axios.get(`https://api.spoonacular.com/recipes/${savedRecipe.recipeId}/information`, {params: req.query})
    }
  }
  if (!results) {
    results = await axios.get(`https://api.spoonacular.com/recipes/random`, {params: req.query});
    results.data = results.data.recipes[0]
    if(savedRecipe) {
      savedRecipe.recipeId = results.data.id;
      savedRecipe.save();
    }
    await Random.create({recipeId: results.data.id, title: results.data.title})
  }
  const recipe = recipeFunc(req, results);
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