const express = require('express'); // Framework para servidor web
const bodyParser = require('body-parser'); // Para leer datos de formularios
const fs = require('fs'); // Para leer y escribir archivos (como pedidos.json)

const app = express(); // Creamos la app con Express
const PORT = 3000; // Puerto donde correrá el servidor
const sqlite3 = require('sqlite3').verbose();
const path = require('path')

const db = new sqlite3.Database('pedidos.db', (err) => {
  if (err) {
    return console.error('❌ Error al conectar con SQLite:', err.message);
  }
  console.log('✅ Conectado a la base de datos pedidos.db');
});

db.run(`
  CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    producto TEXT,
    fecha TEXT,
    mensaje TEXT
    )
`);
// Middleware para permitir que los archivos HTML y CSS estén disponibles al navegador
app.use(express.static('public'));

// Middleware para que Express pueda leer datos de formularios (en formato URL o JSON)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Ruta de prueba (podés probar si el servidor está funcionando)
app.get('/api/prueba', (req, res) => {
  res.send('¡Hola desde el backend de Micaela!');
});

// Ruta POST para recibir pedidos desde un formulario
app.post('/api/pedido', (req, res) => {
  const { nombre, producto, fecha, mensaje } = req.body;

  const sql = `INSERT INTO pedidos (nombre, producto, fecha, mensaje) VALUES (?, ?, ?, ?)`;
  const values = [nombre, producto, fecha, mensaje];

  db.run(sql, values, function (err) {
    if (err) {
      console.error('❌ Error al guardar el pedido:', err.message);
      return res.status(500).send('Error al guardar el pedido.');
    }

    console.log('📦 Pedido guardado con ID:', this.lastID);
    res.send('<h2>¡Pedido recibido y guardado en SQLite! 🧁</h2><a href="/pedido.html">Volver</a>');
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});