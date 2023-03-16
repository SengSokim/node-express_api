const express = require('express')
const app = express()
const mongoose = require('mongoose');
const { findByIdAndDelete } = require('./models/productModel');
const Product = require('./models/productModel')
app.use(express.json());

app.use(express.urlencoded({ extended: false }))

app.use(function (req, res, next) {
    // Set CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    // Pass to next layer of middleware
    next();
});

app.get('/', function (req, res) {
    res.send(JSON.stringify({ message: 'ok' }))
})
app.get('/blog', function (req, res) {
    res.send(JSON.stringify({ message: 'blog post' }))
})
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
app.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
app.post('/products', async (req, res) => {
    try {
        const product = await Product.create(req.body)
        res.status(200).json(product)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
})
// update product
app.put('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
        if (!product) {
            return res.status(404).json({ message: `Cannot find any product by id ${id}` })
        }
        const updatedProduct = await Product.findById(id);
        res.status(200).json(updatedProduct)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
// delete product
app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: `Cannot find any product by id ${id}` })
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
mongoose.connect('mongodb+srv://admin:nodeexpressapi@cluster0.w2yzjob.mongodb.net/node-api?retryWrites=true&w=majority')
    .then(() => {
        console.log('connected to mongodb')
        app.listen(3000, () => {
            console.log('Running on port 3000')
        })
    }).catch((error) => {
        console.log('error')
    })