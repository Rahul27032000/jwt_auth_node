# Todo API with Authentication

**How to use**

```
git clone git@github.com:Rahul27032000/jwt_auth_node.git
cd jwt_auth_node
npm install
```

now you have to create one filed named .env

```
PORT = 3000
MONGO_USER = YourMongoUser
MONGO_PASS = YourMongoPassword

ACCESS_TOKEN ='your access token key'
REFRESH_TOKEN ='your refresh token key'


```

you have to put your own data in above code
you can generate secret key with

```
node
require("crypto").randomBytes(64).toString("hex")
```

**Technology used**

- Express -> Express is a Node.js web application framework that provides a set of features and tools for building web applications, such as routing, middleware, and templating.

- Mongoose -> Mongoose is an Object Data Modeling (ODM) library for MongoDB and is used to define schemas and models for MongoDB documents, making it easier to work with MongoDB in a Node.js application.

- Nodemon-> Nodemon is a tool that monitors changes in the source code of a Node.js application and automatically restarts the server when changes are detected, making the development process faster and more efficient.

- Dotenv ->Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env, making it easier to manage environment-specific configuration in a Node.js application.

- jsonwebtoken -> Jsonwebtoken is a Node.js module that allows for the generation and verification of JSON Web Tokens (JWTs), which are used for secure transmission of information between parties in a web application.

- bcrypt -> Bcrypt is a Node.js module that provides password hashing and comparison functionalities, making it easier to securely store and verify passwords in a web application.

| Endpoint  | Method | Description                                                               |
| --------- | ------ | ------------------------------------------------------------------------- |
| /register | POST   | Register a new user with provided email and password.                     |
| /login    | POST   | Authenticate user credentials and return a JWT token for future requests. |
| /Token    | POST   | Generate new access token from by taking refresh token.                   |
