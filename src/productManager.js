import fs from "fs"

export default class ProductManager {
    constructor(filePath) {
        this.products = [];
        this.path = filePath;
    }



    async addProduct(title, description, code, price, status ,stock, category,thumbnail) {
        // Leo los productos existentes para evitar sobreescribir.
        let existingProducts = [];
        try {
          const fileData = await fs.promises.readFile(this.path, 'utf-8'); // Leo el archivo para ver que tengo cargado
          existingProducts = JSON.parse(fileData);
        } catch (err) {
          console.error('Error al leer los productos existentes del archivo:', err);
        }

        // Obtengo el último ID.
        let lastId = 0;
        if (existingProducts.length > 0) {
          lastId = existingProducts[existingProducts.length - 1].id;
        }

        // Creo un nuevo objeto de producto con el formato especificado en entregas anteriores
        const newProduct = {
          id: lastId + 1, // Incremento el último ID existente para generar el nuevo
          title,
          description,
          code,
          price,
          status,
          stock,
          category,
          thumbnail
        };

        // Agrego el nuevo producto a los productos existentes (en caso que los hayas)
        existingProducts.push(newProduct);

        // Escribo los producto en el archivo
        try {
          await fs.promises.writeFile(this.path, JSON.stringify(existingProducts));
          console.log('Producto agregado exitosamente');
        } catch (err) {
          console.error('Error al escribir los productos en el archivo:', err);
        }

        return newProduct;
      }


    /* Método getProductById el cual debe recibir un id, y tras leer el archivo,
    debe buscar el producto con el id especificado,
    y devolverlo en formato objeto*/

     async getProductById(id) {
        try {
          const productsObtained = await fs.promises.readFile(this.path, 'utf-8');
          const products = JSON.parse(productsObtained);

          const productId = parseInt(id); // Convierto el ID a un número entero

          for (let i = 0; i < products.length; i++) {
            if (products[i].id === productId) {
              return products[i];
            }
          }
        } catch (err) {
          console.error('Error al leer el archivo de productos', err);
        }
      }

    /* A4 - Debe tener un método getProducts, el cual debe leer
     el archivo de productos
      y devolver todos los productos en formato de arreglo.*/

      async getProducts() {
        try {
          const productsObtained = await fs.promises.readFile(this.path, "utf-8");
          this.products = JSON.parse(productsObtained);
          return this.products;
        } catch (err) {
          /* Se agrega estas lineas para evitar excepciones
          al realizar la primer iteración sobre los productos
          ya que el .txt se encontrará vacio en ese momento.*/
          if (err.code === "ENOENT" || err.message === "Unexpected end of JSON input" || err.message === "Unexpected end of input") {
            console.error("Archivo VACIO", err);
            return [];
          } else {
            console.error("Error al leer archivo", err);
            return [];
          }
        }
      }

    /* A6 - Debe tener un método updateProduct,
    el cual debe recibir el id del producto a actualizar,
    así también como el campo a actualizar
    (puede ser el objeto completo, como en una DB),
     y debe actualizar el producto que tenga ese id en el archivo.
     NO DEBE BORRARSE SU ID */

// Dentro de la clase ProductManager

async updateProduct(id, updatedFields) {
    try {
        const productsObtained = await fs.promises.readFile(this.path, 'utf-8');
        const products = JSON.parse(productsObtained);

        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                products[i] = { ...products[i], ...updatedFields };
                await fs.promises.writeFile(this.path, JSON.stringify(products));
                console.log("Product Updated")
                return products[i];
            }
        }

    } catch (err) {
        console.error('Error al actualizar el producto', err);
    }
}



    /* A7 - Debe tener un método deleteProduct,
    el cual debe recibir un id
     y debe eliminar el producto que tenga ese id en el archivo.*/

     async deleteProduct(id) {
        try {
          const productsObtained = await fs.promises.readFile(this.path, "utf-8");
          let products = JSON.parse(productsObtained);

          let deletedProduct = null;

          /* Verificaciones para encontrar el producto */

          let index = -1;
          for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
              index = i;
              break;
            }
          }

          if (index !== -1) {
            deletedProduct = products.splice(index, 1)[0];
            await fs.promises.writeFile(this.path, JSON.stringify(products));
            console.log(`Product with id ${id} has been deleted`);
            console.log(products);
          } else {
            throw new Error(`Product with id ${id} not found`);
          }

          return deletedProduct;
        } catch (err) {
          console.error("Error al leer o escribir el archivo de productos", err);
          throw err;
        }
      }



}


