const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  nombre: String
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const Unidad = mongoose.model("Unidad", userSchema);
module.exports = Unidad;
