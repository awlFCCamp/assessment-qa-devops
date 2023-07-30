const express = require("express");
const bots = require("./src/botsData");
const shuffle = require("./src/shuffle");

// include and initialize the rollbar library with your access token
var Rollbar = require("rollbar");
var rollbar = new Rollbar({
  accessToken: "d3ecbc9fd9cc4f859fe57f69cd7bad19",
  captureUncaught: true,
  captureUnhandledRejections: true,
});

// record a generic message and send it to Rollbar
rollbar.debug("Player entering site or refreshing brower!!!");

const playerRecord = {
  wins: 0,
  losses: 0,
};
const app = express();

app.use(express.json());

// Static files middleware for serving files from the public folder
app.use(express.static("public"));

// Add up the total health of all the robots
const calculateTotalHealth = (robots) =>
  robots.reduce((total, { health }) => total + health, 0);

// Add up the total damage of all the attacks of all the robots
const calculateTotalAttack = (robots) =>
  robots
    .map(({ attacks }) =>
      attacks.reduce((total, { damage }) => total + damage, 0)
    )
    .reduce((total, damage) => total + damage, 0);

// Calculate both players' health points after the attacks
const calculateHealthAfterAttack = ({ playerDuo, compDuo }) => {
  const compAttack = calculateTotalAttack(compDuo);
  const playerHealth = calculateTotalHealth(playerDuo);
  const playerAttack = calculateTotalAttack(playerDuo);
  const compHealth = calculateTotalHealth(compDuo);

  return {
    compHealth: compHealth - playerAttack,
    playerHealth: playerHealth - compAttack,
  };
};

app.get("/api/robots", (req, res) => {
  try {
    rollbar.info("list of robots was requested!!!");
    res.status(200).send(botsArr);
  } catch (error) {
    rollbar.error("ERROR GETTING BOTS");
    console.error("ERROR GETTING BOTS", error);
    res.sendStatus(400);
  }
});

app.get("/api/robots/shuffled", (req, res) => {
  try {
    let shuffled = shuffle(bots);
    rollbar.debug("list of robots was shuffled!!!");
    res.status(200).send(shuffled);
  } catch (error) {
    rollbar.error("ERROR GETTING SHUFFLED BOTS");
    console.error("ERROR GETTING SHUFFLED BOTS", error);
    res.sendStatus(400);
  }
});

app.post("/api/duel", (req, res) => {
  try {
    const { compDuo, playerDuo } = req.body;

    const { compHealth, playerHealth } = calculateHealthAfterAttack({
      compDuo,
      playerDuo,
    });

    // comparing the total health to determine a winner
    if (compHealth > playerHealth) {
      playerRecord.losses += 1;
      rollbar.warning("Game ending,sending player loosing result!");
      res.status(200).send("You lost!");
    } else {
      playerRecord.losses += 1;
      rollbar.warning("Game ending,sending player winning result!");
      res.status(200).send("You won!");
    }
  } catch (error) {
    rollbar.critical(error);
    console.log("ERROR DUELING", error);
    res.sendStatus(400);
  }
});

app.get("/api/player", (req, res) => {
  try {
    rollbar.warning("Sending player record!!!");
    res.status(200).send(playerRecord);
  } catch (error) {
    rollbar.error("ERROR GETTING PLAYER STATS");
    console.log("ERROR GETTING PLAYER STATS", error);
    res.sendStatus(400);
  }
});

//simulate a critical error, user goes to an unimplemented end point
app.get("/api/critical-error", (req, res) => {
  try {
    // Simulate a critical error (e.g., accessing an undefined variable)
    throw new Error("This is a critical error!");
  } catch (error) {
    // Log the critical error with Rollbar
    rollbar.critical(error);

    // Respond to the client with an error message
    res
      .status(500)
      .send("A critical error occurred. Please check the server logs.");
  }
});

app.listen(8000, () => {
  console.log(`Listening on 8000`);
});
