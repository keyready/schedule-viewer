const XLSX = require('xlsx');

function getRectangleFromExcel(fileName, rectangleVertices) {
    const workbook = XLSX.readFile(fileName);

    const sheet_name_list = workbook.SheetNames;
    const worksheet = workbook.Sheets[sheet_name_list[0]];

    const vertices = rectangleVertices.split(':').map(function (vertex) {
        return XLSX.utils.decode_cell(vertex);
    });

    const data = XLSX.utils.sheet_to_json(worksheet, {header: 1});

    const selectedData = [];

    for (let col = vertices[0].c; col <= vertices[1].c; col++) {
        const columnData = [];
        for (let row = vertices[0].r; row <= vertices[1].r; row++) {
            columnData.push(data[row][col]);
        }
        selectedData.push(columnData);
    }

    const str = [];

    selectedData.map((column, index) => {
        str.push([]);
        column.map((cell) => {
            if (/^\d+$/.test(cell)) {
                str[index].push('             ' + new Date(
                    (cell - (25567 + 2)) * 86400 * 1000
                ).toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                }) + '             ')
            } else if (!cell?.length) {
                str[index].push(`Тип занятия: самоподготовка, аудитория: 314-6`)
            } else if (cell.includes('\r\n')) {
                const row = cell.split('\r\n');
                str[index].push(
                    `Тип занятия: ${row[0]}, дисциплина: ${row[1]}, аудитория: ${row[2]}`
                );
            } else if (/[А-ЯЁёа-я]/.test(cell)) {
                str[index].push('                ' + cell + '                ');
            }
        });
    });

    return str;
}

module.exports = {
    getRectangleFromExcel
}
