import express from "express";
export const routerProductos = express.Router();
import ProductManager from '../productManager.js';

//Get '/' productos
routerProductos.get('/', async (req, res, next) => {
  const limit = req.query.limit;

  try {
    const pm = new ProductManager('./src/productos.json');
    const products = await pm.getProducts();

    if (!limit) {
      return res.send(products);
    } else {
      const productsLimited = products.slice(0, limit);
      return res.status(200).send(productsLimited);
    }
  } catch (err) {
    next(err);
  }
});

//Get '/:pid' de productos
routerProductos.get('/:pid', async (req, res, next) => {
  const pid = req.params.pid;
  const parsedId = parseInt(pid);

  try {
    const pm = new ProductManager('./src/productos.json');
    const product = await pm.getProductById(parsedId);

    if (product) {
      return res.status(200).send(product);
    } else {
      return res.status(404).send('Producto no encontrado');
    }
  } catch (err) {
    next(err);
  }
});

//Post '/' productos con sus atributos
routerProductos.post('/', async (req, res, next) => {
  const productoParaCrear = req.body;

  const pm = new ProductManager('./src/productos.json');
  const newProduct = await pm.addProduct(
    productoParaCrear.title, //String
    productoParaCrear.description, //String
    productoParaCrear.code, //String
    productoParaCrear.price, //Number
    productoParaCrear.status, //Boolean
    productoParaCrear.stock, //Number
    productoParaCrear.category, //String
    productoParaCrear.thumbnail // Array de Strings

  );

  try {
    return res.status(200).json(newProduct);
  } catch (err) {
    next(err);
  }
});

//PUT de productos '/:pid'
routerProductos.put('/:pid', async (req, res, next) => {
  const pid = req.params.pid;
  const parsedId = parseInt(pid);
  const updatedData = req.body;

  try {
    const pm = new ProductManager('./src/productos.json');
    const updatedProduct = await pm.updateProduct(parsedId, updatedData);

    if (updatedProduct) {
      return res.status(200).json(updatedProduct);
    } else {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (err) {
    next(err);
  }
});

//Delete  de Productos '/:pid'
routerProductos.delete('/:pid', async (req, res, next) => {
  const pid = req.params.pid;
  const parsedId = parseInt(pid);

  try {
    const pm = new ProductManager('./src/productos.json');
    const deletedProduct = await pm.deleteProduct(parsedId);

    if (deletedProduct) {
      return res.status(200).json(deletedProduct);
    } else {
      return res.status(404).json('No se encontro el producto')
    }
  } catch (err) {
    next(err);
  }
});


