const express = require('express');
const router = express.Router();

const Ingreso = require("../../models/ingreso");
const Repuesto = require("../../models/repuesto");

const expresionRegularNombre = /./;
const expresionRegularFecha = /\d\d\d\d\-\d\d\-\d\d$/;
const expresionRegularNoc = /\d\d\d\d\-\d\d\-\d\d\d\-\d\d\d\d$/;

router.get('/mostrarRepuestos/:idIngreso', (req, res) => {
  let idIngreso = req.params.idIngreso;
  Ingreso.findById(idIngreso)
    .then((ingresoEncontrado) => {
      let ingreso = ingresoEncontrado;
      let idsRepuestos = ingreso.repuestos;
      Repuesto.find()
        .then((repuestosTotalesEncontrados) => {
          let repuestosTotales = repuestosTotalesEncontrados;
          let repuestos = [];
          repuestos = repuestosTotales.filter((repuesto) => {
            return idsRepuestos.includes(repuesto._id);
          })
          res.render('vehiculos/infoRepuestos', { ingreso, repuestos });
        })
    })
})

router.get('/nuevoRepuesto/:idIngreso', (req, res) => {
  let idIngreso = req.params.idIngreso;
  res.render('vehiculos/nuevoRepuesto', { idIngreso });
})

router.post('/nuevoRepuesto/:idIngreso', (req, res) => {
  let idIngreso = req.params.idIngreso;
  let nombreRepuesto = req.body.nombre;
  let fechaSolicitudRepuesto = req.body.fecha;
  let nocRepuesto = req.body.noc;
  if (expresionRegularNombre.test(nombreRepuesto) &&
    expresionRegularFecha.test(fechaSolicitudRepuesto) &&
    expresionRegularNoc.test(nocRepuesto)) {
    Repuesto.create({
      fechaSolicitud: fechaSolicitudRepuesto,
      nombre: nombreRepuesto,
      noc: nocRepuesto
    })
      .then((repuesto) => {
        let nuevoRepuesto = repuesto;
        Ingreso.findByIdAndUpdate(idIngreso,
          { $push: { repuestos: nuevoRepuesto } })
          .then((ingresoSinActualizar) => {
            Ingreso.findById(idIngreso)
              .then((ingresoEncontrado) => {
                let ingreso = ingresoEncontrado;
                let idsRepuestos = ingreso.repuestos;
                Repuesto.find()
                  .then((repuestosTotalesEncontrados) => {
                    let repuestosTotales = repuestosTotalesEncontrados;
                    let repuestos = [];
                    repuestos = repuestosTotales.filter((repuesto) => {
                      return idsRepuestos.includes(repuesto._id);
                    })
                    res.render('vehiculos/infoRepuestos', { ingreso, repuestos });
                  })
              })
          })
      })
  } else if (!expresionRegularNombre.test(nombreRepuesto)) {
    res.render('vehiculos/nuevoRepuesto', {
      idIngreso,
      message: "Introduce el nombre del repuesto correctamente."
    })
  } else if (!expresionRegularFecha.test(fechaSolicitudRepuesto)) {
    res.render('vehiculos/nuevoRepuesto', {
      idIngreso,
      message: "Introduce la fecha de solicitud del del repuesto correctamente."
    })
  } else if (!expresionRegularNoc.test(nocRepuesto)) {
    res.render('vehiculos/nuevoRepuesto', {
      idIngreso,
      message: "Introduce el noc del repuesto correctamente."
    })
  }
});

router.get('/actualizarRepuesto/:idRepuesto', (req, res) => {
  let idRepuesto = req.params.idRepuesto;
  Ingreso.find()
    .then((totalIngresos) => {
      let ingresos = totalIngresos;
      let arrayIngresoEncontrado = [];
      let ingreso = {};
      arrayIngresoEncontrado = ingresos.filter((unIngreso) => {
        return unIngreso.repuestos.includes(idRepuesto);
      })
      ingreso = arrayIngresoEncontrado[0];
      Repuesto.findById(idRepuesto)
        .then((repuestoEncontrado) => {
          let repuesto = repuestoEncontrado;
          res.render('vehiculos/actualizarRepuesto', { ingreso, repuesto });
        })
    })
})

router.post("/actualizarRepuesto/:idRepuesto", (req, res) => {
  let idRepuesto = req.params.idRepuesto;
  let nombreRepuesto = req.body.nombre;
  let fechaSolicitudRepuesto = req.body.fecha;
  let nocRepuesto = req.body.noc;
  if (expresionRegularNombre.test(nombreRepuesto) &&
    expresionRegularFecha.test(fechaSolicitudRepuesto) &&
    expresionRegularNoc.test(nocRepuesto)) {
    Repuesto.findByIdAndUpdate(idRepuesto, {
      nombre: nombreRepuesto,
      fechaSolicitud: fechaSolicitudRepuesto,
      noc: nocRepuesto
    })
      .then((repuestoSinActualizar) => {
        Ingreso.find()
          .then((totalIngresos) => {
            let ingresos = totalIngresos;
            let arrayIngresoEncontrado = [];
            let ingreso = {};
            arrayIngresoEncontrado = ingresos.filter((unIngreso) => {
              return unIngreso.repuestos.includes(idRepuesto);
            })
            ingreso = arrayIngresoEncontrado[0];
            Repuesto.find()
              .then((totalRepuestos) => {
                let repuestosTotales = totalRepuestos;
                let repuestos = [];
                repuestos = repuestosTotales.filter((unRepuesto) => {
                  return ingreso.repuestos.includes(unRepuesto.id);
                })
                res.render('vehiculos/infoRepuestos', { ingreso, repuestos });
              })
          })
      })
  } else {
    Ingreso.find()
      .then((totalIngresos) => {
        let ingresos = totalIngresos;
        let arrayIngresoEncontrado = [];
        let ingreso = {};
        arrayIngresoEncontrado = ingresos.filter((unIngreso) => {
          return unIngreso.repuestos.includes(idRepuesto);
        })
        ingreso = arrayIngresoEncontrado[0];
        Repuesto.findById(idRepuesto)
          .then((repuestoEncontrado) => {
            let repuesto = repuestoEncontrado;
            if (!expresionRegularNombre.test(nombreRepuesto)) {
              res.render('vehiculos/actualizarRepuesto', {
                ingreso,
                repuesto,
                message: "Introduce el nombre del repuesto correctamente."
              })
            } else if (!expresionRegularFecha.test(fechaSolicitudRepuesto)) {
              res.render('vehiculos/actualizarRepuesto', {
                ingreso,
                repuesto,
                message: "Introduce la fecha de solicitud del del repuesto correctamente."
              })
            } else if (!expresionRegularNoc.test(nocRepuesto)) {
              res.render('vehiculos/actualizarRepuesto', {
                ingreso,
                repuesto,
                message: "Introduce el noc del repuesto correctamente."
              })
            }
          })
      })
  }
});

router.get('/confirmacionBorradoRepuesto/:idRepuesto', (req, res) => {
  let idRepuesto = req.params.idRepuesto;
  Repuesto.findById(idRepuesto)
    .then((repuestoEncontrado) => {
      let repuesto = repuestoEncontrado;
      Ingreso.find()
        .then((totalIngresos) => {
          let ingresos = totalIngresos;
          let arrayIngresoEncontrado = [];
          let ingresoSeleccionado = {};
          arrayIngresoEncontrado = ingresos.filter((unIngreso) => {
            return unIngreso.repuestos.includes(idRepuesto);
          })
          ingresoSeleccionado = arrayIngresoEncontrado[0];
          Repuesto.find()
            .then((totalRepuestos) => {
              let repuestosTotales = totalRepuestos;
              let repuestos = [];
              repuestos = repuestosTotales.filter((unRepuesto) => {
                return ingresoSeleccionado.repuestos.includes(unRepuesto._id);
              })
              res.render("vehiculos/confirmacionBorrado", {
                repuesto,
                repuestos,
                ingresoSeleccionado
              });
            })
        })

    })
})

router.get("/borrarRepuesto/:idRepuesto", (req, res) => {
  let idRepuesto = req.params.idRepuesto;
  Ingreso.find()
    .then((totalIngresos) => {
      let ingresos = totalIngresos;
      let arrayIngreso = [];
      let ingreso = {};
      let idIngreso = "";
      arrayIngreso = ingresos.filter((unIngreso) => {
        return unIngreso.repuestos.includes(idRepuesto);
      })
      ingreso = arrayIngreso[0];
      idIngreso = ingreso._id;
      Repuesto.findByIdAndDelete(idRepuesto)
        .then((repuestoEliminado) => {
          Ingreso.findById(idIngreso)
            .then((ingreso) => {
              let idsRepuestos = ingreso.repuestos;
              idsRepuestos = idsRepuestos.filter((id) => {
                return id != idRepuesto;
              })
              Ingreso.findByIdAndUpdate(idIngreso, {
                repuestos: idsRepuestos
              })
                .then((ingresoSinActualizar) => {
                  Repuesto.find()
                    .then((totalRepuestos) => {
                      repuestosTotales = totalRepuestos;
                      repuestos = [];
                      repuestos = repuestosTotales.filter((unRepuesto) => {
                        return idsRepuestos.includes(unRepuesto._id);
                      })
                      res.render('vehiculos/infoRepuestos', {
                        ingreso,
                        repuestos
                      });
                    })
                })
            })
        })
    })
})

module.exports = router;
