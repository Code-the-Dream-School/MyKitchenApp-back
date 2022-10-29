const {StatusCodes} = require('http-status-codes')
const { NotFoundError } = require('../errors')
const User = require('../models/User')
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
  console.log(results);
  if (!req.params.id) {
    throw new NotFoundError(`no recipe with id ${req.params.id}`)
  }
  res.status(StatusCodes.OK).send(results.data) ;
}


module.exports = {
  getRecipe,
  getRecipes,
}