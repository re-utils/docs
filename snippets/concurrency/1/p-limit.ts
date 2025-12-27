import { limitFunction } from 'p-limit';
import { streamToOutput, streamFile } from './output.ts';

const lockedStreamToOutput = limitFunction(
  streamToOutput,
  { concurrency: 1 }
);
for (let i = 0; i < 5; i++)
  lockedStreamToOutput(streamFile(i));
