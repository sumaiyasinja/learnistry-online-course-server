const express = require('express')
var cors = require('cors')
const app = express()
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');

// Middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ctrkbrk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();

    const database = client.db("Learnistry");
    const tuitorCollection = database.collection("tuitors");
    const userCollection = database.collection("users");
    const reviewCollection = database.collection("reviews");

    // User API
    app.post('/users', async(req,res)=>{
        const user = req.body;
        const result = await userCollection.insertOne(user);
        res.send(result);
    })

    app.get('/users', async(req,res)=>{
        const result = await userCollection.find().toArray();
        res.send(result);
    })

    // Tuitor API
    app.get('/tuitors', async (req, res) => {
        const result = await tuitorCollection.find().toArray();
        res.send(result);
      })
      app.get('/tuitors/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id)  };
        const result = await tuitorCollection.findOne(query);
        res.send(result);
      })

    app.post('/tuitors', async (req, res) => {
      const tuitor = req.body;
      const result = await tuitorCollection.insertOne(tuitor);
      res.send(result);
    })

    app.delete('/tuitors/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)  };
      const result = await tuitorCollection.deleteOne(query);
      res.send(result);
    })

    app.put('/tuitors/:id', async(req,res)=>{
        const id = req.params.id;
        const filter ={ _id : new ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
            //    attributes 
            },
        };
        const result = await tuitorCollection.updateOne(filter, updateDoc, options);
        res.send(result);
    })


  

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello Learnistry!')
})

app.listen(port, () => {
  console.log(`Tuitor Find app listening on port ${port}`)
})
