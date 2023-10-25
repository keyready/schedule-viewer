const express = require("express");
const fs = require("fs");
const path = require("path");
const { getRectangleFromExcel, getRange } = require("./utils/parser");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.post("/get_groups", (req, res) => {
  const { dir } = req.body;

  try {
    const files = fs.readdirSync(dir);
    const filenames = files.map((file) => path.basename(file).split(".")[0]);

    return res.status(200).json({ filenames });
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

app.post("/get_schedule", (req, res) => {
  const { group } = req.body;

  const schedule = getRectangleFromExcel(`../files/${group}.xlsx`, "D6:W34");

  return res.status(200).json({ schedule });
});

app.listen(5000);
