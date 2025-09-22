const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

const { getRectangleFromExcel, getRange } = require('./utils/parser');

const { AudsModel, KafsModel } = require('./models/index');

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 5000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/schedule-viewer';
const filesDir = process.env.FILES_DIR || path.resolve(__dirname, './files/');

app.use(express.json());
app.use(cors());

const start = async () => {
    try {
        await mongoose.connect(mongoUri);

        app.listen(port, () => {
            console.log(`Server started on http://localhost:${port}`);
        });
    } catch (e) {
        console.log('Ошибка подключения к БД:', e);
        process.exit(1);
    }
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
            if (!wantedKaf) return res.status(404).json({ message: 'Кафедра не найдена' });
            const wantedAuds = wantedKaf.audsIds || [];

            for (let i = 0; i < wantedAuds.length; i += 1) {
                await AudsModel.deleteOne({ _id: wantedAuds[i] });
            }

            await KafsModel.deleteOne({ _id: kafId });

            return res.status(200).json({ message: 'Кафедра удалена' });
        }

        return res.status(400).json({ message: 'Не передан audId или kafId' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Произошла непредвиденная ошибка' });
    }
});

// создание кафедры
app.post('/api/create_kaf', async (req, res) => {
    try {
        const { title } = req.body;

        const createdKaf = await KafsModel.create({
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

app.get('/api/fetch_auds', async (req, res) => {
    try {
        const auds = await AudsModel.find({}).lean();
        if (!auds?.length) return res.status(404).json({ message: 'Аудиторий не найдено' });
        return res.status(200).json(auds);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Непредвиденная ошибка на сервере' });
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
    try {
        const dirToRead = filesDir;
        const files = fs.readdirSync(dirToRead);
        const title = files
            .filter((file) => file.endsWith('.xlsx') && !file.startsWith('~'))
            .map((file) => path.basename(file).split('.')[0]);

        return res.status(200).json(title);
    } catch (e) {
        console.log('ошибка', e);
        return res.status(500).json({ message: 'Директория не найдена' });
    }
});

app.get('/api/subjects', (req, res) => {
    const { group } = req.query;

    const safeGroup = path.basename(group || '');
    const filePath = path.resolve(filesDir, `${safeGroup}.xlsx`);

    const subjects = getRange(filePath, 'A39:O60');

    const filteredSubjects = subjects.filter((s) => s.abbr?.length > 0 && s.abbr?.length <= 4);

    return res.status(200).json(filteredSubjects);
});

app.get('/api/schedule', async (req, res) => {
    try {
        const { group, kafId } = req.query;

        const safeGroup = path.basename(group || '');
        const filePath = path.resolve(filesDir, `${safeGroup}.xlsx`);

        let schedule = getRectangleFromExcel(filePath, 'D6:Y34');
        schedule = schedule.map((day) => ({ ...day, groupName: group }));

        // if (kafId) {
        //     const thisKaf = await KafsModel.findOne({ _id: kafId }).populate({ path: 'audsIds' });
        //     const audsTitle = thisKaf.audsIds.map((aud) => aud.title);
        //
        //     const filteredByKaf = [];
        //     for (let i = 0; i < schedule.length; i += 1) {
        //         for (let j = 0; j < audsTitle.length; j += 1) {
        //             const hello = schedule[i].jobs.map(
        //                 (job) =>
        //                     job.includes(audsTitle[j]) &&
        //                     !job.includes('самоподготовка') &&
        //                     !job.includes('хоз. день'),
        //             );
        //
        //             if (
        //                 hello.some((str) => str) &&
        //                 !filteredByKaf.find((day) => day.date === schedule[i].date)
        //             ) {
        //                 filteredByKaf.push(schedule[i]);
        //             }
        //         }
        //     }
        //
        //     return res.status(200).json(filteredByKaf);
        // }

        return res.status(200).json(schedule);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Произошла непредвиденная ошибка' });
    }
});

app.get('/api/today', async (req, res) => {
    try {
        const { viewedDay } = req.query;

        const groupsSchedule = [];
        let cnt = 0;

        const schedule = fs
            .readdirSync(filesDir)
            .filter((file) => file.endsWith('.xlsx') && !file.includes('~'));

        schedule.forEach((file) => {
            groupsSchedule.push(getRectangleFromExcel(path.resolve(filesDir, file), 'D6:Y34'));
        });

        const result = [];
        groupsSchedule
            .map((group) =>
                group.filter((day) => {
                    const today = new Date(viewedDay).setHours(0, 0, 0, 0);
                    const date = new Date(day.date).setHours(0, 0, 0, 0);
                    return today === date;
                }),
            )
            .filter((group) => !group?.jobs)
            .map((group) => {
                group[0] = {
                    ...group[0],
                    groupName: schedule[cnt]?.split('.')[0],
                };
                cnt += 1;
                return result.push(group[0]);
            });

        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Произошла ошибка' });
    }
});

start();
