const { Router } = require('express')
const ProductManager = require('../ProductManager')

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
    
    res.render('home', data)
})

//init methods

const main = async () => {
    await productManager.inicializar()
}

main()

module.exports = router;