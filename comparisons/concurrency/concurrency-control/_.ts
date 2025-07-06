import { readDir, test } from '../../utils.js';

export default test({
  title: 'Concurrency control',
  description: 'Control the amount of tasks running concurrently.',
  code: readDir(import.meta.dir, ['ciorent', 'p-limit', 'effect']),
});
