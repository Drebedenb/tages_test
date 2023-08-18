const fs = require('fs');
const {createInterface} = require("readline");
const {mergeSortedFilesInSortedFile} = require('./myMerge')
const { Worker, isMainThread} = require('worker_threads');

const RAM_SIZE = 1; //500mb is 500 * 1024 * 1024 bytes
const PATH_TO_BIG_FILE = 'test.txt'
const PATH_TO_OUTPUT_FILE = 'output.txt'
const WORKER_SCRIPT_PATH = './worker.js'

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

if (isMainThread) {
    function main() {
        const readerStream = fs.createReadStream(PATH_TO_BIG_FILE, {highWaterMark: RAM_SIZE});

        //we need interface because strings can be damaged by simply splitting by highWaterMark bytes
        const rl = createInterface({input: readerStream});

        let currentChunk = '';
        let chunkIndex = 0;
        let sortedChunksAmount = 0;
        const chunkFilePaths = []

        rl.on('line', line => {
            currentChunk += line + '\n';

            if (currentChunk.length >= RAM_SIZE) {
                const worker = new Worker(WORKER_SCRIPT_PATH, {
                    workerData: {chunkIndex: chunkIndex, chunkContent: currentChunk}
                });
                worker.on('message', async (data) => {
                    console.log(`${data.index} worker finihed`)
                    console.log(`${data.index} temp file was created`)
                    chunkFilePaths.push(data.path)
                    sortedChunksAmount++;
                    if (sortedChunksAmount === chunkIndex){ //cheok for all chunks was sorted
                        console.log('All chunks was created and sorted')
                        await mergeSortedFilesInSortedFile(chunkFilePaths, PATH_TO_OUTPUT_FILE)
                        chunkFilePaths.forEach(path => fs.unlink(path,
                            (err) => err)) //delete temporary files
                        console.log('File was sorted')
                    }
                });
                worker.on('error', (err) => {
                    console.error(err)
                });

                currentChunk = '';
                chunkIndex++;
            }
        });

        rl.on('close', () => {
            if (currentChunk.length > 0) {
                const sortedCurrentChunk = currentChunk.split('\n')
                    .filter(line => line.trim() !== '').sort().join('\n');

                const chunkFilePath = `temp_file_sorted_${chunkIndex}.txt`;
                chunkFilePaths.push(chunkFilePath)
                fs.writeFileSync(chunkFilePath, sortedCurrentChunk);
                console.log(`${chunkIndex} temp file was created on close`);
            }
        });
    }
}

main()