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

    //for coffe-----------------------------------

    app.get('/coffe', async (req, res) => {
      const cursor = coffeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //for update coffe------

    app.get('/coffe/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeCollection.findOne(query);
      res.send(result);
    });

    //craft posting in database

    app.post('/craft', async (req, res) => {
      const newCraft = req.body;
      console.log(newCraft);
      const result = await craftCollection.insertOne(newCraft);
      res.send(result);
    });

    app.put('/coffe/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updatedCoffe = req.body;
      const coffe = {
        $set: {
          name: updatedCoffe.name,
          chef: updatedCoffe.chef,
          supplier: updatedCoffe.supplier,
          taste: updatedCoffe.taste,
          category: updatedCoffe.category,
          details: updatedCoffe.details,
          photo: updatedCoffe.photo,
        },
      };
      const result = await coffeCollection.updateOne(filter, coffe, option);
      res.send(result);
    });

    app.delete('/coffe/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeCollection.deleteOne(query);
      res.send(result);
    });

    //for user------------------------------------

    app.post('/user', async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.get('/user', async (req, res) => {
      const cursor = userCollection.find();
      const users = await cursor.toArray();
      res.send(users);
    });

    app.patch('/user', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = {
        $set: {
          lastLoggedAt: user.lastLoggedAt,
        },
      };

      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.delete('/user/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
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
