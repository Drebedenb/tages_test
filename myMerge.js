const fs = require('fs');
const {createInterface} = require("readline");

function getMinStringIndexInArray(arr) {
    let min = arr[0]
    let indexOfMin = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].localeCompare(min) === -1) {
            min = arr[i]
            indexOfMin = i;
        }
    }
    return indexOfMin;
}

async function mergeSortedFilesInSortedFile(filePaths, outputPath) {
    console.log(filePaths)
    const inputReaders = filePaths.map(file => fs.createReadStream(file, {highWaterMark: 1}));
    const readInterfaces = inputReaders.map(reader => createInterface({input: reader}));
    const lastStringsOfFiles = Array(readInterfaces.length).fill(null)

    function getNextLine(indexOfReadInterface) {
        return new Promise((resolve, reject) => {
            let isFirstLine = true;
            readInterfaces[indexOfReadInterface].resume();
            readInterfaces[indexOfReadInterface].on('line', (line) => {
                if (isFirstLine) {
                    console.log('inside of readInterface: ', line)
                    isFirstLine = false;
                    readInterfaces[indexOfReadInterface].pause(); // Pause the interface since we only need the next line
                    resolve(line);
                }
            });
            readInterfaces[indexOfReadInterface].on('close', () => {
                console.log('Close event')
                resolve();
            });
        });
    }



    const promises = []
    // readInterfaces.forEach(function (rl)  {
    //     promises.push(
    //         new Promise((resolve) => {
    //             let isFirstLine = true;
    //             rl.on('line', (line) => {
    //                 if (isFirstLine) {
    //                     isFirstLine = false;
    //                     rl.pause(); // Close the interface since we only need the first line
    //                     resolve(line);
    //                 }
    //             });
    //         })
    //     )
    // })
    // const stringsFromReaders = await Promise.all(promises)
    //
    // console.log(stringsFromReaders);
    console.log(await getNextLine(0))
    console.log(await getNextLine(0))
    console.log(await getNextLine(0))
    console.log(await getNextLine(0))
    console.log(await getNextLine(0))
}

mergeSortedFilesInSortedFile([
    'file1.txt',
    'file2.txt',
    'file3.txt',
], 'output.txt')

module.exports = {mergeSortedFilesInSortedFile};