![alt text](/MyKitchenLogo.png)
# alpaca-albatross-practicum-team2-back

## Back End Repository
## configuration 
to run this program you need a .env file with   
MONGO_URI   
JWT_SECRET   
JWT_LIFETIME  

## Front End Submodule
To access the front-end submodule- 
  cd into the submodule
  first command is 'git submodule init' (only for new/first time user)  
  next command is to cd into the back end and run 'git submodule update --remote' on the main route
  
## API so far
GET "/" - check route  

GET "/checkUser" - checks if the user is logged in 

POST "/api/v1/auth/register" - registers the user- body contains name, password (minimum 6 characters), email (syntactically valid email) and returns  
{
    "user": {
        "name": "....."
    },
    "token": "..."
}  

POST "/api/v1/auth/login" - logs user in- body requires email and password  

GET "/api/v1/recipes" - gets recipe by query / requires authentication
  this is the 'search recipe' endpoint in the spoonacular docs  
  
GET "/api/v1/recipes/:id" - gets individual recipe by recipe id 
  this is the 'get recipe information' endpoint in the spoonacular docs

GET "/api/v1/recipes/list" - gets saved recipe list from DB  

POST "/api/v1/recipes/list" - saves recipe item to users profile in DB 
This is an example of what should be in the POST body...

{
"recipeId": 511728,
"title": "Pasta Margherita",
"image": "https://spoonacular.com/recipeImages/511728-312x231.jpg",
"imageType": "jpg"
}

DELETE "/api/v1/recipes/:id" - deletes recipe from saved list  

GET "/api/v1/recipes" - gets a random recipe. takes in a 
number 1-100 for how many recipes are returned and also takes in a string
can be any of these options - diets, meal types, cuisines, or intolerances

DELETE "/api/v1/auth/remove" - removes active user from DB.






PATCH "/api/v1/auth/changePassword" - lets a user change the password stored within our DB to a new PW
required fields are password (the old one), newPassword (the new one)
returns a message "password changed" on success
returns 'please provide password and new password' or 'invalid credentials' on failure

GET "/api/v1/recipes/random" - gets a randomly generated recipe. always the same for a given day. Do not put 
in an option for query.




