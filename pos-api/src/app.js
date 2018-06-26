const express = require("express");
const app = express();

app.get("/all/items", (req, res) => res.send("Hello World!"));
app.get("/:id", (req, res) => res.send("Hello World id"));

app.listen(3000, () => console.log("Example app listening on port 3000!"));
