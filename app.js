require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');
const path = require('path');


const app = express();


mongoose
  .connect('mongodb://localhost/vehiculos', { useNewUrlParser: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));


const portada = require('./routes/portada');
app.use('/', portada);
const vehiculo = require('./routes/vehiculos/vehiculo');
app.use('/', vehiculo);
const ingreso = require('./routes/vehiculos/ingreso');
app.use('/', ingreso);
const tarea = require('./routes/vehiculos/tarea');
app.use('/', tarea);
const repuesto = require('./routes/vehiculos/repuesto');
app.use('/', repuesto);


module.exports = app;
