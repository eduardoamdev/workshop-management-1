const express = require('express');
const router = express.Router();

const Ingreso = require("../../models/ingreso");
const Tarea = require("../../models/tarea");

const expresionRegularDescripcion = /./;

router.get('/mostrarTareas/:idIngreso', (req, res) => {
  let idIngreso = req.params.idIngreso;
  Ingreso.findById(idIngreso)
    .then((ingresoEncontrado) => {
      let ingreso = ingresoEncontrado;
      let idsTareas = ingreso.tareas;
      Tarea.find()
        .then((tareasTotalesEncontradas) => {
          let tareasTotales = tareasTotalesEncontradas;
          let tareas = [];
          tareas = tareasTotales.filter((tarea) => {
            return idsTareas.includes(tarea._id);
          })
          res.render('vehiculos/infoTareas', { ingreso, tareas });
        })
    })
})

router.get('/infoTarea/:idTarea', (req, res) => {
  let idTarea = req.params.idTarea;
  Tarea.findById(idTarea)
    .then((tareaEncontrada) => {
      let tarea = tareaEncontrada;
      Ingreso.find()
        .then((totalIngresos) => {
          let ingresoElegido = [];
          let ingreso = {};
          ingresoElegido = totalIngresos.filter((unIngreso) => {
            return unIngreso.tareas.includes(idTarea);
          })
          ingreso = ingresoElegido[0];
          res.render('vehiculos/infoTarea', { tarea, ingreso });
        })
    })
})

router.get('/nuevaTarea/:idIngreso', (req, res) => {
  let idIngreso = req.params.idIngreso;
  res.render('vehiculos/nuevaTarea', { idIngreso });
})

router.post('/nuevaTarea/:idIngreso', (req, res) => {
  let idIngreso = req.params.idIngreso;
  let descripcionTarea = req.body.descripcion;
  let observacionesTarea = req.body.observaciones;
  if (expresionRegularDescripcion.test(descripcionTarea)) {
    Tarea.create({
      descripcion: descripcionTarea,
      observaciones: observacionesTarea
    })
      .then((tarea) => {
        let nuevaTarea = tarea;
        Ingreso.findByIdAndUpdate(idIngreso,
          { $push: { tareas: nuevaTarea } })
          .then((ingresoSinActualizar) => {
            Ingreso.findById(idIngreso)
              .then((ingresoEncontrado) => {
                let ingreso = ingresoEncontrado;
                let idsTareas = ingreso.tareas;
                Tarea.find()
                  .then((tareasTotalesEncontradas) => {
                    let tareasTotales = tareasTotalesEncontradas;
                    let tareas = [];
                    tareas = tareasTotales.filter((tarea) => {
                      return idsTareas.includes(tarea._id);
                    })
                    res.render('vehiculos/infoTareas', { ingreso, tareas });
                  })
              })
          })
      })
  } else {
    res.render('vehiculos/nuevaTarea', {
      idIngreso,
      message: "Es obligatorio rellenar la descripción de la tarea."
    })
  }
});

router.get('/actualizarTarea/:idTarea', (req, res) => {
  let idTarea = req.params.idTarea;
  Tarea.findById(idTarea)
    .then((tareaEncontrada) => {
      let tarea = tareaEncontrada;
      res.render('vehiculos/actualizarTarea', { tarea });
    })
})

router.post("/actualizarTarea/:idTarea", (req, res) => {
  let idTarea = req.params.idTarea;
  let descripcionTarea = req.body.descripcion;
  let observacionesTarea = req.body.observaciones;
  if (expresionRegularDescripcion.test(descripcionTarea)) {
    Tarea.findByIdAndUpdate(idTarea, {
      descripcion: descripcionTarea,
      observaciones: observacionesTarea
    })
      .then((tareaSinActualizar) => {
        let idTareaSinActualizar = tareaSinActualizar._id;
        Tarea.findById(idTareaSinActualizar)
          .then((tareaEncontrada) => {
            let tarea = tareaEncontrada;
            Ingreso.find()
              .then((totalIngresos) => {
                let ingresos = totalIngresos;
                let arrayConIngreso = [];
                let ingreso = {};
                arrayConIngreso = ingresos.filter((unIngreso) => {
                  return unIngreso.tareas.includes(tarea._id);
                })
                ingreso = arrayConIngreso[0];
                res.render('vehiculos/infoTarea', { tarea, ingreso });
              })
          })
      })
  } else {
    Tarea.findById(idTarea)
      .then((tareaEncontrada) => {
        let tarea = tareaEncontrada;
        res.render('vehiculos/actualizarTarea', {
          tarea,
          message: "Es obligatorio rellenar la descripción de la tarea."
        })
      })
  }
})

router.get('/confirmacionBorradoTarea/:idTarea', (req, res) => {
  let idTarea = req.params.idTarea;
  Tarea.findById(idTarea)
    .then((tareaEncontrada) => {
      let tarea = tareaEncontrada;
      res.render("vehiculos/confirmacionBorrado", { tarea });
    })
})

router.get("/borrarTarea/:idTarea", (req, res) => {
  let idTarea = req.params.idTarea;
  Tarea.findByIdAndDelete(idTarea)
    .then((tareaEliminada) => {
      Ingreso.find()
        .then((totalIngresos) => {
          let ingresos = totalIngresos;
          let arrayIngresoSeleccionado = [];
          let ingresoSeleccionado = {};
          let idIngreso = "";
          arrayIngresoSeleccionado = ingresos.filter((unIngreso) => {
            return unIngreso.tareas.includes(idTarea);
          })
          ingresoSeleccionado = arrayIngresoSeleccionado[0];
          idIngreso = ingresoSeleccionado._id;
          Ingreso.findById(idIngreso)
            .then((ingresoEncontrado) => {
              let ingreso = ingresoEncontrado;
              let idsTareas = ingresoEncontrado.tareas;
              idsTareas = idsTareas.filter((id) => {
                return id != idTarea;
              })
              Ingreso.findByIdAndUpdate(idIngreso, {
                tareas: idsTareas
              })
                .then((ingresoSinActualizar) => {
                  res.render('vehiculos/borradoConExito', { ingreso });
                })
            })
        })
    })
})

module.exports = router;
