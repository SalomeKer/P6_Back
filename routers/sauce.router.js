const express = require("express")

const {
	getSauces,
	createSauces,
	getSaucesById,
	deleteSauces,
	modifySauces,
	likeSauce
} = require("../controllers/sauces")

const { authenticateUser } = require("../middleware/auth")
const { upload } = require("../middleware/multer")
const sauceRouter = express.Router()


sauceRouter.get("/", authenticateUser, getSauces)
sauceRouter.post("/", authenticateUser, upload.single("image"), createSauces)
sauceRouter.get("/:id", authenticateUser, getSaucesById)
sauceRouter.delete("/:id", authenticateUser, deleteSauces)
sauceRouter.put("/:id", authenticateUser, upload.single("image"), modifySauces)
sauceRouter.post("/:id/like", authenticateUser, likeSauce)

module.exports = { sauceRouter }