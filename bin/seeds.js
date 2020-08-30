require("dotenv").config();

const mongoose = require("mongoose");

const Tipo = require("../models/tipo");
const Unidad = require("../models/unidad");


mongoose
  .connect('mongodb://localhost/vehiculos', { useNewUrlParser: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });


let tipos = [
  {
    nombre: "BMR"
  },
  {
    nombre: "VEC"
  },
  {
    nombre: "Pizarro"
  },
  {
    nombre: "Centauro"
  },
  {
    nombre: "Leopard"
  },
  {
    nombre: "Leopardo"
  },
  {
    nombre: "RG-31"
  }
];

let unidades = [
  {
    nombre: "BIMT I/47"
  },
  {
    nombre: "BCZM I/64"
  },
  {
    nombre: "BCZM I/66"
  },
  {
    nombre: "GCAC I/4"
  },
  {
    nombre: "GCAC II/4"
  },
  {
    nombre: "GCLAC I/11"
  },
  {
    nombre: "GCLAC II/11"
  },
  {
    nombre: "BCG BRI I"
  },
  {
    nombre: "BICC I/4"
  },
  {
    nombre: "ACLOG"
  }
];


Tipo.deleteMany()
  .then(() => {
    return Tipo.create(tipos);
  })
  .then(tiposCreados => {
    console.log(`${tiposCreados.length} tipos de vehículo creados con los siguientes nombres:`);
    console.log(tiposCreados.map(tipo => tipo.nombre));
  })
  .then(() => {
    mongoose.disconnect();
  })
  .catch(err => {
    mongoose.disconnect();
    throw err;
  });

Unidad.deleteMany()
  .then(() => {
    return Unidad.create(unidades);
  })
  .then(unidadesCreadas => {
    console.log(`${unidadesCreadas.length} unidades creadas con los siguientes nombres:`);
    console.log(unidadesCreadas.map(unidad => unidad.nombre));
  })
  .then(() => {
    mongoose.disconnect();
  })
  .catch(err => {
    mongoose.disconnect();
    throw err;
  });
