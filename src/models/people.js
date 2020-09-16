const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const peopleSchema = new Schema({
  name: {type: String, required: true, maxlength: 50},
  age: {type: Number, required: true, min: 1, max: 150},
  gender: {type: String, required: true},
  lastLocation: {
    lat: {type: Number, required: true, min: 0, max: 150},
    lng: {type: Number, required: true, min: 0, max: 150}
  },
  inventory: {
    fijiWater: {type: Number, required: true, min: 0},
    campbellSoup: {type: Number, required: true, min: 0},
    firstAidPouch: {type: Number, required: true, min: 0},
    ak47: {type: Number, required: true, min: 0},
  },
  isInfected: {type: Boolean, required: true},
  flags: {type: Number, required: true, min: 0},
  survivorsFlagged: [{type: String, required: true}],
  infectedPoints: {type: Number}
});

module.exports = mongoose.model("People", peopleSchema);