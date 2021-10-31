const express = require('express')
const app = express();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
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
        const bookingCollection = database.collection("booking");


        // GET API 
        app.get('/plans', async (req, res) => {
            const cursor = planCollection.find({});
            const plans = await cursor.toArray();
            // console.log(plans)
            res.send(plans)
        });

        //GET API FROM BOOKING
        app.get('/booking', async (req, res) => {
            const cursor = bookingCollection.find({});
            const booking = await cursor.toArray();
            // console.log(booking);
            res.send(booking);
        })

        // ADD A PLAN TO DATABASE
        app.post('/plans', async (req, res) => {
            const plans = req.body;
            console.log('plans added', plans);
            const result = await planCollection.insertOne(plans);
            res.json(result);
        })

        // GET SINGLE DATA API 
        app.get('/plans/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id, 'get id');
            const query = { _id: ObjectId(id) }
            const plan = await planCollection.findOne(query);
            res.json(plan);
        })

        // UPDATE API 
        app.put('/booking/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('get id', id)
            const updatedStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedStatus.status
                },
            };
            const result = await bookingCollection.updateOne(filter, updateDoc, options)
            res.json(result)
        })

        // ADD BOOKING PLAN 
        app.post('/booking', async (req, res) => {
            const booking = req.body;
            console.log('booking', booking);
            const result = await bookingCollection.insertOne(booking);
            res.json(result);
        });

        // DELETE API 
        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await bookingCollection.deleteOne(query)
            res.json(result)
        })


        // Get User Booking Api by email
        app.post('/booking/user', async (req, res) => {
            const userEmail = req.body;
            const query = { email: { $in: userEmail } };
            const booked = await bookingCollection.find(query).toArray();
            res.json(booked);
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