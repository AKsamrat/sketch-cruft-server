const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
// require('colors');
const config = process.env;

// Mongo DB Connections
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.telyg.mongodb.net/?retryWrites=true&w=majority`;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nj7eiar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

client
  .connect()
  .then(() => {
    // console.log('MongoDB Connected'.blue.bold);
  })
  .catch(err => {
    console.log(err.red);
  });

// Middleware Connections
const corsConfig = {
  origin: 'http://localhost:5174',
  credentials: true,
};
app.use(cors(corsConfig));
app.use(express.json());

// Routes
async function run() {
  try {
    // collections are here
    const database = client.db('CRAFT_DB');
    const craftCollection = database.collection('CRAFT');
    const categoryCollection = database.collection('CATEGORY');

    // for all Craft load-----------------------------------

    app.get('/allCraft', async (req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //category data receive

    app.get('/artAndCraftCategory', async (req, res) => {
      const cursor = categoryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get('/category/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await categoryCollection.findOne(query);
      res.send(result);
    });

    //for update craft load------

    // app.get('/craftUpdate/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await craftCollection.findOne(query);
    //   res.send(result);
    // });
    app.get('/singleCraft/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.findOne(query);
      res.send(result);
    });

    app.get('/craftUpdate/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.findOne(query);
      res.send(result);
    });

    //craft posting in database

    app.post('/craft', async (req, res) => {
      const newCraft = req.body;
      console.log(newCraft);
      const result = await craftCollection.insertOne(newCraft);
      res.send(result);
    });

    app.put('/updateCraftData/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updatedCraft = req.body;
      const craft = {
        $set: {
          name: updatedCraft.name,
          subCategory: updatedCraft.subCategory,
          description: updatedCraft.description,
          price: updatedCraft.price,
          rating: updatedCraft.rating,
          customization: updatedCraft.customization,
          photo: updatedCraft.photo,
          processingTime: updatedCraft.processingTime,
          stockStatus: updatedCraft.stockStatus,
        },
      };
      console.log(craft);
      const result = await craftCollection.updateOne(filter, craft, option);
      res.send(result);
    });

    app.get('/myCraft/:email', async (req, res) => {
      const result = await craftCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    app.delete('/craftDelete/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

// Connection
const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
  res.send('YOUR server is live');
});
app.listen(PORT, () => {
  console.log(`App running in port:  ${PORT}`);
});
