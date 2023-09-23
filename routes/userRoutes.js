const express = require("express")
const usersController = require("../controllers/usersController")
const fs = require("fs")

const router = express.Router()

router
  .route("/")
  .get(usersController.getAllUsers)
  .post(usersController.createUser)

router
  .route("/:id")
  .get(usersController.getUserById)
  .patch(usersController.editUser)
  .delete(usersController.removeUser)

module.exports = router
