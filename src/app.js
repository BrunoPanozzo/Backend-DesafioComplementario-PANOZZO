//definir los paquetes que se van a utilizar
const express = require('express')
const handlebars = require('express-handlebars')
const mongoose = require('mongoose')
const { Server } = require('socket.io')

//definir los routers
const productRouter = require('./routes/products.router')
const cartRouter = require('./routes/carts.router')
const viewsRouter = require('./routes/views.router')
const realTimeProductsRouter = require('./routes/realTimeProducts.router')

//definir los Managers y Modelos
const fsProductManager = require('./dao/fsManagers/ProductManager')
const fsCartManager = require('./dao/fsManagers/CartManager')
const dbProductManager = require('./dao/dbManagers/ProductManager')
const dbCartManager = require('./dao/dbManagers/CartManager')

//instanciar mi app
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
app.use('/', viewsRouter)
app.use('/realtimeproducts', realTimeProductsRouter)

const main = async () => {

    //configurar mongoose
    await mongoose.connect('mongodb+srv://coderUser:coderPassword@coderclustertest.y46cxod.mongodb.net/?retryWrites=true&w=majority&appName=CoderClustertest',
        {
            dbName: 'ecommerce'
        })    

        //configurar cuál de los dos Managers está activo, son excluyentes
//Manager con FileSystem
// const productManager = new fsProductManager()
// await productManager.inicializar()
// app.set('productManager', productManager)
// const cartManager = new fsCartManager()
// await cartManager.inicializar()
// app.set('cartManager', cartManager)
//Manager con DataBaseSystem
const productManager = new dbProductManager()
await productManager.inicializar()
app.set('productManager', productManager)
const cartManager = new dbCartManager()
await cartManager.inicializar()
app.set('cartManager', cartManager)


    //crear un servidor HTTP
    const httpServer = app.listen(8080, () => {
        console.log('Servidor listo escuchando en el puerto 8080')
    });

    //crear un servidor WS
    const io = new Server(httpServer)
    app.set('io', io)
}

main()

// //conexion de un nuevo cliente a mi servidor WS
// io.on('connection', (clientSocket) => {
//     console.log(`Cliente conectado con ID: ${clientSocket.id}`)

//     clientSocket.on('saludo', (data) => {
//         console.log(data)
//     })
    
//     clientSocket.on('deleteProduct', async (idProd) => {

//         const id = parseInt(idProd)
//         await productManager.deleteProduct(id)

//         console.log(`El producto con código '${id}' se eliminó exitosamente.`)
//         //avisar a todos los clientes
//         io.emit('deleteProduct', idProd)

//     })
// })