const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const { getRectangleFromExcel, getRange } = require('./utils/parser');

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.get('/api/groups', (req, res) => {
    const { dir } = req.query;

    try {
        const files = fs.readdirSync(dir);
        const title = files.map((file) => path.basename(file).split('.')[0]);

        return res.status(200).json(title);
    } catch (e) {
        console.log('ошибка', e);
        return res.status(500).json({ message: 'Директория не найдена' });
    }
});

app.get('/api/subjects', (req, res) => {
    const { group } = req.query;

    const subjects = getRange(`../files/${group}.xlsx`, 'A39:O50');

    return res.status(200).json(subjects);
});

app.get('/api/schedule', (req, res) => {
    const { workDir, group } = req.query;

    const schedule = getRectangleFromExcel(`${workDir}${group}.xlsx`, 'D6:Z34');

    return res.status(200).json(schedule);
});

app.get('/api/today', async (req, res) => {
    const { workDir } = req.query;

    const groupsSchedule = [];
    let cnt = 0;

    const schedule = fs
        .readdirSync(path.resolve(__dirname, '../files/'))
        .filter((file) => !file.includes('~'));

    schedule.forEach((file) => {
        groupsSchedule.push(
            getRectangleFromExcel(`${path.resolve(__dirname, '../files/')}/${file}`, 'D6:Z34'),
        );
    });

    const result = [];
    groupsSchedule
        .map((group) =>
            group.filter((day) => {
                const today = new Date().setHours(0, 0, 0, 0);
                const date = new Date(day.date).setHours(0, 0, 0, 0);
                return today === date;
            }),
        )
        .map((group) => {
            group[0].groupName = schedule[cnt].split('.')[0];
            cnt += 1;
            return result.push(group[0]);
        });

    return res.status(200).json(result);
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
