const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  descripcion: { type: String },
  observaciones: { type: String }
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const Tarea = mongoose.model("Tarea", userSchema);
module.exports = Tarea;
