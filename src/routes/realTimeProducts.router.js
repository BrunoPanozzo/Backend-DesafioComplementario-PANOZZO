const { Router } = require('express')
// const ProductManager = require('../dao/dbManagers/ProductManager')

const router = Router()

// const fileName = `${__dirname}/../../products.json`
// const productManager = new ProductManager(fileName)

//endpoints

router.get('/', async (req, res) => {
    const productManager = req.app.get('productManager')

    let allProducts = await productManager.getProducts()

    const data = {        
        title: 'Real Time Products', 
        scripts: ['allProducts.js'],
        styles: ['home.css', 'allProducts.css'],
        useWS: true,
        allProducts
    }
    
    res.render('realtimeproducts', data)
})

// router.post('/', async (req, res) => {
//     const newProduct = req.body

//     newProduct.thumbnail = ["/images/productos/" + newProduct.thumbnail]

//     console.log(newProduct)
//     //agregar el producto al productManager
//     await productManager.addProduct(newProduct.title,
//                                     newProduct.description,
//                                     newProduct.price,
//                                     newProduct.thumbnail,
//                                     newProduct.code,
//                                     newProduct.stock,
//                                     newProduct.status,
//                                     newProduct.category)

//     //notificar a los demás browsers mediante WS
//     req.app.get('io').emit('newProduct', newProduct)

//     let allProducts = await productManager.getProducts()

//     const data = {        
//         title: 'Real Time Products', 
//         scripts: ['realTimeProducts.js'],
//         styles: ['home.css', 'realTimeProducts.css'],
//         useWS: true,
//         allProducts
//     }
    
//     res.render('realTimeProducts', data)
// })

module.exports = router;