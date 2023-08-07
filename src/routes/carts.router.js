const express = require('express')
const router = express.Router()

//Importamos las clases Contenedor de products y carts
const {carts} = require('./contenedor.router')
const {products} = require('./contenedor.router')
const { route } = require('./products.router')

//Agregamos un carrito nuevo
router.post("/api/carts", async (req, res) => {
    try {
        let newCart = {
            products: []
        }
        //Lo guardamos en el array carts.json
        await carts.save(newCart)
        res.json({msg:`Carrito agregado correctamente.`})

    } catch (error) {
        res.status(404).json("Error al guardar carrito.")
    }
})

//Obtengo información de un carrito por su id
router.get("/api/carts/:cid", async (req, res) => {
    const cid = parseInt(req.params.cid)

    //Verificamos existencia del carrito 
    const cart = await carts.getById(cid)

    if (!cart) {
        res.status(404).json({error:"El carrito con id proporcionado no existe."})
    }
    res.json(cart)

})

//Agregar un producto al carrito
router.post("/api/carts/:cid/products/:pid", async (req, res) => {
    const cid = parseInt(req.params.cid)
    const pid = parseInt(req.params.pid)
    //Obtengo información del carts.json
    const generalCart = await carts.getAll()
    //Verificamos existencia tanto del carrito como del producto indicado en la ruta
    const cart = await carts.getById(cid)
    const product = await products.getById(pid)

    if (!cart) {
        return res.status(404).json({error:"El carrito con id proporcionado no existe."})
    }
    if (!product) {
        return res.status(404).json({ error: `El producto con el id proporcionado no existe` })
    }

    //Verifico existencia del producto en el carrito
    const foundProductInCart = cart.products.find((p) => {
        return p.product === pid
    })

    //Si existe le sumamos uno en su cantidad
    //Si no existe creamos un nuevo objeto con su cantidad inicial en 1.
    if (foundProductInCart) {
        const indexProduct = cart.products.findIndex((p) => p.product === pid)
        generalCart[cid-1].products[indexProduct].quantity += 1
    } else {
        generalCart[cid-1].products.push({
            product: pid,
            quantity: 1
        })
    }

    //Actualizo información del carts.json
    await carts.saveObjects(generalCart)
    res.json({msg:"Producto agregado al carrito"})
})


//Vaciar carts.json
router.delete("/api/carts", async (req, res)=> {
    try {
        await carts.deleteAll()
        res.json({msg:"Carritos vacíos"})
    } catch (error) {
        res.status(404).json({error:"Error al vaciar carritos."})
    }
})

module.exports = router