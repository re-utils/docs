import { latch, semaphore } from 'ciorent';
import { formatSecond } from './utils.js';

const OUTPUT = import.meta.dir + '/startup.json';
const sem = semaphore.init(1);

export const startupRunner = (requiredItems: number) => {
  let COMMANDS: string[] = [];
  const COMMAND_LATCH = latch.init();
  const results: Record<string, string> = {};

  return {
    addCommand: async (s: string) => {
      COMMANDS.push(s);
      if (COMMANDS.length === requiredItems) {
        // Only one benchmark can run
        await semaphore.acquire(sem);

        try {
          await Bun.$`hyperfine -w 20 -N --export-json ${OUTPUT} ${COMMANDS}`;
          const groups = Object.groupBy(
            (await Bun.file(OUTPUT).json()).results as any[],
            ({ command }) => command,
          );

          for (const key in groups) {
            // @ts-ignore
            results[key] = formatSecond(groups[key][0].mean);
          }
        } catch (e) {
          console.error('Running benchmark failed:', e);
        }

        latch.open(COMMAND_LATCH);
        semaphore.release(sem);
      }

      await latch.wait(COMMAND_LATCH);

      // On error
      return results[s] ?? 'n/a';
    },
  };
};

export type StartupRunner = ReturnType<typeof startupRunner>;
