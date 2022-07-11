const { app, express } = require("./index")
const { sauceRouter} = require("./routers/sauce.router")
const { authRouter } = require("./routers/auth.router")
const  bodyParser  = require("body-parser")
const port = 3000
const path = require("path")

//Connextion à Mongo/
require("./mongo")

//Middleware
app.use(bodyParser.json())
app.use("/api/sauces", sauceRouter)
app.use("/api/auth", authRouter)


app.get("/", (req, res) => res.send("hello world !"))

//Les fichiers du dossier sont maintenant accessibles 
app.use("/images", express.static(path.join(__dirname, "images")))

//Écoute 
app.listen(port, () => console.log("listening on port" + port))

