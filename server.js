const { app, express } = require("./index")
//Importation routers
const { sauceRouter} = require("./routers/sauce.router")
const { authRouter } = require("./routers/auth.router")
//Package bodyParser transformant les requêtes en JSON
const  bodyParser  = require("body-parser")
const port = 3000

//Definition des chemin 
const path = require("path")


//Connextion à Mongo/
require("./mongo")

//Transformer les requêtes en JSON
app.use(bodyParser.json())

//Gestion des routes principales
app.use("/api/sauces", sauceRouter)
app.use("/api/auth", authRouter)


app.get("/", (req, res) => res.send("hello world !"))

//Les fichiers du dossier sont maintenant accessibles+ rajout du nom de dossier dans l'url
// Changement du chemin relatif vers absolut 
app.use("/images", express.static(path.join(__dirname, "images")))

//Écoute 
app.listen(port, () => console.log("listening on port" + port))

