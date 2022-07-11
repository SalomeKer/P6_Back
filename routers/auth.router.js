const {createUser, logUser} = require("../controllers/users")

const express = require("express")
const authRouter = express.Router()

//Connextion à Users
authRouter.post("/signup", createUser)
authRouter.post("/login", logUser)


module.exports = {authRouter}
