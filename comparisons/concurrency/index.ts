import concurrencyControl from './concurrency-control/_.js';

import { category } from '../utils.js';

export default category({
  output: 'concurrency/comparisons',
  description: 'Compare **ciorent** with other concurrency libraries.',
  list: [concurrencyControl],
});
