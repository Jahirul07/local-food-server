const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        app.get('/services', async(req, res) =>{
            const query = {}
            const cursor = FoodCollection.find(query);
            const services = await cursor.toArray()
            res.send(services)
        })

        app.get('/foods/:id', async(req, res) =>{
            
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
