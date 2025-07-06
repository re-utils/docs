import { readDir, test } from '../../utils.js';

export default test({
  title: 'Basic injection',
  description: 'Use and inject one dependency.',
  code: readDir(import.meta.dir, ['udic', 'effect']),
});
