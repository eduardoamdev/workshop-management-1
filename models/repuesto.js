const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fechaSolicitud: { type: String },
  nombre: { type: String },
  noc: { type: String }
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const Repuesto = mongoose.model("Repuesto", userSchema);
module.exports = Repuesto;
