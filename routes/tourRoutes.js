const express = require("express")
const toursController = require("../controllers/toursController")
const fs = require("fs")

const router = express.Router()

router.param("id", toursController.checkId)

router
  .route("/")
  .get(toursController.getAllTours)
  .post(toursController.createTour)

router
  .route("/:id")
  .get(toursController.getTourById)
  .patch(toursController.editTour)
  .delete(toursController.removeTour)

module.exports = router
