const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

const cors = require("cors");

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e5zetpl.mongodb.net/?retryWrites=true&w=majority`;

// console.log(uri);
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// API Endpoints
async function myServer() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    const db = client.db("hotel-booking");
    const hotelsCollection = db.collection("hotels");
    const ordersCollection = db.collection("orders");

    console.log("You successfully connected to MongoDB!");

    app.post("/hotels", async (req, res) => {
      const courses = req.body;
      const result = await hotelsCollection.insertOne(courses);
      res.send(result);
    });
    app.get("/hotels", async (req, res) => {
      const cursor = hotelsCollection.find({});
      const courses = await cursor.toArray();
      res.send({ data: courses });
    });

    app.get("/hotel/:id", async (req, res) => {
      const id = req?.params?.id;
      console.log(id);
      const result = await hotelsCollection.findOne({ _id: new ObjectId(id) });
      console.log(result);
      res.send(result);
    });

    app.post("/orders", async (req, res) => {
      // Assuming that the request body contains order data
      const orderData = req.body;

      try {
        // Assuming you have a MongoDB collection for orders called "ordersCollection"
        const result = await ordersCollection.insertOne(orderData);
        console.log(result);
        res.send(result);
        // Send a success response with the inserted order data
        res.status(201).json({
          message: "Order created successfully",
          order: result.ops[0], // This assumes you want to send the inserted order data in the response
        });
      } catch (error) {
        // Handle any errors that may occur during the database operation
        console.error("Error creating order:", error);
        res.status(500).json({
          message: "Error creating order",
          error: error.message,
        });
      }
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
myServer().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello hotel booking API!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
