const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

const { getRectangleFromExcel, getRange } = require('./utils/parser');

const { AudsModel, KafsModel } = require('./models/index');

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.resolve(__dirname, './dist/')));

const start = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/schedule-viewer');
    // await mongoose.connect('mongodb://host.docker.internal:27017/schedule-viewer');
    
    app.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`);
    });
};


// удаление кафдеры с ее аудиториями или удаление аудитории
app.delete('/api/delete', async (req, res) => {
    try {
        const { audId, kafId } = req.body;

        if (audId) {
            await AudsModel.deleteOne({ _id: audId });
            return res.status(200).json({ message: 'Аудитория удалена' });
        }

        if (kafId) {
            const wantedKaf = await KafsModel.findOne({ _id: kafId });
            const wantedAuds = wantedKaf.audsIds;

            for (let i = 0; i <= wantedAuds.length; i += 1) {
                await AudsModel.deleteOne({ _id: wantedAuds[i] });
            }

            await KafsModel.deleteOne({ _id: kafId });

            return res.status(200).json({ message: 'Кафедра удалена' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Произошла непредвиденная ошибка' });
    }
});

// создание кафедры
app.post('/api/create_kaf', async (req, res) => {
    try {
        const { title } = req.body;

        const createdKaf = KafsModel.create({
            title,
        });

        return res.status(201).json(createdKaf);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Произошла непредвиденная ошибка' });
    }
});

// добавление аудиторий к кафедре по ее id
app.post('/api/add_auds_to_kaf', async (req, res) => {
    try {
        const { audsTitles, parentKafId } = req.body;

        const createdAudsIds = [];
        for (let i = 0; i < audsTitles.length; i += 1) {
            const createdAud = await AudsModel.create({ title: audsTitles[i] });
            createdAudsIds.push(createdAud._id);
        }

        await KafsModel.updateOne({ _id: parentKafId }, { audsIds: createdAudsIds });

        return res.status(201).json({ message: 'Аудитории созданы и добавлены' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Произошла непредвиденная ошибка' });
    }
});

// найти аудитории по id кафедры
app.get('/api/find_by_kaf', async (req, res) => {
    try {
        const { kafId } = req.query; // { kafId: kj2niu1nrijwenjkgnsdkjng }

        const wantedKaf = await KafsModel.findOne({ _id: kafId }).populate({ path: 'audsIds' });
        if (!wantedKaf)
            return res.status(404).json({ message: `Кафедра с ID = ${kafId} не найдена` });

        const wantedAuds = wantedKaf.audsIds;
        if (!wantedAuds.length)
            return res
                .status(404)
                .json({ message: `За кафедрой с ID = ${kafId} аудитории не закреплены` });

        return res.status(200).json(wantedAuds);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Непредвиденная ошибка на сервере' });
    }
});

// получить список кафедр
app.get('/api/get_kafs', async (req, res) => {
    try {
        const { populate } = req.query;

        let kafs = [];

        if (populate) kafs = await KafsModel.find({}).populate({ path: 'audsIds' });
        else kafs = await KafsModel.find({});

        if (!kafs.length) return res.status(404).json({ message: 'Кафедры не найдены' });

        return res.status(200).json(kafs);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Непредвиденная ошибка на сервере' });
    }
});

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

    const subjects = getRange(`../files/${group}.xlsx`, 'A39:O51');

    return res.status(200).json(subjects);
});

app.get('/api/schedule', async (req, res) => {
    try {
        const { workDir, group, kafId } = req.query;

        const schedule = getRectangleFromExcel(`${workDir}${group}.xlsx`, 'D6:Z34');

        if (kafId) {
            const thisKaf = await KafsModel.findOne({ _id: kafId }).populate({ path: 'audsIds' });
            const audsTitle = thisKaf.audsIds.map((aud) => aud.title);

            const filteredByKaf = [];
            for (let i = 0; i < schedule.length; i += 1) {
                for (let j = 0; j < audsTitle.length; j += 1) {
                    const hello = schedule[i].jobs.map(
                        (job) =>
                            job.includes(audsTitle[j]) &&
                            !job.includes('самоподготовка') &&
                            !job.includes('хозяйственный день'),
                    );
                    if (hello.some((str) => str)) {
                        filteredByKaf.push(schedule[i]);
                    }
                }
            }

            return res.status(200).json(filteredByKaf);
        }

        return res.status(200).json(schedule);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Произошла непредвиденная ошибка' });
    }
});

app.get('/api/today', async (req, res) => {
    const { workDir } = req.query;

    const groupsSchedule = [];
    let cnt = 0;

    const schedule = fs
        .readdirSync(path.resolve(__dirname, workDir))
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

app.use('/', (req, res) => res.sendFile(path.resolve(__dirname, './dist/index.html')));

start();
