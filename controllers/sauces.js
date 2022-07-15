const mongoose = require ("mongoose")
const { unlink } = require("fs/promises")

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
function getSauces(req, res) {
  Product.find({})
    .then((products) => res.send(products))
    .catch((error) => res.status(500).send(error))
}

function getSauce (req, res){
  const { id } = req.params
  return Product.findById(id)
  
}

//Récuperer/isoler une sauce 
function getSaucesById(req, res){
    getSauce(req,res)
    .then((product) => sendClientResponse(product, res))
    .catch((err) => res.status(500).send(err))
}

function deleteSauces (req, res){
  const { id } = req.params
  Product.findByIdAndDelete(id)
   .then((product) => sendClientResponse(product, res))
   .then ((item) => deleteImage(item))
   .then((res) => console.log("Fichier supprimé", res))
   .catch((err) => res.status(500).send({ message: err }))
}

function modifySauces(req, res){
    const {
      params: {id}
    } = req
        
    //Une nouvelle image a-t-elle était ajoutée ? Si il y a une image, hasNewImage est sera égale a TRUE.
    const hasNewImage = req.file != null

    const payload = makePayload(hasNewImage, req)

    
    //Les infos sont modifiés
    Product.findByIdAndUpdate(id,payload)
    .then((dbresponse) => sendClientResponse(dbresponse, res))
    .then ((product) => deleteImage(product))
    .then((res) => console.log("Fichier supprimé", res))
    //Les infos sont actualisées
    .catch((err) => console.error("PROBLEME", err))
}

function deleteImage(product){
  if (product == null) return
  console.log("IMAGE SUPPRIMÉE", product)
  const imageToDelete = product.imageUrl.split("/").at(-1)
  return unlink("images/"+ imageToDelete)
}

function makePayload(hasNewImage, req){
    console.log("hasNewImage:", hasNewImage)
    //S'il n'y a pas de nouvelle image (!) on renvoie le body tel quel
    if (!hasNewImage) return req.body
    //Payload correspond à la nouvelle image à gerer
    const payload = JSON.parse(req.body.sauce)
    //On récupère la bonne url
    payload.imageUrl = makeImageUrl(req, req.file.fileName)
    console.log("NOUVELLE IMAGE A GERER")
    console.log("Voici le payload:", payload)
    return payload
}

function sendClientResponse(product,res){
   if (product == null){
    console.log("Les informations sont déja à jour")
    return res.status(404).send({ message: "Les informations sont déja à jour" })
  }
  console.log("ALL GOOD:", product)
  return Promise.resolve(res.status(200).send(product)).then(() => product) //Le produit trouvé dans la base de donnée est renvoyé
}
//makeImageUrl l'url valide de l'image
  function makeImageUrl(req, fileName){
  return req.protocol + "://" + req.get("host") + "/images/" + fileName
}



  function createSauces(req, res){
   const { body, file } = req
   const { fileName } = file
   const sauce = JSON.parse(body.sauce)
   const {name, manufacturer, description, mainPepper, heat, userId} = sauce

  const product = new Product({ 
    userId: userId,
    name: name,
    manufacturer: manufacturer,
    description: description,
    mainPepper: mainPepper,
    imageUrl: makeImageUrl(req, fileName),
    heat: heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
 })
 product
  .save()
  .then((message) => res.status(201).send({ message }))
  .catch((err) => res.status(500).send(err))
}

///LIKE SAUCE /////

function likeSauce(req, res){
const {like, userId} = req.body
//ON vérifie si la valeur du like est bien égale a 1, -1 ou 0 dans le cas contraire (!=) on stop
 if(![1, -1, 0].includes(like))return res.status(403).send({message: "Valeur de Like Invalide"})
//Aray include permet de verifier les elements inclus


getSauce(req, res)
 //On récupère les information (like/dislike et utilisateur)
 .then((product) => updateVote(product, like, userId))
 .then(pr => pr.save())
 .then(prod => sendClientResponse (prod,res))
 .catch((err) => res.status(500).send(err))
 //On gère le cas d'erreur 
}

//ON update les likes/dislike
function updateVote(product, like, userId, res){
   if (like === 1  || like === -1 ) return incrementVote(product, userId, like)
   return resetVote(product, userId, res)
}

function resetVote(product, userId, res){
   const { usersDisliked, usersLiked } = product
   if ([usersLiked, usersDisliked].every((arr) => arr.includes(userId))) 
   return Promise.reject("Problème vote")

   if (![usersLiked, usersDisliked].some((arr) => arr.includes(userId))) 
   return Promise.reject("l'utilisateur n'a pas voté..")

    
  if (usersLiked.includes(userId)){
    --product.likes 
    product.usersLiked = product.usersLiked.filter(id => id !== userId)
  } else{
    --product.dislikes 
    product.usersLiked = product.usersDisliked.filter(id => id !== userId)
  }
  return product
}

function incrementVote(product, userId, like){
  let { usersLiked, usersDisliked } = product
  //On définit l'array ciblé, Si like est égale à 1 c'est qu'on cherche a pusher dans usersLikes sinon c'est qu"on cherche a pusher dans usersDisliked (technique = ternary operator, permet de verifier selon une condition)
  const voterArray = like === 1 ? usersLiked : usersDisliked
  //Si l'id est déja present dans l'array on n'update rien , dans le cas contraire on push
  if (voterArray.includes(userId))return product
  voterArray.push(userId)

like === 1 ? ++product.likes : ++product.dislikes
return product
}



module.exports = { getSauces, createSauces,getSaucesById, deleteSauces, modifySauces, likeSauce }