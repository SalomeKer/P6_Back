const jwt = require("jsonwebtoken")
const mongoose = require ("mongoose")
const productShema = new mongoose.Schema({
userId: String,
name : String,
manufacturer : String,
description : String,
mainPepper : String,
imageUrl : String,
heat : Number,
likes : Number,
dislikes : Number,
usersLiked : [String],
usersDisliked: [String]
})

const Product = mongoose.model("product", productShema)

//On authentifie l'utilisateur 
function authenticateUser (req, res, next){  //next permet de passer à la prochaine fonction 
   // on vérifie l'autorisation
  const header = req.header("Authorization")
   
  if (header==null) return res.status(403).send({message: "Invalid"})
  
  //Si le token est null
  const token = header.split(" ")[1]
   if (token == null)return res.status(403).send({message: "Token cannot be null"})
  
   // On vérifie si le token est valide
   jwt.verify(token,process.env.JWT_PASSWORD, (err, decoded) => {
     if (err) return res.status(403).send({message: "Token invalide" + err})
     next()
   })
}
//Si l'utilisateur est authentifié on enchaine sur cette fonction
function getSauces(req, res){
    console.log("le token à bien été validé !, nous somme dans getSauces")
        //console.log("Token valide", decoded)
        Product.find({}).then(products => res.send(products))
        //res.send ({message: "ok voici tout les plats"})
}


function createSauces(req, res){
   const product = new Product({ 
    userId: "pouet",
    name : "pouet",
    manufacturer : "pouet",
    description : "pouet",
    mainPepper : "pouet",
    imageUrl : "pouet",
    heat : 2,
    likes : 2,
    dislikes : 2,
    usersLiked : ["pouet"],
    usersDisliked: ["pouet"]
 })
 product.save().then((res) => console.log("produit enregistré", res)).catch(console.error)
}

module.exports = { getSauces, createSauces, authenticateUser }