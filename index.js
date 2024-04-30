const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_User}:${process.env.SECRET_KEY}@cluster0.xj6e7zx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const addListCollection = client.db("TouristSpotListDB").collection("TouristSpotList")

    app.get('/addList', async (req, res) => {
      const cursor = addListCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/addList/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await addListCollection.findOne(query);
      res.send(result);
    })

    app.put('/addList/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updateInfo = req.body;
      const info = {
        $set: {
          email: updateInfo.email,
          image: updateInfo.image,
          shortDescription: updateInfo.shortDescription,
          touristSpot: updateInfo.touristSpot,
          country: updateInfo.country,
          location: updateInfo.location,
          averageCost: updateInfo.averageCost,
          seasonality: updateInfo.seasonality,
          travelTime: updateInfo.travelTime,
          totalVisitorPerYear: updateInfo.totalVisitorPerYear
        }
      }
      const result = await addListCollection.updateOne(filter, info, options);
      res.send(result);
    })

    app.post('/addList', async (req, res) => {
      const addList = req.body;
      console.log(addList);
      const result = await addListCollection.insertOne(addList);
      res.send(result);
    })

    app.delete('/addList/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await addListCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Tourism server is running')
})

app.listen(port, () => {
  console.log(`Tourism server is running on ${port}`)
})