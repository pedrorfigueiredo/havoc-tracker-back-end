const express = require("express");
const router = express.Router();
const PeopleController = require("./controllers/peopleController");

router.post("/api/people", PeopleController.create);
router.get("/api/people", PeopleController.getAll);
router.get("/api/people/:id", PeopleController.getById);
router.patch("/api/people/:id", PeopleController.update);
router.post("/api/people/:id/report-infection", PeopleController.reportInfection);

module.exports = router;