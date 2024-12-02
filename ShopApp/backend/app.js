const express = require("express");

//init app & middleware
const app = express();

app.listen(3000, () => {
  console.log("app listening on port 3000");
});

// routes
app.get("/test", (req, res) => {
  res.json({ mssg: "Test route" });
});
