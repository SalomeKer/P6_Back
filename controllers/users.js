//connexion à mongo
const { User } = require("../mongo") //On cible User avec des accolades car require renvoie un objet avec deux clefs
//librairie de haching
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

async function createUser(req, res){

    try{
        
        const {email, password} = req.body
        //hachage du mot de passe
        const hashedPassword = await hashPassword(password)
        
        const user = new User ({email, password: hashedPassword})
        
        //Création d'un nouvel utilisateur à mettre en base de données 
        user
        .save()
        .then(() => res.status(201).send({message: "utilisateur enregistré !"}))
    } catch (err) {
        res.status(409).send({ message: "User pas enregistré :" + err })
      }
    }

        function hashPassword(password){
            //nombre de chiffrage
            const saltRounds = 10;
            return bcrypt.hash(password, saltRounds)
        }

        async function logUser(req, res){
        try {    

            const email = req.body.email
            const password = req.body.password
            const user = await User.findOne({email: email})
        
        
            const isPasswordOk = await bcrypt.compare(password, user.password)
            if (!isPasswordOk){
                return res.status(403).send({ message: "mot de passe incorrect"})
            }
            const token = createToken(email)
            res.status(200).send({userId: user?._id, token: token})
        } catch (err) {
            console.error(err)
            res.status(500).send({ message: "Erreur interne" })
          }
        }
        
        
        function createToken(email){
            const jwtPassword = process.env.JWT_PASSWORD
            return jwt.sign({email: email}, jwtPassword ,{expiresIn: "24h"})
        }
        
       module.exports = { createUser, logUser}


