const fs = require('fs');
const es = require('event-stream');
const {pipeline} = require("stream");
const {mergeSortedFiles} = require("./all_in_one")

const RAM_SIZE = 500 * 1024 * 1024; //500mb
//
// let readerStream = fs.createReadStream('itcont.txt', {highWaterMark: RAM_SIZE})
// let writerStream = fs.createWriteStream('test.txt')
//
// let chunkIndex = 0;
// const arrOfChuncks = []
// readerStream.on('data', function (chunk) {
//     const chunkFilePath = `temp_chunk_${chunkIndex}.txt`;
//     arrOfChuncks.push(chunkFilePath)
//     const sortedChunk = chunk.sort()
//     fs.writeFileSync(chunkFilePath, sortedChunk);
//     chunkIndex++;
//     // console.log(chunk);
//     // writerStream.write(chunk);
// });

const arrOfChuncks = [
    'temp_chunk_0.txt',
    'temp_chunk_1.txt',
    'temp_chunk_2.txt',
    'temp_chunk_3.txt',
    'temp_chunk_4.txt',
    'temp_chunk_5.txt',
    'temp_chunk_6.txt',
    'temp_chunk_7.txt',
    'temp_chunk_8.txt',
]
mergeSortedFiles([...arrOfChuncks], 'big_file.txt')


// pipeline(
//     fs.createReadStream('big_file.txt'),
//     fs.createWriteStream('test.txt'),
//     (err) => {
//         if (err) {
//             console.error('Pipeline failed.', err);
//         } else {
//             console.log('Pipeline succeeded.');
//         }
//     }
// );

// readerStream.on('end', function (){
//     console.log('End writing')
// })