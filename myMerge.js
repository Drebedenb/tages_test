const fs = require('fs');
const {createInterface} = require("readline");

function getMinStringIndexInArray(arr) {
    let indexOfMin = 0;
    let min = arr.forEach(function (item, index) {
        if (item !== null) indexOfMin = index
    })
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === null) continue;
        if (arr[i].localeCompare(min) === -1) {
            min = arr[i]
            indexOfMin = i;
        }
    }
    return indexOfMin;
}

async function mergeSortedFilesInSortedFile(filePaths, outputPath) {
    console.log(filePaths)
    const writerStream = fs.createWriteStream(outputPath, {highWaterMark: 1});
    const inputReaders = filePaths.map(file => fs.createReadStream(file, {highWaterMark: 1}));
    const readInterfaces = inputReaders.map(reader => createInterface({input: reader}));
    const firstStringsOfFiles = Array(readInterfaces.length).fill(null)

    function getNextLine(indexOfReadInterface) {
        if (readInterfaces[indexOfReadInterface] === null) return null;
        return new Promise((resolve) => {
            let isFirstLine = true;
            readInterfaces[indexOfReadInterface].on('line', (line) => {
                if (isFirstLine) {
                    isFirstLine = false;
                    resolve(line);
                }
            });
            readInterfaces[indexOfReadInterface].on('close', () => {
                readInterfaces[indexOfReadInterface] = null //TODO: bad practise to change outrange veriable
                resolve(null);
            });
        });
    }

    do  {
        for (let i = 0; i < readInterfaces.length; i++) {
            if (firstStringsOfFiles[i] === null) {
                firstStringsOfFiles[i] = await getNextLine(i)
            }
        }
        const indexOfMinElement = getMinStringIndexInArray(firstStringsOfFiles)
        writerStream.write(firstStringsOfFiles[indexOfMinElement] + '\n')
        firstStringsOfFiles[indexOfMinElement] = null
    } while (!firstStringsOfFiles.every(element => element === null))
}

module.exports = {mergeSortedFilesInSortedFile};