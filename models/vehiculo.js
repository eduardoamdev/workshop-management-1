const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  matricula: String,
  tipo: {
    type: String,
  },
  unidad: {
    type: String,
  },
  ingresos: [{ type: Schema.Types.ObjectId, ref: "Ingreso" }],
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const Vehiculo = mongoose.model("Vehiculo", userSchema);
module.exports = Vehiculo;
