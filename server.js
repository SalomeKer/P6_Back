require('dotenv').config()
const express = require("express")
const app = express ()
const cors = require("cors")
const port = 3000

//Connextion à Mongo/
require("./mongo")

//Connextion à Users
const {createUser, logUser} = require("./controllers/users")


//Middleware
app.use(cors())
app.use(express.json())

//routes

//Création d'une requête n°1
app.post("/api/auth/signup", createUser)
app.post("/api/auth/login", logUser)


app.get("/", (req, res) => res.send("hello world !"))

app.listen(port, ()=> console.log("listening on port" + port))
