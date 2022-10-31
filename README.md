# alpaca-albatross-practicum-team2-back

## Back End Repository
## configuration 
to run this program you need a .env file with   
MONGO_URI   
JWT_SECRET   
JWT_LIFETIME  

## API so far
GET "/" - check route  

GET "/checkUser" - checks if the user is logged in 

POST "/api/v1/auth/register" - registers the user- body contains name, password (minimum 6 characters), email (syntactically valid email)  

POST "/api/v1/auth/login" - logs user in- body requires email and password  

GET "/api/v1/recipes" - gets recipe by query / requires authentication
  this is the 'search recipe' endpoint in the spoonacular docs  
  
GET "/api/v1/recipes/:id" - gets individual recipe by recipe id 
  this is the 'get recipe information' endpoint in the spoonacular docs

GET "/api/v1/recipe/list" - gets saved recipe list from DB  

POST "/api/v1/recipe/list" - saves recipe item to users profile in DB


