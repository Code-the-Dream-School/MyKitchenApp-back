require('dotenv').config();
require('express-async-errors');
const path = require("path")
const axios = require('axios')

//extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');
const API_KEY = process.env.API_KEY
// Swagger
//const swaggerUI = require('swagger-ui-express');
//const YAML = require('yamljs');
//const swaggerDocument = YAML.load('./swagger.yaml');

const express = require('express');
const app = express();

//connectDB
const connectDB = require('./db/connect')
const auth = require('./middleware/authentication')

//routers
const authRouter = require('./routes/auth')
const recipes = require('./routes/recipe')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


//app.set('trust proxy', 1);
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
}));
app.use(express.json());
//app.use(helmet());
const corsOptions = {  // we only use CORS for development testing
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));
app.use(xss());



// extra packages.
// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.set('view engine', 'ejs')
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/recipes', auth, recipes)

//app.post('/googleTicket', (req, res) => {
//  res.redirect('/')
//})

app.use(express.static('./MyKitchenApp-front/build'))

app.get('/googleTicket', (req, res) => {
  res.render('index', {client_id: process.env.CLIENT_ID})
})

app.get('/routeTest', (req, res) => {
  res.status(200).json({message: 'testing route is good'})
})

app.get('/checkUser', auth,  (req, res) => {
  res.status(200).json({message: `user ${req.user.name} is logged in....`})
})
app.get('/testGoogle', (req, res) => {
  res.render('testGoogle')
})

app.use((req,res) => {
  res.sendFile(path.join(__dirname, 'MyKitchenApp-front/build/index.html'))
})

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3002;
const connectionString = process.env.MONGO_URI;
const start = async () => {
  try {
    await connectDB(connectionString)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
