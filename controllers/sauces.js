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

//Si l'utilisateur est authentifié on enchaine sur cette fonction
function getSauces(req, res){
    console.log("le token à bien été validé !, nous somme dans getSauces")
        //console.log("Token valide", decoded)

             //Product.deleteMany({}) ***supprime les produits de la base de données***

         Product.find({}).then(products => res.send(products))
        //res.send ({message: "ok voici tout les plats"})
}


function createSauces(req, res){
   const body = req.body
   const file = req.file
   console.log({file})
   const {fileName} = file

   const sauce = JSON.parse(body.sauce)

   const {name, manufacturer, description, mainPepper, heat, userId} = sauce

   function makeImageUrl(req, fileName){
       return req.protocol + "://" + req.get("host") + "/images/" + fileName
   }

   const product = new Product({ 
    userId,
    name,
    manufacturer,
    description,
    mainPepper,
    imageUrl: makeImageUrl(req, fileName),
    heat,
    likes : 0,
    dislikes : 0,
    usersLiked : [],
    usersDisliked: []
 })
 product.save()
 .then((res) => console.log("produit enregistré", res))
 .catch(console.error)
}

module.exports = { getSauces, createSauces}