const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

mongoose
  .connect(
    "mongodb+srv://mohan:tRST0czGmhqopIhE@cluster0.qo4xier.mongodb.net/assignment?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Failed to connect to MongoDB:", error));

const playerSchema = new mongoose.Schema({
  name: String,
  position: String,
  rushingYards: Number,
  touchdownPasses: Number,
  sacks: Number,
  fieldGoalsMade: Number,
  fieldGoalsMissed: Number,
  catches: Number,
});

const corsOptions = {
  origin: "http://localhost:4200",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

const Player = mongoose.model("Player", playerSchema, "football");

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

app.get("/players", async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch players" });
  }
});

app.get("/players/:id", async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      res.status(404).json({ error: "Player not found" });
    } else {
      res.json(player);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch player" });
  }
});

app.post("/players", async (req, res) => {
  try {
    const player = new Player(req.body);
    await player.save();
    res.status(201).json(player);
  } catch (error) {
    res.status(500).json({ error: "Failed to create player" });
  }
});

app.put("/players/:id", async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!player) {
      res.status(404).json({ error: "Player not found" });
    } else {
      res.json(player);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update player" });
  }
});

app.delete("/players/:id", async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) {
      res.status(404).json({ error: "Player not found" });
    } else {
      res.json({ message: "Player deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete player" });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
