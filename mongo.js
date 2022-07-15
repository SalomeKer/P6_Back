const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')


const password = process.env.PASSWORD
const uri = `mongodb+srv://sk21:${password}@cluster0.lpkdg.mongodb.net/?retryWrites=true&w=majority`

mongoose
.connect(uri)
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


//Required unique true permet de refuser quelqu'un ayant le même email 
const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

userSchema.plugin(uniqueValidator)

const User = mongoose.model("User", userSchema)

module.exports = {mongoose, User}
