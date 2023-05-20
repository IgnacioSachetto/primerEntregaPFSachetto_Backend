import express from "express";
export const routerCarts  = express.Router();
import cartManager from '../cartManager.js';
import ProductManager from '../productManager.js';


//Get '/' Carrito
routerCarts.get('/', async (req, res, next) => {
    try {
    const cm = new cartManager('./src/carrito.json');
      const carts = await cm.getCarts();
      return res.status(200).json(carts);
    } catch (err) {
      next(err);
    }
  });

  // Get '/:cid' Carrito
  routerCarts.get('/:cid', async (req, res, next) => {
    const cid = req.params.cid;

    try {
      const cm = new cartManager('./src/carrito.json');

      const cart = await cm.getCartById(cid); // Comprobación Carrito

      if (cart) {
        return res.status(200).json(cart);
      } else {
        return res.status(404).send('Carrito no encontrado');
      }
    } catch (err) {
      next(err);
    }
  });

// Post '/' Carrito
  routerCarts.post('/', async (req, res, next) => {
    const products = req.body.products; // Obtener el array de productos desde el cuerpo de la solicitud

    try {
      const cm = new cartManager('./src/carrito.json');
      const newCart = await cm.addCart(products);
      return res.status(200).json(newCart);
    } catch (err) {
      next(err);
    }
  });

  // Post ''/':cid/products/:pid' para agregar un producto dentro de un carrito
  routerCarts.post('/:cid/products/:pid', async (req, res, next) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    const pm = new ProductManager('./src/productos.json');
    const product = await pm.getProductById(pid); //Verificamos la existencia del producto

    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }

    try {
      const cm = new cartManager('./src/carrito.json');
      const updatedCart = await cm.addProductToCart(cid, pid); //Metodo para agregar el Producto al Carrito

      return res.status(200).json(updatedCart);
    } catch (err) {
      next(err);
    }
  });
