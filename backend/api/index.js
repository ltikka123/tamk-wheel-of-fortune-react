const express = require("express");

// new express applicaiton instance
const app = express();

const playerRouter = require("./routes/player.router");

// path used by API
app.use("/api/players", playerRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


