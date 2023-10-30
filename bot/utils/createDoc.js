const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

const fs = require("fs");
const path = require("path");

function generateDocument(data, filename) {
  const content = fs.readFileSync(
    path.resolve(__dirname, "../files/template.docx"),
    "binary"
  );

  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  doc.render({ ...data, name: data.names.join("\n") });

  const buf = doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });

  fs.writeFileSync(path.resolve(__dirname, `../files/${filename}.docx`), buf);
}

module.exports = {
  generateDocument,
};
