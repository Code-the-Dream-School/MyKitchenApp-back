const User = require('../models/User')
const GoogleUser = require('../models/GoogleUser')
const jwt = require('jsonwebtoken')
const {OAuth2Client} = require('google-auth-library');
const {UnauthenticatedError} = require('../errors')

const client = new OAuth2Client(process.env.CLIENT_ID);
async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
}

const auth = async (req, res, next) => {
  //check header
  const authHeader = req.headers.authorization
  if(!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('authentication invalid')
  }
  const token = authHeader.split(' ')[1]
  const tokenContent = jwt.decode(token)
  if (tokenContent.iss && tokenContent.iss === "https://accounts.google.com") {
    try {
     await verify(token)
      let googleUser = await GoogleUser.findOne({subject: tokenContent.sub})
      if (!googleUser) {
       googleUser = await GoogleUser.create({
          name: tokenContent.name,
          email: tokenContent.email,
          subject: tokenContent.sub,      
        })
      }
        req.user = {name: tokenContent.name, userId: googleUser.id}
      return next()
    } catch (error) {
      console.log(error)
      throw new UnauthenticatedError('this authentication invalid')
    }
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    //attach the user to the routes
    req.user = {userId:payload.userId, name:payload.name}
    next()
  } catch (error) {
    throw new UnauthenticatedError('authentication invalid')
  }
}

module.exports = auth