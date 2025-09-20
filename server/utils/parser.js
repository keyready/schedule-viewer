const XLSX = require('xlsx');

function getRectangleFromExcel(fileName, rectangleVertices) {
    const workbook = XLSX.readFile(fileName);

    const sheet_name_list = workbook.SheetNames;
    const worksheet = workbook.Sheets[sheet_name_list[0]];

    const vertices = rectangleVertices.split(':').map((vertex) => XLSX.utils.decode_cell(vertex));

    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const selectedData = [];

    for (let col = vertices[0].c; col <= vertices[1].c; col += 1) {
        const columnData = [];
        for (let row = vertices[0].r; row <= vertices[1].r; row += 1) {
            columnData.push(data[row][col]);
        }
        selectedData.push(columnData);
    }

    const result = [];
    let realIndex = 0;

    for (let i = 0; i < selectedData.length; i += 1) {
        for (let j = 0; j < selectedData[i].length; j += 1) {
            result.push({
                date: '',
                jobs: [],
            });
        }
    }

    selectedData.forEach((column) => {
        let date = new Date();
        column.forEach((cell) => {
            if (/^\d+$/.test(cell)) {
                date = new Date((cell - (25567 + 2)) * 86400 * 1000);
                result[realIndex].date = date;
            } else if (cell && typeof cell === 'string') {
                const lines = cell
                    .split(/\r?\n/)
                    .map((l) => l.trim())
                    .filter(Boolean);

                let type;
                let discipline;
                let room;

                if (lines.length >= 3) {
                    type = lines[0];
                    discipline = lines[1];
                    room = lines[2];
                } else {
                    const firstLine = lines[0];

                    const match = firstLine.match(/^([А-ЯЁ]+(?:\.[А-ЯЁ]+)*)(?:\s+(.*))?$/);
                    if (!match) {
                        result[realIndex].jobs.push(cell);
                        return;
                    }

                    type = match[1]; // аббревиатура
                    const rest = match[2] || '';

                    const roomMatch = rest.match(/(\d+[-\s]\d+)/);
                    if (roomMatch) {
                        room = roomMatch[1];
                        discipline = rest.replace(roomMatch[0], '').trim() || type;
                    } else {
                        discipline = rest.trim() || type;
                        room = lines?.length > 1 ? lines[lines.length - 1] : '?';
                    }
                }

                result[realIndex].jobs.push(
                    `Тип занятия: ${type}, дисциплина: ${discipline}, аудитория: ${room}`,
                );
            }

            if (date.getDay() === 6) {
                if (result[realIndex].jobs.length >= 3) {
                    result[realIndex].jobs.push(
                        'Тип занятия: хоз. день, дисциплина: хоз. день, аудитория: Убежище',
                    );

                    result[realIndex + 1].date = new Date(
                        new Date(result[realIndex].date).getTime() + 24 * 60 * 60 * 1000,
                    );
                    for (let i = 0; i < 4; i += 1) {
                        result[realIndex + 1].jobs.push(
                            'Тип занятия: Выходной день, Выходной день, аудитория: Каз.63',
                        );
                    }

                    realIndex += 2;
                }
            } else if (result[realIndex].jobs.length >= 4) realIndex += 1;
        });
    });

    return result.filter((obj) => obj.date !== '');
}

function getRange(fileName, rectangleVertices) {
    const workbook = XLSX.readFile(fileName);

    const sheet_name_list = workbook.SheetNames;
    const worksheet = workbook.Sheets[sheet_name_list[0]];

    const vertices = rectangleVertices.split(':').map((vertex) => XLSX.utils.decode_cell(vertex));

    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const selectedData = [];

    for (let col = vertices[0].c; col <= vertices[1].c; col += 1) {
        const columnData = [];
        for (let row = vertices[0].r; row <= vertices[1].r; row += 1) {
            columnData.push(data?.[row]?.[col]);
        }
        selectedData.push(columnData);
    }

    const str = [];
    for (let i = 0; i < selectedData.length; i += 1) {
        str.push([]);
    }

    selectedData
        .filter((arr) => arr.length > 0 && arr.some((el) => el !== undefined))
        .forEach((column, index) => {
            column.forEach((cell) => {
                str[index].push(cell);
            });
        });

    const rawData = str.filter((cell) => cell.length > 0);

    const disciplinesLength = rawData[1]?.length;
    const subjects = [];
    const parsingResult = [];

    for (let j = 0; j < 7; j += 1) {
        if (rawData[j]) parsingResult.push(rawData[j]?.slice(0, disciplinesLength));
    }

    for (let i = 0; i < disciplinesLength - 1; i += 1) {
        subjects.push({
            abbr: parsingResult[0][i],
            title: parsingResult[1][i],
            lectern: ~~parsingResult[3][i],
            trainer: parsingResult?.[4]?.[i] || parsingResult?.[6]?.[i] || 'Не указан',
        });
    }

    return subjects;
}

module.exports = {
    getRectangleFromExcel,
    getRange,
};
