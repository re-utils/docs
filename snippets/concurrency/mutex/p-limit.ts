import pLimit from 'p-limit';
import { streamToOutput, streamFile } from './output.ts';

const limit = pLimit(1);
for (let i = 0; i < 5; i++)
  limit(streamToOutput, streamFile(i));
