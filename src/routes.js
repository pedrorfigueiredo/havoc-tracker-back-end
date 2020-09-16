const express = require("express");
const router = express.Router();
const PeopleController = require("./controllers/peopleController");
const ReportController = require("./controllers/reportController");
const PropertiesController = require("./controllers/propertiesController");

router.post("/api/people", PeopleController.create);
router.get("/api/people", PeopleController.getAll);
router.get("/api/people/:id", PeopleController.getById);
router.patch("/api/people/:id", PeopleController.update);
router.post("/api/people/:id/report-infection", PeopleController.reportInfection);

router.post("/api/people/:id/properties/trade-item", PropertiesController.tradeItems);
router.get("/api/people/:id/properties", PropertiesController.getAllItems);

router.get("/api/report/infected", ReportController.getInfected);
router.get("/api/report/non-infected", ReportController.getNonInfected);
router.get("/api/report/people-inventory", ReportController.getInventory);
router.get("/api/report/infected-points", ReportController.getInfectedPoints);
router.get("/api/report", ReportController.getReports);

module.exports = router;