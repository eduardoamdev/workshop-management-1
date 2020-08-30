const express = require('express');
const router = express.Router();

const Vehiculo = require("../../models/vehiculo");
const Ingreso = require("../../models/ingreso");
const Tarea = require("../../models/tarea");
const Repuesto = require("../../models/repuesto");
const Tipo = require("../../models/tipo");
const Unidad = require("../../models/unidad");

const expresionRegularMatricula = /ET-[0-9]{6,6}$/;


router.get('/buscarVehiculo', (req, res) => {
  res.render('vehiculos/buscarVehiculo');
})

router.post('/buscarVehiculo', (req, res) => {
  let matriculaVehiculo = req.body.matricula.toUpperCase();
  if (expresionRegularMatricula.test(matriculaVehiculo)) {
    Vehiculo.findOne({ matricula: matriculaVehiculo })
      .then((vehiculo) => {
        vehiculoBuscado = vehiculo;
        if (vehiculoBuscado) {
          let vehiculo = vehiculoBuscado
          res.render("vehiculos/infoVehiculo", { vehiculo });
        } else {
          res.render("vehiculos/buscarVehiculo",
            { message: "Vehículo no registrado." });
        }
      })
  } else {
    res.render("vehiculos/buscarVehiculo",
      { message: "Formato incorrecto." });
  }
})

router.get('/infoVehiculo/:idVehiculo', (req, res) => {
  let idVehiculo = req.params.idVehiculo;
  Vehiculo.findById(idVehiculo)
    .then((vehiculoEncontrado) => {
      let vehiculo = vehiculoEncontrado;
      res.render("vehiculos/infoVehiculo", { vehiculo });
    })
})

router.get('/altaVehiculo', (req, res) => {
  let tiposVehiculos = [];
  let unidadesVehiculos = [];
  Tipo.find()
    .then((tipos) => {
      tipos.forEach((tipo) => {
        tiposVehiculos.push(tipo);
      })
    })
  Unidad.find()
    .then((unidades) => {
      unidades.forEach((unidad) => {
        unidadesVehiculos.push(unidad);
      })
    })
  res.render('vehiculos/nuevoVehiculo',
    { tiposVehiculos, unidadesVehiculos });
})

router.post('/altaVehiculo', (req, res, next) => {
  let matriculaVehiculo = req.body.matricula.toUpperCase();
  let tipoVehiculo = req.body.tipo;
  let unidadVehiculo = req.body.unidad;
  let tiposVehiculos = [];
  let unidadesVehiculos = [];
  Tipo.find()
    .then((tipos) => {
      tipos.forEach((tipo) => {
        tiposVehiculos.push(tipo);
      })
    })
  Unidad.find()
    .then((unidades) => {
      unidades.forEach((unidad) => {
        unidadesVehiculos.push(unidad);
      })
    })
  if (expresionRegularMatricula.test(matriculaVehiculo)) {
    Vehiculo.find()
      .then((vehiculos) => {
        let matriculasVehiculos = [];
        matriculasVehiculos = vehiculos.map((vehiculo) => {
          return vehiculo.matricula;
        })
        if (matriculasVehiculos.includes(matriculaVehiculo)) {
          res.render('vehiculos/nuevoVehiculo',
            {
              message: "Esa matrícula ya existe.",
              unidadesVehiculos,
              tiposVehiculos
            });
        } else {
          Vehiculo.create({
            matricula: matriculaVehiculo,
            tipo: tipoVehiculo,
            unidad: unidadVehiculo
          })
            .then((nuevoVehiculo) => {
              let vehiculo = nuevoVehiculo;
              res.render("vehiculos/infoVehiculo", { vehiculo });
            })
        }
      })
  } else {
    res.render("vehiculos/nuevoVehiculo",
      {
        message: "Formato incorrecto.",
        unidadesVehiculos,
        tiposVehiculos
      });
  }
});

router.get('/actualizarVehiculo/:idVehiculo', (req, res) => {
  let idVehiculo = req.params.idVehiculo;
  let tiposVehiculos = [];
  let unidadesVehiculos = [];
  Vehiculo.findById(idVehiculo)
    .then((vehiculoAModificar) => {
      let vehiculo = vehiculoAModificar;
      let tipoVehiculo = vehiculo.tipo;
      let unidadVehiculo = vehiculo.unidad;
      let tipoVehiculoRestante = {}
      let unidadVehiculoRestante = {}
      Tipo.find()
        .then((tipos) => {
          tipos.forEach((tipo) => {
            if (tipo.nombre !== tipoVehiculo) {
              tiposVehiculos.push(tipo)
            } else {
              tipoVehiculoRestante = tipo;
            }
          })
          tiposVehiculos.unshift(tipoVehiculoRestante);
        })
      Unidad.find()
        .then((unidades) => {
          unidades.forEach((unidad) => {
            if (unidad.nombre !== unidadVehiculo) {
              unidadesVehiculos.push(unidad)
            } else {
              unidadVehiculoRestante = unidad;
            }
          })
          unidadesVehiculos.unshift(unidadVehiculoRestante);
        })
      res.render("vehiculos/actualizarVehiculo",
        { vehiculo, tiposVehiculos, unidadesVehiculos });
    })
})

router.post('/actualizarVehiculo/:idVehiculo', (req, res) => {
  let idVehiculo = req.params.idVehiculo;
  let tiposVehiculos = [];
  let unidadesVehiculos = [];
  let matriculaAModificar = req.body.matricula.toUpperCase();
  let tipoAModificar = req.body.tipo;
  let unidadAModificar = req.body.unidad;
  Vehiculo.findById(idVehiculo)
    .then((vehiculoAModificar) => {
      let vehiculo = vehiculoAModificar;
      let tipoVehiculo = vehiculo.tipo;
      let unidadVehiculo = vehiculo.unidad;
      let tipoVehiculoRestante = {}
      let unidadVehiculoRestante = {}
      Tipo.find()
        .then((tipos) => {
          tipos.forEach((tipo) => {
            if (tipo.nombre !== tipoVehiculo) {
              tiposVehiculos.push(tipo)
            } else {
              tipoVehiculoRestante = tipo;
            }
          })
          tiposVehiculos.unshift(tipoVehiculoRestante);
        })
      Unidad.find()
        .then((unidades) => {
          unidades.forEach((unidad) => {
            if (unidad.nombre !== unidadVehiculo) {
              unidadesVehiculos.push(unidad)
            } else {
              unidadVehiculoRestante = unidad;
            }
          })
          unidadesVehiculos.unshift(unidadVehiculoRestante);
        })
      if (expresionRegularMatricula.test(matriculaAModificar)) {
        Vehiculo.find()
          .then((vehiculos) => {
            Vehiculo.findById(idVehiculo)
              .then((vehiculoActual) => {
                let matriculaActual = vehiculoActual.matricula;
                let matriculasVehiculos = [];
                matriculasVehiculos = vehiculos.map((vehiculo) => {
                  if (vehiculo.matricula !== matriculaActual) {
                    return vehiculo.matricula;
                  }
                })
                if (matriculasVehiculos.includes(matriculaAModificar)) {
                  res.render('vehiculos/actualizarVehiculo', {
                    message: "La matrícula ya existe.",
                    vehiculo,
                    tiposVehiculos,
                    unidadesVehiculos
                  })
                } else {
                  Vehiculo.findByIdAndUpdate(idVehiculo, {
                    matricula: matriculaAModificar,
                    tipo: tipoAModificar,
                    unidad: unidadAModificar
                  })
                    .then((vehiculoSinActualizar) => {
                      Vehiculo.findById(idVehiculo)
                        .then((vehiculo) => {
                          res.render('vehiculos/infoVehiculo',
                            { vehiculo });
                        })
                    })
                }
              })
          })
      } else {
        res.render("vehiculos/actualizarVehiculo",
          {
            message: "Formato incorrecto.",
            vehiculo,
            tiposVehiculos,
            unidadesVehiculos
          });
      }
    })
})

router.get('/confirmarBorradoVehiculo/:idVehiculo', (req, res) => {
  let idVehiculo = req.params.idVehiculo;
  Vehiculo.findById(idVehiculo)
    .then((vehiculoABorrar) => {
      let vehiculo = vehiculoABorrar;
      res.render('vehiculos/confirmacionBorrado', { vehiculo });
    })
})

router.get('/borrarVehiculo/:idVehiculo', (req, res) => {
  let idVehiculo = req.params.idVehiculo;
  Vehiculo.findByIdAndDelete(idVehiculo)
    .then((vehiculoEliminado) => {
      let vehiculo = vehiculoEliminado;
      let ingresos = vehiculo.ingresos;
      if (ingresos.length !== 0) {
        ingresos.forEach((ingreso) => {
          let idIngreso = ingreso._id;
          Ingreso.findByIdAndDelete(idIngreso)
            .then((ingresoBorrado) => {
              let tareas = ingresoBorrado.tareas;
              let repuestos = ingresoBorrado.repuestos;
              if (tareas.length !== 0) {
                tareas.forEach((tarea) => {
                  let idTarea = tarea._id;
                  Tarea.findByIdAndDelete(idTarea)
                    .then((tareaEliminada) => { })
                })
              }
              if (repuestos.length !== 0) {
                repuestos.forEach((repuesto) => {
                  let idRepuesto = repuesto._id;
                  Repuesto.findByIdAndDelete(idRepuesto)
                    .then((repuestoEliminado) => { })
                })
              }
            })
        })
      }
      let borradoDeVehiculo = {};
      res.render('vehiculos/borradoConExito', { borradoDeVehiculo });
    })
})

module.exports = router;
