import oneDep from './one-dependency/_.js';
import multiDep from './multiple-services/_.js';
import chainedDeps from './dependent-services/_.js';

import { category } from '../utils.js';

export default category({
  output: 'di/comparisons',
  description: 'Compare **udic** with other DI libraries.',
  list: [oneDep, chainedDeps, multiDep],
});
