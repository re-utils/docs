import * as di from 'udic';

const random = di.service('random')<() => number>;
const main = di.use([random], (random) => {
  console.log('Random number:', random());
});

main({ random: Math.random });
