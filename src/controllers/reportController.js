const People = require("../models/people");
const HttpError = require("../models/http-error");

const getInfected = async (req, res, next) => {
  let infectedPercentage;
  try {
    const infected = await People.find({isInfected: true});
    const total = await People.find();
    infectedPercentage = (infected.length/total.length * 100).toFixed(2);
  } catch(err) {
    const error = new HttpError(
      "Something wrong. Try Again.",
      500
    );
    return next(error);
  }
  res.json({infectedPercentage});
}

const getNonInfected = async (req, res, next) => {
  let nonInfectedPercentage;
  try {
    const nonInfected = await People.find({isInfected: false});
    const total = await People.find();
    nonInfectedPercentage = (nonInfected.length/total.length * 100).toFixed(2);
  } catch(err) {
    const error = new HttpError(
      "Something wrong. Try Again.",
      500
    );
    return next(error);
  }
  res.json({nonInfectedPercentage});
}

const getInventory = async (req, res, next) => {
  let averageItems;
  try {
    let fijiWaterTotal = 0;
    let campbellSoupTotal = 0;
    let firstAidPouchTotal = 0;
    let ak47Total = 0;

    const survivors = await People.find({isInfected: false});

    survivors.map(survivor => {
      fijiWaterTotal += survivor.inventory.fijiWater;
      campbellSoupTotal += survivor.inventory.campbellSoup;
      firstAidPouchTotal += survivor.inventory.firstAidPouch;
      ak47Total += survivor.inventory.ak47;
    });

    const fijiWaterAverage = (fijiWaterTotal/survivors.length).toFixed(2);
    const campbellSoupAverage = (campbellSoupTotal/survivors.length).toFixed(2);
    const firstAidPouchAverage = (firstAidPouchTotal/survivors.length).toFixed(2);
    const ak47Average = (ak47Total/survivors.length).toFixed(2);

    averageItems = {
      fijiWater: fijiWaterAverage,
      campbellSoup: campbellSoupAverage,
      firstAidPouch: firstAidPouchAverage,
      ak47: ak47Average
    }

  } catch(err) {
    const error = new HttpError(
      "Something wrong. Try Again.",
      500
    );
    return next(error);
  }
  res.json({averageItems})
}

const getInfectedPoints = async (req, res, next) => {
  let infectedPoints = 0;
  try {
    const infected = await People.find({isInfected: true});
    infected.map(person => {
      infectedPoints += person.infectedPoints;
    });
  } catch(err) {
    const error = new HttpError(
      "Something wrong. Try Again.",
      500
    );
    return next(error);
  }
  if(!infectedPoints) {
    infectedPoints = 0;
  }
  res.json({infectedPoints})
}

const getReports = async (req, res, next) => {
  const availableReports = [
      {
        api: "/api/report/infected",
        report: "Get average of infected people."
      },
      {
        api: "/api/report/non-infected",
        report: "Get average of non-infected people."
      },
      {
        api: "/api/report/people-inventory",
        report: "Get average of quantity of items per person."
      },
      {
        api: "/api/report/infected",
        report: "Get total points lost in items that belong to infected people."
      },
    ];
  res.json({availableReports})
}

module.exports = {getInfected, getNonInfected, getInventory, getInfectedPoints, getReports};