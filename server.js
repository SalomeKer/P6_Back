require('dotenv').config()
const express = require("express")
const app = express ()
const cors = require("cors")
const port = 3000

//Connextion à Mongo/
require("./mongo")

//Connextion à Users
const {createUser, logUser} = require("./controllers/users")
const {getSauces, createSauces, authenticateUser} = require("./controllers/sauces")

//Middleware
app.use(cors())
app.use(express.json())

//routes

//Création d'une requête n°1
app.post("/api/auth/signup", createUser)
app.post("/api/auth/login", logUser)
// on authentifie l'utilisateur puis on affiche les sauces  //*** authenticateUser est un middleware, il se loge entre la requête et la réponse
app.get("/api/sauces/", authenticateUser, getSauces)
app.post("/api/sauces/", createSauces)



app.get("/", (req, res) => res.send("hello world !"))

app.listen(port, ()=> console.log("listening on port" + port))
