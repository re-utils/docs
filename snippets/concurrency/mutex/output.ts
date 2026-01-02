import { createReadStream, createWriteStream, ReadStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

const outputStream = createWriteStream(import.meta.dir + '/all-output.txt');
export const streamToOutput = (stream: ReadStream) => pipeline(stream, outputStream);
export const streamFile = (id: number): ReadStream => createReadStream(import.meta.dir + '/output' + id + '.txt');
