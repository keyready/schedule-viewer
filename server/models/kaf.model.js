const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const KafsSchema = new mongoose.Schema({
    title: String,
    audsIds: [{
        type: Schema.Types.ObjectId, 
        ref: 'Auds'
    }]
  });

  module.exports = mongoose.model('Kafs', KafsSchema)