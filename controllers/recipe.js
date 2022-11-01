const {StatusCodes} = require('http-status-codes')
const { NotFoundError } = require('../errors')
const User = require('../models/User')
const Favorite = require('../models/Favorite')
const apiKey = process.env.apiKey
const axios = require('axios')


const getRecipes = async (req, res) => {
  req.query.apiKey = apiKey;
  const results = await axios.get("https://api.spoonacular.com/recipes/complexSearch", {params: req.query});
  res.status(StatusCodes.OK).send(results.data)
}
const getRecipe = async (req, res) => {
  req.query.apiKey = apiKey;
  const results = await axios.get(`https://api.spoonacular.com/recipes/${req.params.id}/information`, {params: req.query});
  if (!req.params.id) {
    throw new NotFoundError(`no recipe with id ${req.params.id}`)
  }
  // let ingredients = results.data.extendedIngredients.map(ingredient => ingredient)
  let instructions = results.data.analyzedInstructions[0].steps.map(step => step.step)
  let recipe = {
    id: results.data.id,
    title: results.data.title,
    image: results.data.image,
    // ingredients: ingredients,
    instructions: instructions,
    readyInMinutes: results.data.readyInMinutes,
    servings: results.data.servings,
    sourceUrl: results.data.sourceUrl,
    summary: results.data.summary,
    diets: results.data.diets,
    cuisines: results.data.cuisines,
    originalId: results.data.id,
    creditText: results.data.creditsText,
    sourceName: results.data.sourceName,
    imageType: results.data.imageType,

  }
  res.status(StatusCodes.OK).json(recipe)
}

//   id = req.params.id
//   image = results.data.image
//   title = results.data.title
//   imageType = results.data.imageType
//   servings = results.data.servings
//   readyInMinutes = results.data.readyInMinutes
//   extendedIngredients = results.data.extendedIngredients
//   instructions = results.data.instructions
//   summary = results.data.summary
//   originalId = results.data.id
//   name = results.data.name
//   sourceUrl = results.data.sourceUrl
//   creditText = results.data.creditText

//   res.status(StatusCodes.OK).json({id, image, title, imageType, servings, readyInMinutes, extendedIngredients, instructions})
//   //res.status(StatusCodes.OK).send(results.data) ;
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
// get only id, title, image, readyInMinutes, servings, sourceUrl, summary, extendedIngredients (name, amount, unit, image),instructions, imageType creditText from /api/v1/recipes/:id.  













module.exports = {
  getRecipe,
  getRecipes,
  getRecipeList,
  saveFavorite,
  deleteFavorite
}