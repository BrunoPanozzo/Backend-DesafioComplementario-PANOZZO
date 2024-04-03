const express = require('express')
const handlebars = require('express-handlebars')
const { Server } = require('socket.io')

const { router: productRouter, productManager } = require('./routes/product.router')
const cartRouter = require('./routes/cart.router')
// const viewsRouter = require('./routes/views.router')
const homeRouter = require('./routes/home.router')
const realTimeProductsRouter = require('./routes/realTimeProducts.router')
const createProductRouter = require('./routes/createProduct.router')

const app = express()

//configurar express para manejar formularios y JSON
app.use(express.static(`${__dirname}/../public`))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// configurar handlebars como nuestro template engine por defecto
app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

//configurar los routers
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/home', homeRouter)
app.use('/realtimeproducts', realTimeProductsRouter)
app.use('/createproduct', createProductRouter)

//crear un servidor HTTP
const httpServer = app.listen(8080, () => {
    console.log('Servidor listo escuchando en el puerto 8080')
});

//crear un servidor WS
const wsServer = new Server(httpServer)
app.set('wsServer', wsServer)

//conexion de un nuevo cliente a mi servidor WS
wsServer.on('connection', (clientSocket) => {
    console.log(`Cliente conectado con ID: ${clientSocket.id}`)

    clientSocket.on('saludo', (data) => {
        console.log(data)
    })

    // clientSocket.on('newProduct', (product) => {
    //     console.log('nuevo producto', product)
    //     productManager.addProduct(product.title,
    //                               product.description,
    //                               +product.price,
    //                               product.thumbnail,
    //                               product.code,
    //                               +product.stock,
    //                               product.status,
    //                               product.category)
    //     .then(() => {
    //         console.log(`El producto con código '${product.code}' se agregó exitosamente.`)
    //         //avisar a todos los clientes
    //         wsServer.emit('newProduct', product)

    //     })
    // })

    clientSocket.on('deleteProduct', async (idProd) => {

        const id = parseInt(idProd)
        await productManager.deleteProduct(id)

        console.log(`El producto con código '${id}' se eliminó exitosamente.`)
        //avisar a todos los clientes
        wsServer.emit('deleteProduct', idProd)

    })
})
