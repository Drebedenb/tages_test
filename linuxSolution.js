const { spawn } = require('child_process');
const {createWriteStream} = require("fs");

const PATH_TO_BIG_FILE = 'itcont.txt';
const PATH_TO_OUTPUT_FILE = 'output.txt';

const sortProcess = spawn('sort', [PATH_TO_BIG_FILE]);

sortProcess.stdout.pipe(createWriteStream(PATH_TO_OUTPUT_FILE));

sortProcess.on('exit', (code) => {
    if (code === 0) {
        console.log('File sorted successfully.');
    } else {
        console.error('Sorting process exited with an error code:', code);
    }
});