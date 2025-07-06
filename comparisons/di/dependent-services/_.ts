import { readDir, test } from '../../utils.js';

export default test({
  title: 'Dependent services',
  description:
    'Use and inject 3 dependencies, with `log` depends on `config` and `db` depends on both `log` and `config`.',
  code: readDir(import.meta.dir, ['udic', 'effect']),
});
