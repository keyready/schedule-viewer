const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

const fs = require('fs');
const path = require('path');

const months = 'января февраля марта апреля мая июня июля августа сентября октября ноября декабря';

function generateDocument(data, filename) {
    const content = fs.readFileSync(path.resolve(__dirname, '../files/template.docx'), 'binary');

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });

    let names = '';
    data.names.forEach((name, index) => {
        names += `${index + 1}) ${name}\n`;
    });

    doc.render({
        ...data,
        names,
        current_month: months.split(' ')[new Date().getMonth()],
    });

    const buf = doc.getZip().generate({
        type: 'nodebuffer',
        compression: 'DEFLATE',
    });

    fs.writeFileSync(path.resolve(__dirname, `../files/${filename}.docx`), buf);
}

module.exports = {
    generateDocument,
};
