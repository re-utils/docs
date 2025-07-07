import { limitFunction } from 'p-limit';
import { setTimeout } from 'node:timers/promises';

const asyncTask = limitFunction(
  async () => {
    await setTimeout(5);
  },
  { concurrency: 2 },
);

for (let i = 0; i < 100; i++) asyncTask();
