import { mutex } from 'ciorent';
import { streamToOutput, streamFile } from './output.ts';

const mu = mutex.init();
for (let i = 0; i < 5; i++)
  mutex.run(mu, streamToOutput, streamFile(i));
