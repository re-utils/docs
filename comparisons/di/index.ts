import oneDep from './one-dependency/_.js';
import chainedDeps from './chained-dependencies/_.js';

import { category } from '../utils.js';

export default category({
  output: 'di/comparisons',
  description: 'Compare **udic** with other DI libraries.',
  list: [oneDep, chainedDeps],
});
