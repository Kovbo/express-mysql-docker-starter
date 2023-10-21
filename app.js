const express = require("express");
const tasksRouter = require("./router/tasksRouter");
require("dotenv").config();

const PORT = process.env.PORT;

const app = express();

app.use(express.static("public"));
app.use(express.json());

app.use(tasksRouter);

app.listen(PORT || 3000);
