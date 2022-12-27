const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ObjectId } = require("mongodb");
// Middleware
app.use(cors());
app.use(express.json());

// Mongo client
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dafmrk2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
// Collections
const text = client.db("OPUS").collection("textUpdate");
const usersCollection = client.db("OPUS").collection("users");
const allEmails = client.db("OPUS").collection("emails");
const imageCollection = client.db("OPUS").collection("image");

// Check if admin
app.get("/users/admin/:email", async (req, res) => {
  const email = req.params.email;
  const query = { email };
  const user = await usersCollection.findOne(query);
  res.send({ isAdmin: user?.role === "admin" });
});
// Post signed users in database
app.post("/userInfo", async (req, res) => {
  const userInfo = req.body;
  console.log(userInfo);
  const result = await usersCollection.insertOne(userInfo);
  res.send(result);
});
// Post image from footer
app.post("/dashboard/allemails", async (req, res) => {
  const info = req.body;
  const result = await allEmails.insertOne(info);
  res.send(result);
});
// Get the updated header
app.get("/text", async (req, res) => {
  const getText = await text.find({}).toArray();
  res.send(getText);
});
// Update the header
app.patch("/text/:email", async (req, res) => {
  const { email } = req.params;
  console.log(req.params, req.body);
  const result = await text.updateOne(
    {
      email: email,
    },
    {
      $set: req.body,
    }
  );
  res.send(result);
});
// Update the image
app.patch("/image/:email", async (req, res) => {
  const { email } = req.params;
  console.log(req.params, req.body);
  const result = await imageCollection.updateOne(
    {
      email: email,
    },
    {
      $set: req.body,
    }
  );
  res.send(result);
});
// Get all emails
app.get("/email", async (req, res) => {
  const emails = await allEmails.find({}).toArray();
  res.send(emails);
});
// Get the image
app.get("/image", async (req, res) => {
  const image = await imageCollection.find({}).toArray();
  res.send(image);
});
app.get("/", (req, res) => {
  res.send("Homepage is running");
});
app.listen(port, () => {
  console.log(`port is running on ${port}`);
});
