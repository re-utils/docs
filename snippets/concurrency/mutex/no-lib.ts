import type { ReadStream } from 'node:fs';
import { streamToOutput, streamFile } from './output.ts';

let lock = Promise.resolve();
const lockedStreamToOutput = async (inputStream: ReadStream) => {
  try {
    await lock;
  } finally {
    return streamToOutput(inputStream);
  }
}
for (let i = 0; i < 5; i++)
  lock = lockedStreamToOutput(streamFile(i));
