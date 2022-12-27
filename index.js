const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ObjectId } = require("mongodb");
// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dafmrk2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
const text = client.db("OPUS").collection("textUpdate");
const usersCollection = client.db("OPUS").collection("users");
app.get("/", (req, res) => {
  res.send("Homepage is running");
});
// Check if admin
app.get("/users/admin/:email", async (req, res) => {
  const email = req.params.email;
  const query = { email };
  const user = await usersCollection.findOne(query);
  res.send({ isAdmin: user?.role === "admin" });
});
app.post("/userInfo", async (req, res) => {
  const userInfo = req.body;
  console.log(userInfo);
  const result = await usersCollection.insertOne(userInfo);
  res.send(result);
});
app.get("/text", async (req, res) => {
  const getText = await text.find({}).toArray();
  res.send(getText);
});
app.listen(port, () => {
  console.log(`port is running on ${port}`);
});
