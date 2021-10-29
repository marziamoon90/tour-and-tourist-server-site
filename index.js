const express = require('express')
const app = express();
const { MongoClient } = require('mongodb');
require('dotenv').config()



const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e6utb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        // console.log('database server tour and tourist is connected');
        const database = client.db("tour-and-tourist");
        const planCollection = database.collection("plans");


        // GET APP 
        app.get('/plans', async (req, res) => {
            const cursor = planCollection.find({});
            const plans = await cursor.toArray();
            console.log(plans)
            res.send(plans)
        })
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('welcome to tour and tourist')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})