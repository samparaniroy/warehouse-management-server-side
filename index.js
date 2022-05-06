const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fid9e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        await client.connect();
        const productCollection = client.db('warehouse').collection('product');
        const orderCollection = client.db('warehouse').collection('order');
        app.get('/product', async (req, res)=>{
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        });
        app.get('/product/:id', async(req, res)=>{
            const id = req.params.id;
            const query ={_id: ObjectId(id)};
            const product = await productCollection.findOne(query);
            res.send(product)
        });
        app.post('/product', async(req, res) =>{
            const newItem = req.body;
            const result = await productCollection.insertOne(newItem);
            res.send(result)
        });
        app.delete('/product/:id', async(req, res) =>{
            const id = req.params.id;
            const query ={_id: ObjectId(id)};
            const result = await productCollection.deleteOne(query);
            res.send(result)
        })
        app.post('/order', async(req, res) =>{
            const newOrder = req.body;
            console.log('adding new order', newOrder);
            const result = await orderCollection.insertOne(newOrder)
            res.send(result)
        })

    }
    finally{

    }
}
run().catch(console.dir)

app.get('/', (req, res) =>[
    res.send('Running warehouse server')
]);
app.listen(port, ()=>{
    console.log('listening to port', port)
})