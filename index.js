const fs = require('fs');
const {createInterface} = require("readline");
const {mergeSortedFilesInSortedFile} = require('./myMerge')

// TODO: try to make workers after success

const RAM_SIZE = 15; //500mb
const PATH_TO_BIG_FILE = 'test.txt'
const PATH_TO_OUTPUT_FILE = 'output.txt'

// function createSortTransformStream(chunkIndex) {
//     return new stream.Transform({
//         transform: transformFunc
//     });
//
//     function transformFunc(chunk, encoding, callback) {
//         const lines = chunk.toString().split('\n');
//         const sortedChunkStr = lines.filter(line => line.trim() !== '').sort().join('\n');
//         const sortedChunk = Buffer.from(sortedChunkStr + '\n');
//
//         const chunkFilePath = `temp_file_${chunkIndex}.txt`;
//         fs.writeFileSync(chunkFilePath, sortedChunk);
//         console.log(`${chunkIndex} temp file was created`);
//
//         callback();
//     }
// }

function main() {
    const readerStream = fs.createReadStream(PATH_TO_BIG_FILE, { highWaterMark: RAM_SIZE });

    //we need interface because strings can be damaged by simply splitting by highWaterMark bytes
    const rl = createInterface({ input: readerStream });

    let currentChunk = '';
    let chunkIndex = 0;
    const chunkFilePaths = []

    rl.on('line', line => {
        currentChunk += line + '\n';

        if (currentChunk.length >= RAM_SIZE) {
            const sortedCurrentChunk = currentChunk.split('\n')
                .filter(line => line.trim() !== '').sort().join('\n');

            const chunkFilePath = `temp_file_${chunkIndex}.txt`;
            chunkFilePaths.push(chunkFilePath)
            fs.writeFileSync(chunkFilePath, sortedCurrentChunk);
            console.log(`${chunkIndex} temp file was created`);

            currentChunk = '';
            chunkIndex++;
        }
    });

    rl.on('close', () => {
        if (currentChunk.length > 0) {
            const sortedCurrentChunk = currentChunk.split('\n')
                .filter(line => line.trim() !== '').sort().join('\n');

            const chunkFilePath = `temp_file_${chunkIndex}.txt`;
            chunkFilePaths.push(chunkFilePath)
            fs.writeFileSync(chunkFilePath, sortedCurrentChunk);
            console.log(`${chunkIndex} temp file was created on close`);
        }

        mergeSortedFilesInSortedFile(chunkFilePaths, PATH_TO_OUTPUT_FILE)
    });
}

main()