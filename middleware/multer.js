const multer = require("multer")
const storage = multer.diskStorage({
	destination: "images/",
	//renommer les images (cb, callback?)
	filename: function(req, file, cb) {
		cb(null, makeFilename(req, file))
	}
})
//nom original de l'image
function makeFilename(req, file) {
	const fileName = `${Date.now()}-${file.originalname}`
	file.fileName = fileName //On rajoute le nom du fichier à la requête
	return fileName
}
const upload = multer({
	storage: storage
})
module.exports = { upload }