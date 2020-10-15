const People = require("../models/people");
const HttpError = require("../models/http-error");

const getInfected = async (req, res, next) => {
  let infectedPercentage;
  try {
    const infected = await People.find({ isInfected: true });
    const total = await People.find();
    infectedPercentage = ((infected.length / total.length) * 100).toFixed(2);
  } catch (err) {
    const error = new HttpError("Something wrong. Try Again.", 500);
    return next(error);
  }
  res.json({ infectedPercentage });
};

const getNonInfected = async (req, res, next) => {
  let nonInfectedPercentage;
  try {
    const nonInfected = await People.find({ isInfected: false });
    const total = await People.find();
    nonInfectedPercentage = ((nonInfected.length / total.length) * 100).toFixed(
      2
    );
  } catch (err) {
    const error = new HttpError("Something wrong. Try Again.", 500);
    return next(error);
  }
  res.json({ nonInfectedPercentage });
};

const getInventory = async (req, res, next) => {
  let averageItems;
  try {
    let waterTotal = 0;
    let foodTotal = 0;
    let firstAidTotal = 0;
    let gunTotal = 0;

    const survivors = await People.find({ isInfected: false });

    survivors.map((survivor) => {
      waterTotal += survivor.inventory.water;
      foodTotal += survivor.inventory.food;
      firstAidTotal += survivor.inventory.firstAid;
      gunTotal += survivor.inventory.gun;
    });

    const waterAverage = (waterTotal / survivors.length).toFixed(2);
    const foodAverage = (foodTotal / survivors.length).toFixed(2);
    const firstAidAverage = (firstAidTotal / survivors.length).toFixed(2);
    const gunAverage = (gunTotal / survivors.length).toFixed(2);

    averageItems = {
      water: waterAverage,
      food: foodAverage,
      firstAid: firstAidAverage,
      gun: gunAverage,
    };
  } catch (err) {
    const error = new HttpError("Something wrong. Try Again.", 500);
    return next(error);
  }
  res.json({ averageItems });
};

const getInfectedPoints = async (req, res, next) => {
  let infectedPoints = 0;
  try {
    const infected = await People.find({ isInfected: true });
    infected.map((person) => {
      infectedPoints += person.infectedPoints;
    });
  } catch (err) {
    const error = new HttpError("Something wrong. Try Again.", 500);
    return next(error);
  }
  if (!infectedPoints) {
    infectedPoints = 0;
  }
  res.json({ infectedPoints });
};

const getReports = async (req, res, next) => {
  const availableReports = [
    {
      api: "/api/report/infected",
      report: "Get average of infected people.",
    },
    {
      api: "/api/report/non-infected",
      report: "Get average of non-infected people.",
    },
    {
      api: "/api/report/people-inventory",
      report: "Get average of quantity of items per person.",
    },
    {
      api: "/api/report/infected",
      report: "Get total points lost in items that belong to infected people.",
    },
  ];
  res.json({ availableReports });
};

module.exports = {
  getInfected,
  getNonInfected,
  getInventory,
  getInfectedPoints,
  getReports,
};
