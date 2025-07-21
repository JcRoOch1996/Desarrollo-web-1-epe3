// routes.js

const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");

const filePath = path.join(__dirname, "db.json"); // Definición de la ruta del archivo de base de datos

// Ruta para iniciar sesión
router.post("/login", async (req, res) => {
  try {
    const { rut, password } = req.body; // Extracción del rut y contraseña del cuerpo de la solicitud

    const data = await fs.readFile(filePath, "utf8"); // Lectura del archivo de base de datos
    const db = JSON.parse(data); // Parseo de los datos de la base de datos

    const user = db.find((u) => u.Rut === rut); // Búsqueda del usuario en la base de datos

    if (!user) { // Si el usuario no se encuentra en la base de datos
      return res.status(401).json({ error: "Usuario no encontrado" }); // Devolver un error de no autorizado
    }

    if (user.password !== password) { // Si la contraseña proporcionada no coincide con la almacenada en la base de datos
      return res.status(401).json({ error: "Credenciales inválidas" }); // Devolver un error de no autorizado
    }

    // Determinar la página de redireccionamiento basada en el rol del usuario
    const redirectPage =
      user.Rol === "supervisor"
        ? "supervisor.html"
        : `trabajador.html?rut=${rut}`;
    res.json({ redirect: redirectPage }); // Devolver la página de redireccionamiento
  } catch (error) {
    console.error("Error al iniciar sesión:", error); // Registrar cualquier error ocurrido durante el inicio de sesión
    res.status(500).json({ error: "Error al iniciar sesión" }); // Devolver un error interno del servidor
  }
});

// Ruta para cerrar sesión
router.post("/logout", (req, res) => {
  res.sendStatus(200); // Devolver un estado de éxito
});

// Ruta para obtener la lista de empleados
router.get("/employees", async (req, res) => {
  try {
    const data = await fs.readFile(filePath, "utf8"); // Lectura del archivo de base de datos
    const employees = JSON.parse(data); // Parseo de los datos de los empleados
    res.json(employees); // Devolver la lista de empleados
  } catch (error) {
    console.error("Error al obtener la lista de empleados:", error); // Registrar cualquier error ocurrido al obtener la lista de empleados
    res.status(500).json({ error: "Error al obtener la lista de empleados" }); // Devolver un error interno del servidor
  }
});

// Ruta para asignar/modificar un turno
router.post("/assign-shift", async (req, res) => {
  try {
    console.log("Datos recibidos:", req.body); // Depuración para imprimir los datos recibidos en la consola

    const { rut, startDate, endDate, start, end, comments } = req.body; // Extracción de datos del cuerpo de la solicitud

    const data = await fs.readFile(filePath, "utf8"); // Lectura del archivo de base de datos
    const db = JSON.parse(data); // Parseo de los datos de la base de datos

    const userIndex = db.findIndex((u) => u.Rut === rut); // Búsqueda del índice del usuario en la base de datos
    if (userIndex === -1) { // Si el usuario no se encuentra en la base de datos
      return res.status(404).json({ error: "Empleado no encontrado" }); // Devolver un error de recurso no encontrado
    }

    // Asignación/modificación del turno y comentarios del usuario
    db[userIndex].Turno = [{ startDate, endDate, start, end }];
    db[userIndex].Comments = comments;

    await fs.writeFile(filePath, JSON.stringify(db, null, 2), "utf8"); // Escritura de los datos actualizados en el archivo de base de datos

    res.json({ message: "Turno asignado/modificado exitosamente" }); // Devolver un mensaje de éxito
  } catch (error) {
    console.error("Error al asignar/modificar el turno:", error); // Registrar cualquier error ocurrido al asignar/modificar el turno
    res.status(500).json({ error: "Error al asignar/modificar el turno" }); // Devolver un error interno del servidor
  }
});

// Ruta para obtener información de un usuario específico por su rut
router.get("/user/:rut", async (req, res) => {
  try {
    const { rut } = req.params; // Extracción del rut de los parámetros de la URL
    const data = await fs.readFile(filePath, "utf8"); // Lectura del archivo de base de datos
    const db = JSON.parse(data); // Parseo de los datos de la base de datos
    const user = db.find((u) => u.Rut === rut); // Búsqueda del usuario en la base de datos
    if (!user) { // Si el usuario no se encuentra en la base de datos
      return res.status(404).json({ error: "Usuario no encontrado" }); // Devolver un error de recurso no encontrado
    }
    res.json(user); // Devolver la información del usuario
  } catch (error) {
    console.error("Error al obtener el usuario:", error); // Registrar cualquier error ocurrido al obtener el usuario
    res.status(500).json({ error: "Error al obtener el usuario" }); // Devolver un error interno del servidor
  }
});

// Exportar el enrutador para su uso en otras partes de la aplicación
module.exports = router;
