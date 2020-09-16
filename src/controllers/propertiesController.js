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
    fijiWater: user1.inventory.fijiWater - req.body.user1FijiWater + req.body.user2FijiWater,
    campbellSoup: user1.inventory.campbellSoup - req.body.user1CampbellSoup + req.body.user2CampbellSoup,
    firstAidPouch: user1.inventory.firstAidPouch - req.body.user1FirstAidPouch + req.body.user2FirstAidPouch,
    ak47: user1.inventory.ak47 - req.body.user1Ak47 + req.body.user2Ak47,
  }

  const newUser2Inventory = {
    fijiWater: user2.inventory.fijiWater - req.body.user2FijiWater + req.body.user1FijiWater,
    campbellSoup: user2.inventory.campbellSoup - req.body.user2CampbellSoup + req.body.user1CampbellSoup,
    firstAidPouch: user2.inventory.firstAidPouch - req.body.user2FirstAidPouch + req.body.user1FirstAidPouch,
    ak47: user2.inventory.ak47 - req.body.user2Ak47 + req.body.user1Ak47,
  }
  
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
  };

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
  };
  await sess.commitTransaction();

  res.json({message: "Trade successful."});
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
