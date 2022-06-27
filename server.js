require('dotenv').config()
const express = require("express")
const app = express ()
const cors = require("cors")
const port = 3000
const multer = require ("multer")

const storage = multer.diskStorage({
    destination: "images/",
    
    //renommer les images (cb, callback?)
    filename: function (req, file, cb) {
        cb(null, makeFilename(req, file))
    }
})

//nom original de l'image
function makeFilename(req,file){
    const fileName = `${Date.now()}-${file.originalname}`
    file.fileName = fileName //On rajoute le nom du fichier à la requête
    return fileName 
}


const upload = multer({storage: storage})

//Connextion à Mongo/
require("./mongo")

//Connextion à Users
const {createUser, logUser} = require("./controllers/users")
const {getSauces, createSauces} = require("./controllers/sauces")

//Middleware
app.use(cors())
app.use(express.json())

const { authenticateUser } = require("./middleware/auth")

//Le formulaire (add sauce) est un multiparse/form-data, pour pouvoir lire les datas ont utilise le middleware multer (appartenant à express)
// multer récupère le fichier 

//routes

//Création d'une requête n°1
app.post("/api/auth/signup", createUser)
app.post("/api/auth/login", logUser)
// on authentifie l'utilisateur puis on affiche les sauces  //*** authenticateUser est un middleware, il se loge entre la requête et la réponse
app.get("/api/sauces/", authenticateUser, getSauces)
app.post("/api/sauces/", authenticateUser, upload.single("image"),createSauces)
app.get("/", (req, res) => res.send("hello world !"))


//Écoute 
app.listen(port, ()=> console.log("listening on port" + port))
