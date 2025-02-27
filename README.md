------------------------- React Native Android App Backend API  ------------------------------

Project Name : react-app-backend-api

----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------

# Common Details
NODE_ENV=development
PORT=8080

# Database Configurations Local Server
DBHost="localhost"
DBUser="9a35d9e0c4d17b2884ed895a678c373a"
DBPassword="1af1dd38541cdefe9d91315ab630bc04"
DBName="3f19f71dc7daf61108df1aa2fe557287"

# Database Configurations Live Server
DBHost="aws-shreebalajigausamiti-rds.ckabekhotzes.ap-south-1.rds.amazonaws.com"
DBUser="f0e1a8b848d8faa9a363b3974f1bad44"
DBPassword="128270f2e8ea24693feca1d2ed88e263"
DBName="3f19f71dc7daf61108df1aa2fe557287"

# Encrypt & Decrypt Data
Key="e131c3a7ea92632c7b04c5c468350d92fd75ac60b0cd9b00f954f1e0073010ae"
Iv="879e6a995ea260051dd4134b38e5dc19"


----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------

Encrypt & Decrypt Data

# To Generate Key & Iv
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

# Encrypt Database Details
const DBUser = encryptdecrypt.encrypt("root");
const DBPassword = encryptdecrypt.encrypt("");
const DBName = encryptdecrypt.encrypt("node-api-demo");

# Decrypt Database Details
const DBHost = process.env.DBHost;
const DBUser = encryptdecrypt.decrypt(process.env.DBUser);
const DBPassword = encryptdecrypt.decrypt(process.env.DBPassword);
const DBName = encryptdecrypt.decrypt(process.env.DBName);

----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------

Run The Node Js App Using PM2 :

Command => pm2 start server.js --name "react-app-backend-api"

Reference Link : https://riptutorial.com/node-js/example/21325/deployment-using-pm2

----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------
