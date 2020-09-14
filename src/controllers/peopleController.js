const People = require("../models/people");
const HttpError = require("../models/http-error");

const create = async (req, res, next) => {
  const people = new People({
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender,
    lastLocation: {
      lat: req.body.lastLocationLat,
      lng: req.body.lastLocationLng,
    },
    inventory: {
      fijiWater: req.body.fijiWater,
      campbellSoup: req.body.campbellSoup,
      firstAidPouch: req.body.firstAidPouch,
      ak47: req.body.ak47,
    },
    isInfected: false,
    marks: 0,
  });
  try {
    await people.save();
  } catch (err) {
    const error = new HttpError(
      "Something wrong. Could not create a survivor.",
      500
    );
    return next(error);
  }

  res.json(people);
};

const getAll = async (req, res, next) => {
  let people;
  try {
    people = await People.find();
  } catch (err) {
    const error = new HttpError(
      "Something wrong. Could not load survivors.",
      500
    );
    return next(error);
  }
  res.json(people);
};

const getById = async (req, res, next) => {
  let person;
  try {
    person = await People.findById(req.params.id);
  } catch (err) {
    const error = new HttpError(
      "Something wrong. Could not find the related survivor.",
      500
    );
    return next(error);
  }
  res.json(person);
};

const update = async (req, res, next) => {
  const lastLocation = {
    lat: req.body.lastLocationLat,
    lng: req.body.lastLocationLng,
  };
  let person;
  try {
    person = await People.findByIdAndUpdate(
      req.params.id,
      { lastLocation: lastLocation },
      { useFindAndModify: false }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something wrong. Could not find the related survivor.",
      500
    );
    return next(error);
  }
  res.json(person);
};

const reportInfection = async (req, res, next) => {
  const infectedPersonId = req.body.infectedPersonId;
  let person;
  try {
    person = await People.findById(req.params.id);
  } catch (err) {
    const error = new HttpError(
      "Something wrong. Could not find the related survivor.",
      500
    );
    return next(error);
  }
  res.json(person);
};

module.exports = { create, getAll, getById, update, reportInfection };
