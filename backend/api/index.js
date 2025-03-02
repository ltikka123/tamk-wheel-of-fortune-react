const express = require("express");

// new express applicaiton instance
const app = express();
app.use(express.json());

const playerRouter = require("./routes/player.router");
const userRouter = require("./routes/user.router");

// path used by API
app.use("/api/players", playerRouter);
app.use("/api/users", userRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


