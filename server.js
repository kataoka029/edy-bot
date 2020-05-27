const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(express.static("../frontend/public"));
app.use(express.static("../frontend/src"));
app.use(morgan("dev"));
app.use("", require("./routers/rootRouter.js"));
app.use("/api", express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`Server running at ${PORT}`);
