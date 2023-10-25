const express = require("express");
const fs = require("fs");
const path = require("path");
const { getRectangleFromExcel, getRange } = require("./utils/parser");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.get("/api/groups", (req, res) => {
  const { dir } = req.query;

  try {
    const files = fs.readdirSync(dir);
    const title = files.map((file) => path.basename(file).split(".")[0]);

    return res.status(200).json(title);
  } catch (e) {
    console.log("ошибка", e);
    return res.status(500).json({ message: "Директория не найдена" });
  }
});

app.post("/api/subjects", (req, res) => {
  const { group } = req.body;

  const subjects = getRange(`../files/${group}.xlsx`, "A39:I50");

  return res.status(200).json({ subjects });
});

app.get("/api/schedule", (req, res) => {
  const { workDir, group } = req.query;

  const schedule = getRectangleFromExcel(`${workDir}${group}.xlsx`, "D6:W34");

  return res.status(200).json(schedule);
});

app.listen(5000);
