const express = require('express')
const app = express()
const path = require('path')
const PORT = 8080
const productsRouter = require('./routes/products.router')
const cartsRouter = require('./routes/carts.router')

//Middleware para analizar el cuerpo de las solicitudes.
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));

//Routing
app.use("/", productsRouter)
app.use("/", cartsRouter)

//Inyectamos Html
app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(PORT, (req, res)=> {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
})