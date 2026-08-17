
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const citySchema = new Schema(
  {
    index: Number,
    country: String,
    name: String,
    lat: Number,
    lng: Number,
    normalized_name: String,
    // add more fields depending on your Excel columns
  },
  {
    collection: "cities",
    versionKey: false
  }
);

const Citie = mongoose.model('Citie', citySchema) 

// export default mongoose.model('Citie', citySchema);
module.exports = Citie;
