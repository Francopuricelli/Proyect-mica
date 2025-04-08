const express = require('express'); // Framework para servidor web
const bodyParser = require('body-parser'); // Para leer datos de formularios
const fs = require('fs'); // Para leer y escribir archivos (como pedidos.json)

const app = express(); // Creamos la app con Express
const PORT = 3000; // Puerto donde correrá el servidor

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
  const nuevoPedido = req.body; // Los datos enviados desde el formulario

  // Leemos el archivo de pedidos actual (si existe)
  fs.readFile('pedidos.json', 'utf8', (err, data) => {
    let pedidos = [];

    if (!err && data) {
      pedidos = JSON.parse(data); // Si hay pedidos previos, los cargamos
    }

    pedidos.push(nuevoPedido); // Agregamos el nuevo pedido

    // Guardamos todo en el archivo pedidos.json
    fs.writeFile('pedidos.json', JSON.stringify(pedidos, null, 2), (err) => {
      if (err) {
        res.status(500).send('Error al guardar el pedido');
      } else {
        res.send('Pedido recibido con éxito 😊');
      }
    });
  });
});

// Iniciamos el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});