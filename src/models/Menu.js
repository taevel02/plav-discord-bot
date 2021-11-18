const mongoose = require("mongoose");

const menuSchema = mongoose.Schema({
  menu: {
    type: String,
  },
});

const Menu = mongoose.model("Menu", menuSchema);

module.exports = { Menu };
