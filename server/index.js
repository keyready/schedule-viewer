const express = require('express')
const { getRectangleFromExcel } = require("./parser");
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())

app.get('/getSchedule', (req, res) => {
    const schedule = getRectangleFromExcel('../files/611-2.xlsx', 'D6:Z34')
    return res.status(200).json(schedule)
})

app.listen(5000)
