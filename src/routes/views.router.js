const { Router } = require('express')
const ProductManager = require('../dao/fsManagers/ProductManager')

const router = Router()

const fileName = `${__dirname}/../../products.json`
const productManager = new ProductManager(fileName)

//endpoints

router.get('/', async (req, res) => {

    let allProducts = await productManager.getProducts()

    const data = {        
        title: 'Home', 
        styles: ['home.css'],
        useWS: true,
        allProducts
    }
    
    res.render('index', data)
})

router.get('/create', async (req, res) => {
    const data = {
        title: 'Create Product',
        scripts: ['createProduct.js'],
        styles: ['home.css'],
        useWS: true
    }

    res.render('createProduct', data)
})

module.exports = router;