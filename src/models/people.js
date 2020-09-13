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
    fijiWater: {type: Number, required: true, max: 100},
    campbellSoup: {type: Number, required: true, max: 100},
    firstAidPouch: {type: Number, required: true, max: 100},
    ak47: {type: Number, required: true, max: 100},
  },
  isInfected: {type: Boolean, require: true},
  marks: {type: Number, required: true, min: 0}
});

module.exports = mongoose.model("People", peopleSchema);