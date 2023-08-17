const fs = require('fs');
const {workerData, parentPort} = require('worker_threads');

function sortAndWriteChunk(chunkIndex, chunkContent) {
    console.log(`${chunkIndex} worker was started`)
    const sortedLines = chunkContent.split('\n').filter(line => line.trim() !== '').sort();
    const sortedChunkPath = `temp_file_sorted_${chunkIndex}.txt`;
    fs.writeFileSync(sortedChunkPath, sortedLines.join('\n'));
    parentPort.postMessage({ index: chunkIndex, path: sortedChunkPath });
}

sortAndWriteChunk(workerData.chunkIndex, workerData.chunkContent)


