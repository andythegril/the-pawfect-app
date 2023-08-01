const mongoose = require ('mongoose');

const PetSchema = new mongoose.Schema({
    owner: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
    name: String,
    type: String,
    availableFor: String,
    gender: String,
    interestedGender: String,
    address: String,
    photos: [String],
    desc: String,
    matches: [String]
});

const PetModel = mongoose.model('Pet', PetSchema);

module.exports = PetModel;