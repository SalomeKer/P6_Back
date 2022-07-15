const jwt = require("jsonwebtoken")
//On authentifie l'utilisateur 
function authenticateUser(req, res, next) { //next permet de passer à la prochaine fonction 
	console.log("Utilisateur authentifié")
	// on vérifie l'autorisation
	const header = req.header("Authorization")
	if (header == null) return res.status(403).send({
		message: "accès refusé "
	})
	
	const token = header.split(" ")[1]
	//Si le token est null
	if (token == null) return res.status(403).send({
		message: "Token est null"
	})
	// On vérifie si le token est valide
	jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded) => {
		if (err) return res.status(403).send({
			message: "Token invalide" + err
		})
		console.log("Le token est bien valide")
		next()
	})
}
module.exports = {
	authenticateUser
}

