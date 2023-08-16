const fs = require('fs');

function mergeSortedFilesInSortedFile(inputFiles, outputFile) {
    const fileStreams = inputFiles.map(file => fs.createReadStream(file, 'utf-8'));
    const outputStream = fs.createWriteStream(outputFile);

    const lineHeap = new MinHeap();

    // Initialize the heap with the first lines from each input file
    fileStreams.forEach((stream, index) => {
        const line = getNextLine(stream);
        if (line !== null) {
            lineHeap.insert({ line, index });
        }
    });

    while (!lineHeap.isEmpty()) {
        const { line, index } = lineHeap.extractMin();
        outputStream.write(line + '\n');

        const nextLine = getNextLine(fileStreams[index]);
        if (nextLine !== null) {
            lineHeap.insert({ line: nextLine, index });
        }
    }

    outputStream.end();

    // Close all file streams
    fileStreams.forEach(stream => stream.close());
}

function getNextLine(stream) {
    const buffer = Buffer.alloc(1024);
    let line = '';
    let bytesRead = 0;

    while (true) {
        bytesRead = stream.read(buffer, 0, buffer.length);
        if (bytesRead === null) {
            // End of file reached
            return null;
        }

        const data = buffer.toString('utf-8', 0, bytesRead);
        const newlineIndex = data.indexOf('\n');

        if (newlineIndex !== -1) {
            line += data.substring(0, newlineIndex);
            stream.unshift(data.substring(newlineIndex + 1)); // Unread the remaining data
            break;
        } else {
            line += data;
        }
    }

    return line;
}

class MinHeap {
    constructor() {
        this.heap = [];
    }

    insert(value) {
        this.heap.push(value);
        this.bubbleUp(this.heap.length - 1);
    }

    extractMin() {
        const minValue = this.heap[0];
        const lastValue = this.heap.pop();

        if (this.heap.length > 0) {
            this.heap[0] = lastValue;
            this.bubbleDown(0);
        }

        return minValue;
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    bubbleUp(index) {
        const value = this.heap[index];
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            const parent = this.heap[parentIndex];
            if (parent.line <= value.line) {
                break;
            }
            this.heap[index] = parent;
            index = parentIndex;
        }
        this.heap[index] = value;
    }

    bubbleDown(index) {
        const value = this.heap[index];
        while (true) {
            let childIndex = index * 2 + 1;
            if (childIndex >= this.heap.length) {
                break;
            }
            if (childIndex + 1 < this.heap.length && this.heap[childIndex + 1].line < this.heap[childIndex].line) {
                childIndex++;
            }
            if (this.heap[childIndex].line >= value.line) {
                break;
            }
            this.heap[index] = this.heap[childIndex];
            index = childIndex;
        }
        this.heap[index] = value;
    }
}

// Usage
const inputFiles = ['file1.txt', 'file2.txt', 'file3.txt'];
const outputFile = 'big_file.txt';
mergeSortedFilesInSortedFile(inputFiles, outputFile);

module.exports = {mergeSortedFilesInSortedFile};