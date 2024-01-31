const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const AudsSchema = new Schema({
    title: String,
  });

  module.exports = mongoose.model('Auds', AudsSchema)