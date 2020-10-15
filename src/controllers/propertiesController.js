const People = require("../models/people");
const HttpError = require("../models/http-error");
const mongoose = require("mongoose");

const tradeItems = async (req, res, next) => {
  let user1;
  try {
    user1 = await People.findById(req.params.id);
  } catch (err) {
    const error = new HttpError(
      "Something wrong. Could not find the related survivor.",
      500
    );
    return next(error);
  }

  let user2;
  try {
    user2 = await People.findById(req.body.id);
  } catch (err) {
    const error = new HttpError(
      "Something wrong. Could not find the related survivor.",
      500
    );
    return next(error);
  }

  const newUser1Inventory = {
    water: user1.inventory.water - req.body.user1water + req.body.user2water,
    food: user1.inventory.food - req.body.user1food + req.body.user2food,
    firstAid:
      user1.inventory.firstAid -
      req.body.user1firstAid +
      req.body.user2firstAid,
    gun: user1.inventory.gun - req.body.user1gun + req.body.user2gun,
  };

  const newUser2Inventory = {
    water: user2.inventory.water - req.body.user2water + req.body.user1water,
    food: user2.inventory.food - req.body.user2food + req.body.user1food,
    firstAid:
      user2.inventory.firstAid -
      req.body.user2firstAid +
      req.body.user1firstAid,
    gun: user2.inventory.gun - req.body.user2gun + req.body.user1gun,
  };

  const sess = await mongoose.startSession();
  sess.startTransaction();

  //Updating user 1
  try {
    await People.findByIdAndUpdate(
      req.params.id,
      { inventory: newUser1Inventory },
      { useFindAndModify: false, session: sess }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something wrong. Could not update inventory.",
      500
    );
    return next(error);
  }

  //Updating user 2
  try {
    await People.findByIdAndUpdate(
      req.body.id,
      { inventory: newUser2Inventory },
      { useFindAndModify: false, session: sess }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something wrong. Could not update inventory.",
      500
    );
    return next(error);
  }
  await sess.commitTransaction();

  res.json({ message: "Trade successful." });
};

const getAllItems = async (req, res, next) => {
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
  res.json(person.inventory);
};

module.exports = { tradeItems, getAllItems };
