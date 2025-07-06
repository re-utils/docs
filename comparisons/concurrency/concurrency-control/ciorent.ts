import { semaphore } from 'ciorent';
import { setTimeout } from 'node:timers/promises';

const sem = semaphore.init(2);
const asyncTask = async () => {
  await semaphore.acquire(sem);
  await setTimeout(5);
  semaphore.release(sem);
};

for (let i = 0; i < 100; i++) asyncTask();
