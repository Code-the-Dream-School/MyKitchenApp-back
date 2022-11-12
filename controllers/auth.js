const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors')
const Favorite = require('../models/Favorite')



const register = async (req, res) => {
  const user = await User.create({...req.body})
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({user:{name: user.name, email: user.email, type: 'Local'}, token})
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
  res.status(StatusCodes.OK).json({user: {name: user.name, email: user.email, type: 'Local'},  token })

}
//function to change PW
const changePassword = async (req, res) => {  
  const {password, newPassword} = req.body
  if(!password || !newPassword) {
    throw new BadRequestError('please provide old password and new password')
  }
  const user = await User.findById(req.user.userId)
  if(!user) {
    throw new UnauthenticatedError('invalid credentials')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if(!isPasswordCorrect) {
    throw new UnauthenticatedError('invalid credentials')
  }
  user.password = newPassword
  await user.save()
  res.status(StatusCodes.OK).json({message: 'password changed'})
}




const removeUser = async (req, res) => { 
  const user = await User.findByIdAndDelete(req.user.userId)
  if (user) {
    await Favorite.deleteMany({userId: req.user.userId})
  }
  if(!user) {
    throw new NotFoundError(`no user with id ${req.user.userId}`)
  }
  res.status(StatusCodes.OK).json({message: 'user deleted'})
}


module.exports = {
  register,
  login,
  removeUser,
  changePassword,
}