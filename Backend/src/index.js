// index.js

// Importación del módulo 'express' para crear y configurar la aplicación del servidor.
const express = require("express");

// Importación del módulo 'cors' para permitir solicitudes de recursos desde un dominio distinto al del servidor.
const cors = require("cors");

// Importación de las rutas definidas en el archivo 'routes.js'.
const routes = require("./routes");

// Creación de la aplicación del servidor utilizando express.
const app = express();

// Middleware para permitir el análisis del cuerpo de solicitudes en formato JSON.
app.use(express.json());

// Middleware para habilitar el intercambio de recursos entre distintos dominios.
app.use(cors());

// Asociación de las rutas definidas en 'routes.js' al prefijo '/api'.
app.use("/api", routes);

// Definición del puerto en el que el servidor escuchará las solicitudes, utilizando el puerto proporcionado por el entorno o el puerto 3000 por defecto.
const PORT = process.env.PORT || 3000;

// Inicio del servidor en el puerto especificado, con un mensaje de consola para indicar la conexión exitosa.
app.listen(PORT, () => {
  console.log(`Servidor conectado en puerto ${PORT}`);
});
