import { processCategory } from './build.js';
import di from './di/index.js';

// Process all categories
await Promise.all([di].map(processCategory));
