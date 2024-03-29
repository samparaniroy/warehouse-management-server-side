const express = require('express');
const cors = require('cors');
require('dotenv').config();
var jwt = require('jsonwebtoken');
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
        
        // Auth
        app.get('login', async(req, res) =>{
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{
                expiresIn: '1d'
            })
            res.send({accessToken})
        })
        // update api
        // app.put('product/:id', async(req, res) =>{
        //     const id = req.params.id;
        //     const total = req.body;
        //     const filter = {_id: ObjectId(id)}
        //     const options ={upsert: true};
        //     const updatedDoc = {
        //         $set: {
        //             quantity: total.quantity
        //         }
        //     }
        //     const result = await productCollection.updateOne(filter, options, updatedDoc);
        //     res.send(result)
        // })
        app.get('/product', async (req, res)=>{
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        });
        app.get('/myitems',async(req,res) =>{
            const email = req.query.email;
            const query = {email:email}
            const cursor = productCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        })
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
        app.delete('/myitems/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await productCollection.deleteOne(query);
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