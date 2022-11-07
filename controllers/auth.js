const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors')



const register = async (req, res) => {
  const user = await User.create({...req.body})
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({user:{name: user.name}, token})
}
 
const login = async (req, res) => {
  const {email, password} = req.body
  
  if(!email || !password) {
    throw new BadRequestError('please provide email and password')
  }
  const user = await User.findOne({email})

  if(!user) {
    throw new UnauthenticatedError('invalid credentials')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if(!isPasswordCorrect) {
    throw new UnauthenticatedError('invalid credentials')
  }
  //compare password
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({user: {name: user.name, email: user.email},  token })

}

const removeUser = async (req, res) => { 
  const {id} = req.params
  const user = await User.findByIdAndDelete(id)
  if(!user) {
    throw new NotFoundError(`no user with id ${id}`)
  }
  res.status(StatusCodes.OK).json({message: 'user deleted'})
}


module.exports = {
  register,
  login,
  removeUser,
}