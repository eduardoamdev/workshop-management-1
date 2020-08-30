const express = require('express');
const router = express.Router();

const Vehiculo = require("../../models/vehiculo");
const Ingreso = require("../../models/ingreso");
const Tarea = require("../../models/tarea");
const Repuesto = require("../../models/repuesto");

const expresionRegularFecha = /\d\d\d\d\-\d\d\-\d\d$/;
const expresionRegularOrden =
  /\d\d\d\d\d\d\d\d\-\d\d\d\d\-\d\w\-\d\d\d\d\d$/;
const expresionRegularSintomas = /./;

router.get("/mostrarIngresos/:idVehiculo", (req, res) => {
  let idVehiculo = req.params.idVehiculo;
  Vehiculo.findById(idVehiculo)
    .then((vehiculoAConsultar) => {
      let vehiculo = vehiculoAConsultar;
      let listaIngresos = vehiculoAConsultar.ingresos;
      Ingreso.find()
        .then((ingresos) => {
          let totalIngresos = ingresos;
          let ingresosVehiculo = [];
          ingresosVehiculo = totalIngresos.filter((ingreso) =>
            listaIngresos.includes(ingreso._id));
          ingresosVehiculo.sort((a, b) => {
            return new Date(b.fechaEntrada) - new Date(a.fechaEntrada);
          })
          res.render("vehiculos/infoIngresos",
            {
              ingresosVehiculo,
              vehiculo
            }
          );
        })
    })
})

router.get("/infoIngreso/:idIngreso", (req, res) => {
  let idIngreso = req.params.idIngreso;
  Vehiculo.find()
    .then((vehiculosEncontrados) => {
      let vehiculos = vehiculosEncontrados;
      let vehiculoSeleccionado = {};
      vehiculos.forEach((vehiculo) => {
        let ingresosVehiculo = vehiculo.ingresos;
        if (ingresosVehiculo.includes(idIngreso)) {
          vehiculoSeleccionado = vehiculo;
        }
      })
      Ingreso.findById(idIngreso)
        .then((ingresoAConsultar) => {
          let ingreso = ingresoAConsultar;
          let vehiculo = vehiculoSeleccionado
          res.render("vehiculos/infoIngreso", { ingreso, vehiculo });
        })
    })
})

router.get('/nuevoIngreso/:idVehiculo', (req, res) => {
  let idVehiculo = req.params.idVehiculo;
  res.render('vehiculos/nuevoIngreso', { idVehiculo });
})

router.post('/nuevoIngreso/:idVehiculo', (req, res) => {
  let idVehiculo = req.params.idVehiculo;
  let fechaEntradaVehiculo = req.body.fechaEntrada;
  let ordenIngreso = req.body.orden.toUpperCase();
  let sintomasIngreso = req.body.sintomas;
  if (!expresionRegularFecha.test(fechaEntradaVehiculo)) {
    res.render("vehiculos/nuevoIngreso",
      {
        idVehiculo,
        message: "El formato de la fecha de entrada es incorrecto."
      })
  } else if (!expresionRegularOrden.test(ordenIngreso)) {
    res.render("vehiculos/nuevoIngreso",
      {
        idVehiculo,
        message: "El formato de la órden de trabajo es incorrecto."
      })
  } else if (!expresionRegularSintomas.test(sintomasIngreso)) {
    res.render("vehiculos/nuevoIngreso",
      {
        idVehiculo,
        message: "Es necesario indicar los síntomas."
      })
  } else {
    Ingreso.create({
      fechaEntrada: fechaEntradaVehiculo,
      orden: ordenIngreso,
      sintomas: sintomasIngreso
    })
      .then((ingreso) => {
        let nuevoIngreso = ingreso;
        Vehiculo.findByIdAndUpdate(idVehiculo,
          { $push: { ingresos: nuevoIngreso } }
        )
          .then((vehiculoSinActualizar) => {
            Vehiculo.findById(idVehiculo)
              .then((vehiculoAConsultar) => {
                let vehiculo = vehiculoAConsultar;
                let ingreso = nuevoIngreso;
                res.render("vehiculos/infoIngreso", { ingreso, vehiculo });
              })
          })
      })
  }
});

router.get('/actualizarIngreso/:idIngreso', (req, res) => {
  let idIngreso = req.params.idIngreso;
  Ingreso.findById(idIngreso)
    .then((ingresoEncontrado) => {
      let ingreso = ingresoEncontrado;
      res.render('vehiculos/actualizarIngreso', { ingreso });
    })
})

router.post('/actualizarIngreso/:idIngreso', (req, res) => {
  let idIngreso = req.params.idIngreso;
  let fechaEntradaVehiculo = req.body.fechaEntrada;
  let fechaSalidaVehiculo = req.body.fechaSalida;
  let ordenIngreso = req.body.orden;
  let sintomasIngreso = req.body.sintomas;
  let ingreso = {};
  Ingreso.findById(idIngreso)
    .then((ingresoEncontrado) => {
      ingreso = ingresoEncontrado;
      if ((expresionRegularFecha.test(fechaEntradaVehiculo) &&
        expresionRegularFecha.test(fechaSalidaVehiculo) &&
        expresionRegularOrden.test(ordenIngreso) &&
        expresionRegularSintomas.test(sintomasIngreso)) ||
        expresionRegularFecha.test(fechaEntradaVehiculo) &&
        expresionRegularSintomas.test(sintomasIngreso) &&
        expresionRegularOrden.test(ordenIngreso) &&
        fechaSalidaVehiculo === "") {
        Ingreso.findByIdAndUpdate(idIngreso, {
          fechaEntrada: fechaEntradaVehiculo,
          fechaSalida: fechaSalidaVehiculo,
          orden: ordenIngreso,
          sintomas: sintomasIngreso
        })
          .then((ingresoSinActualizar) => {
            Vehiculo.find()
              .then((vehiculosTotales) => {
                let vehiculos = vehiculosTotales;
                let vehiculo = {};
                vehiculos.forEach((unVehiculo) => {
                  if (unVehiculo.ingresos.includes(idIngreso)) {
                    vehiculo = unVehiculo;
                  }
                })
                Ingreso.findById(idIngreso)
                  .then((ingresoEncontrado) => {
                    ingreso = ingresoEncontrado;
                    res.render('vehiculos/infoIngreso', {
                      ingreso,
                      vehiculo
                    })
                  })
              })
          })
      } else {
        res.render('vehiculos/actualizarIngreso', {
          ingreso,
          message: "Rellena los campos con los formatos correctos."
        });
      }
    })
})

router.get('/confirmacionBorradoIngreso/:idIngreso', (req, res) => {
  let idIngreso = req.params.idIngreso;
  Ingreso.findById(idIngreso)
    .then((ingresoEncontrado) => {
      let ingreso = ingresoEncontrado;
      res.render("vehiculos/confirmacionBorrado", { ingreso });
    })
})

router.get('/borrarIngreso/:idIngreso', (req, res) => {
  let idIngreso = req.params.idIngreso;
  Ingreso.findByIdAndDelete(idIngreso)
    .then((ingresoEliminado) => {
      let tareasAEliminar = ingresoEliminado.tareas;
      let totalTareas = [];
      Tarea.find()
        .then((tareas) => {
          totalTareas = tareas;
          totalTareas.forEach((tarea) => {
            if (tareasAEliminar.includes(tarea._id)) {
              Tarea.findByIdAndDelete(tarea._id)
                .then(() => { })
            }
          })
        })
      let repuestosAEliminar = ingresoEliminado.repuestos;
      let totalRepuestos = [];
      Repuesto.find()
        .then((repuestos) => {
          totalRepuestos = repuestos;
          totalRepuestos.forEach((repuesto) => {
            if (repuestosAEliminar.includes(repuesto._id)) {
              Repuesto.findByIdAndDelete(repuesto._id)
                .then(() => { })
            }
          })
        })
      Vehiculo.find()
        .then((vehiculos) => {
          let totalVehiculos = vehiculos;
          let vehiculoSeleccionado = {};
          let idVehiculoSeleccionado = "";
          let ingresosVehiculoSeleccionado = [];
          let ingresosVehiculoActualizados = [];
          vehiculoSeleccionado = totalVehiculos.filter((vehiculo => {
            return vehiculo.ingresos.includes(idIngreso);
          }))
          idVehiculoSeleccionado = vehiculoSeleccionado[0]._id;
          ingresosVehiculoSeleccionado = vehiculoSeleccionado[0].ingresos;
          ingresosVehiculoActualizados =
            ingresosVehiculoSeleccionado.filter((ingreso) => {
              return ingreso != idIngreso;
            })
          Vehiculo.findByIdAndUpdate(idVehiculoSeleccionado, {
            ingresos: ingresosVehiculoActualizados
          })
            .then((vehiculoSinActualizar) => {
              let idVehiculoSinActualizar = vehiculoSinActualizar._id;
              Vehiculo.findById(idVehiculoSinActualizar)
                .then((vehiculoActualizado) => {
                  let vehiculo = vehiculoActualizado;
                  res.render('vehiculos/borradoConExito', { vehiculo });
                })
            })
        })
    })
})

module.exports = router;
