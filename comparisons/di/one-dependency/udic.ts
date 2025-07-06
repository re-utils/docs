import { service, derive } from 'udic';

const random = service('random')<() => number>();

const main = derive([random], (random) => {
  console.log('Random number:', random());
});

main({ random: Math.random });
