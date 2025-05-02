const express = require("express");
var cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ctrkbrk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const database = client.db("Learnistry");
    const tutorialCollection = database.collection("tutorials");
    const userCollection = database.collection("users");
    const bookingCollection = database.collection("bookings");
    const reviewCollection = database.collection("reviews");

    // User API
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // Tutorial API
    app.get("/tutorials", async (req, res) => {
      const result = await tutorialCollection.find().toArray();
      res.send(result);
    });
    app.get("/tutorials/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await tutorialCollection.findOne(query);
      res.send(result);
    });
    // Get tutorial by email
    app.get("/tutorials/by-email/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await tutorialCollection.find(query).toArray();
      res.send(result);
    });
    // Get tutorial by category(language)
    app.get("/tutorials/by-category/:language", async (req, res) => {
      const language = req.params.language;
      const query = { language : language };
      const result = await tutorialCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/tutorials", async (req, res) => {
      const tutorial = req.body;
      const result = await tutorialCollection.insertOne(tutorial);
      res.send(result);
    });

    app.delete("/tutorials/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await tutorialCollection.deleteOne(query);
      res.send(result);
    });

    app.patch("/tutorials/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          //    attributes
        },
      };
      const result = await tutorialCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // booking API
    app.get("/my-bookings/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const { tutorialId, email } = booking;

      if (!tutorialId || !email) {
        return res.status(400).send({ message: "Missing tutorialId or email" });
      }

      // Checking if the user already booked this tutorial
      const existingBooking = await bookingCollection.findOne({
        tutorialId: tutorialId,
        email: email,
      });

      if (existingBooking) {
        return res
          .status(409)
          .send({ error: "You have already booked this tutorial." });
      }

      // If no duplicate, insert booking
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });

    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    });
    // Stats API
    // Review API
    // jwt

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Learnistry!");
});

app.listen(port, () => {
  console.log(`Tuitor Find app listening on port ${port}`);
});
