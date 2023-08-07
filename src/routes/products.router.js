const express = require('express')
const router = express.Router()

//Importamos la clase contenedor
const {products} = require('./contenedor.router')


//Obtener productos
router.get("/api/products", async (req, res) => {
    const data = await products.getAll()
    res.json(data)
})


//Obtener productos por id
router.get("/api/products/:pid", async (req, res)=>{
    //Obtengo id
    const pid = parseInt(req.params.pid)
    //Obtengo producto con el id indicado
    const product = await products.getById(pid)

    if (!product) {
        res.status(404).json({ error: `El producto con el id proporcionado no existe` })
    }
    res.json(product)      

})


//Agregar productos
router.post("/api/products", async (req, res) => {
    try {
        let newProduct = req.body
        await products.save(newProduct)
        res.json({ msg: `Producto agregado correctamente.` })
    } catch (error) {
        res.status(404).json({ error: `Error al agregar un producto` })
    }
})


//Actualizar un producto
router.put("/api/products/:pid", async (req, res)=> {
    const pid = parseInt(req.params.pid)
    const updatedFields = req.body
    //Obtengo información de los productos
    const data = await products.getAll()
    //Obtengo el índice del producto a modificar.
    const indexProduct = data.findIndex((p)=> p.id === pid)

    if (indexProduct === -1) {
        res.status(404).json({ error: `El producto a actualizar no existe.` })
    }

    if (Object.keys(updatedFields).length === 0) {
        res.status(404).json({ error: `Debe actualizar al menos un campo.` })
    }

    //Actualizo producto en base a los campos modificados
    data[indexProduct] = {
        ...data[indexProduct],
        ...updatedFields
    }
    //Actualizo array de productos
    await products.saveObjects(data)

    res.json(data[indexProduct])
        
})


//Eliminar todos los productos
router.delete("/api/products", async (req, res)=> {
    try {
        await products.deleteAll()
        res.json({msg:"Todos los productos han sido eliminados correctamente."})
    } catch (error) {
        res.status(404).json({error:"Error al eliminar todos los productos."})
    }
})


//Eliminar producto por su id
router.delete("/api/products/:pid", async (req, res)=> {
    const pid = parseInt(req.params.pid)
    //Obtengo información de los productos
    const data = await products.getAll()
    //Obtengo índice de producto a eliminar para verificar su existencia.
    const indexProduct = data.findIndex((p) => p.id === pid)

    if (indexProduct === -1) {
        res.status(404).json({ error: `El producto a eliminar no existe.` })
    }

    await products.deleteById(pid)
    res.json({ msg: "Producto eliminado correctamente." })
})


module.exports = router




