const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k7gko.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productsCollection = client.db('refrigaration-technology').collection('products');
        const bookingCollection = client.db('refrigaration-technology').collection('booking');
        const reviewCollection = client.db('refrigaration-technology').collection('review');

        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.findOne(query);
            res.send(product);
        })

        //creat booking collection api
        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        });

        //for oder 
        app.get('/booking', async (req, res) => {
            const customer = req.query.customer;
            const query = { customer: customer };
            const bookings = await bookingCollection.find(query).toArray();
            res.send(bookings);
        })

        //review by user
        app.post('/reviews', async (req, res) => {
            const newProduct = req.body;
            const result = await reviewCollection.insertOne(newProduct);
            res.send(result);
        });

    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello From regrigaration technology!')
})

app.listen(port, () => {
    console.log(`Refrigaration technology App listening on port ${port}`)
})