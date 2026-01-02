export const readFile = (path: string) => Bun.file(path).arrayBuffer();
export const hash = Bun.hash;
