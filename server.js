const {app, express} = require ("./index")
const port = 3000
const path = require ("path")


//Connextion à Mongo/
require("./mongo")

//Connextion à Users
const {createUser, logUser} = require("./controllers/users")
const {getSauces, createSauces} = require("./controllers/sauces")

//Middleware
const { authenticateUser } = require("./middleware/auth")
const {upload} = require("./middleware/multer")


//Le formulaire (add sauce) est un multiparse/form-data, pour pouvoir lire les datas on utilise le middleware multer (appartenant à express)
// multer récupère le fichier 

//routes

//Création d'une requête n°1
app.post("/api/auth/signup", createUser)
app.post("/api/auth/login", logUser)
// on authentifie l'utilisateur puis on affiche les sauces  //*** authenticateUser est un middleware, il se loge entre la requête et la réponse
app.get("/api/sauces/", authenticateUser, getSauces)
app.post("/api/sauces/", authenticateUser, upload.single("image"),createSauces)
app.get("/", (req, res) => res.send("hello world !"))


//Les fichiers du dossier sont maintenant accessibles 
app.use("/images",express.static(path.join(__dirname,"images")))

//Écoute 
app.listen(port, ()=> console.log("listening on port" + port))
