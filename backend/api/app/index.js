const express = require("express");
require('dotenv').config();

const app = express();
app.use(express.json());

const listsRouter = require("./routes/lists.router.js");
const userRouter = require("./routes/user.router");

app.use("/api/lists", listsRouter);
app.use("/api/users", userRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


