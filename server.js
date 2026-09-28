const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// Stage 0: Root greeting
app.get("/", (req, res) => {
  res.status(200).send("Hello, server!");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
