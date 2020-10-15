const People = require("../models/people");
const HttpError = require("../models/http-error");
const price = require("../models/price");
const mongoose = require("mongoose");

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
      water: req.body.water,
      food: req.body.food,
      firstAid: req.body.firstAid,
      gun: req.body.gun,
    },
    isInfected: false,
    flags: 0,
    survivorsFlagged: [],
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
  const sess = await mongoose.startSession();
  sess.startTransaction();
  let infected;
  try {
    infected = await People.findOne({ name: req.body.infected }, null, {
      session: sess,
    });
    if (!infected) {
      const error = new HttpError(
        "Something wrong. Could not find the related survivor.",
        500
      );
      return next(error);
    }

    const informer = await People.findById(req.params.id, null, {
      session: sess,
    });
    if (informer.isInfected) {
      const error = new HttpError(
        "You are infected. You can't flag anyone. Sorry.",
        500
      );
      return next(error);
    }

    let survivorsFlagged = informer.survivorsFlagged;
    if (survivorsFlagged.indexOf(infected._id) != -1) {
      const error = new HttpError(
        "You can only flag the same person one time.",
        500
      );
      return next(error);
    }
    survivorsFlagged.push(infected._id);
    await People.findByIdAndUpdate(
      req.params.id,
      { survivorsFlagged },
      { useFindAndModify: false, session: sess }
    );

    let flags = infected.flags;
    flags++;
    await People.findByIdAndUpdate(
      infected._id,
      { flags },
      { useFindAndModify: false, session: sess }
    );

    if (flags >= 5) {
      const infectedPoints =
        infected.inventory.water * price.water +
        infected.inventory.food * price.food +
        infected.inventory.firstAid * price.firstAid +
        infected.inventory.gun * price.gun;

      informer.inventory.water += infected.inventory.water;
      informer.inventory.food += infected.inventory.food;
      informer.inventory.firstAid += infected.inventory.firstAid;
      informer.inventory.gun += infected.inventory.gun;

      infected.inventory.water = 0;
      infected.inventory.food = 0;
      infected.inventory.firstAid = 0;
      infected.inventory.gun = 0;

      await People.findByIdAndUpdate(
        infected._id,
        { isInfected: true, inventory: infected.inventory, infectedPoints },
        { useFindAndModify: false, session: sess }
      );

      await People.findByIdAndUpdate(
        informer._id,
        { inventory: informer.inventory },
        { useFindAndModify: false, session: sess }
      );
    }

    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something wrong. Try again.", 500);
    return next(error);
  }
  res.json({ message: "Success!" });
};

module.exports = { create, getAll, getById, update, reportInfection };
