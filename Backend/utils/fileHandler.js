const fs = require("fs");
const path = require("path");

/**
 * Read JSON data safely from a file
 */
function readData(filePath) {
  try {
    const fullPath = path.resolve(filePath);

    if (!fs.existsSync(fullPath)) {
      return []; // file not found → return empty array
    }

    const data = fs.readFileSync(fullPath, "utf-8");

    if (!data) return []; // empty file safe fallback

    return JSON.parse(data);
  } catch (err) {
    console.error("Read error:", err.message);
    return []; // safe fallback
  }
}

/**
 * Write JSON data safely to a file
 */
function writeData(filePath, data) {
  try {
    const fullPath = path.resolve(filePath);

    fs.writeFileSync(
      fullPath,
      JSON.stringify(data, null, 2),
      "utf-8"
    );

    return true;
  } catch (err) {
    console.error("Write error:", err.message);
    return false;
  }
}

/**
 * Append single item to JSON array file
 */
function appendData(filePath, item) {
  try {
    const data = readData(filePath);

    data.push(item);

    writeData(filePath, data);

    return true;
  } catch (err) {
    console.error("Append error:", err.message);
    return false;
  }
}

module.exports = {
  readData,
  writeData,
  appendData,
};