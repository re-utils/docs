import { readDir, test } from '../../utils.js';

export default test({
  title: 'Multiple dependencies',
  description: 'Use and inject dependencies in different function layers.',
  code: readDir(import.meta.dir, ['udic', 'effect']),
});
