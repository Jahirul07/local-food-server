const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config();

// middle wars
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rebcmop.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const FoodCollection = client.db('localFoods').collection('foods');
        const reviewCollection = client.db('localFoods').collection('review');
        const Product = client.db('localFoods').collection('products')

        app.get('/services', async(req, res) =>{
            const query = {}
            const cursor = FoodCollection.find(query);
            const services = await cursor.limit(3).toArray()
            res.send(services)
        })

        app.get('/servicesall', async(req, res) =>{
            const query = {}
            const cursor = FoodCollection.find(query);
            const services = await cursor.toArray()
            res.send(services)
        })

        app.get('/foods/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const service = await FoodCollection.findOne(query);
            res.send(service);
        })
        // review
        app.get('/reviewsubmit', async(req, res) =>{
            let query = {}
            if(req.query.eamil){
                query = {
                    eamil: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray()
            res.send(review);
        })

        app.post('/reviewsubmit', async(req, res) =>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result)
        })

        app.delete('/foods/:id' , async(req, res) =>{
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const result = await reviewCollection.deleteOne(query);
            res.send(result)
        })

        app.post('/product', async(req, res) =>{
            const result = await Product.insertOne(req.body);
            res.send(result);
        })

        app.get('/product', async(req, res) =>{
            let query = {}
            const cursor = Product.find(query)
            const products = await cursor.toArray()
            res.send(products)
        })

    }
    finally{

    }
}
run().catch(err => console.log(err));

app.get('/', (req, res) =>{
    res.send('local food server in running');
})

app.listen(port, () =>{
    console.log(`local food server running on ${port}`)
})
