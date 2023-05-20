import express from "express";
const app = express()
import { routerProductos } from './routes/productos.router.js';
import { routerCarts } from './routes/carts.router.js';

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//Endpoints
app.use('/api/products', routerProductos)
app.use('/api/carts', routerCarts)

app.get('*', (req, res) => {
  return res.status(404).json({
    status: "error",
    msg: "Pagina no encontrada",
    data: {},
  })
});

app.listen(8080, () => {
  console.log(`Example app listening on port 8080`);
});
