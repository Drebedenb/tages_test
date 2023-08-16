const fs = require('fs');

function mergeSortedFilesInSortedFile(filePaths, output) {
    const arrOfLastPointers = Array(filePaths.length).fill(0)
    const allLengths = filePaths.reduce((prev, item) => +item.length + +prev, 0)
    console.log(allLengths)
}

module.exports = {mergeSortedFilesInSortedFile};