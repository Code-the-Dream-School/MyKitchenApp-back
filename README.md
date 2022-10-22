# alpaca-albatross-practicum-team2-back

## Back End Repository
## configuration 
to run this program you need a .env file with   
MONGO_URI   
JWT_SECRET   
JWT_LIFETIME  

## API so far
"/" check route  
"/checkUser"  checks if the user is logged in  
"/api/v1/auth/register"  registers the user- body contains name, password (minimum 6 characters), email (syntactically valid email)  
"/api/v1/auth/login"  logs user in- body requires email and password  
