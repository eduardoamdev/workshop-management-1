const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fechaEntrada: { type: String },
  fechaSalida: { type: String },
  orden: { type: String },
  sintomas: { type: String },
  tareas: [{ type: Schema.Types.ObjectId, ref: "Tarea" }],
  repuestos: [{ type: Schema.Types.ObjectId, ref: "Repuesto" }],
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const Ingreso = mongoose.model("Ingreso", userSchema);
module.exports = Ingreso;
