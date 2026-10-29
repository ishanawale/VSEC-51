const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

async function start() {
  await client.connect();

  const db = client.db("college");
  const students = db.collection("students");

  // CREATE student
  app.post("/students", async (req, res) => {
    await students.insertOne(req.body);
    res.send("Student added");
  });

  // READ students
  app.get("/students", async (req, res) => {
    const data = await students.find().toArray();
    res.send(data);
  });

  // UPDATE student
  app.put("/students/:roll", async (req, res) => {
    const roll = Number(req.params.roll);

    await students.updateOne(
      { roll: roll },
      { $set: req.body }
    );

    res.send("Student updated");
  });

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
}

start();