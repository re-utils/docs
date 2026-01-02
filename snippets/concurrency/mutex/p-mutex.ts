import Mutex from 'p-mutex';
import { streamToOutput, streamFile } from './output.ts';

const mu = new Mutex();
for (let i = 0; i < 5; i++)
  mu.withLock(() => streamToOutput(streamFile(i)));
