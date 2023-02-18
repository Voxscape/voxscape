import debug from 'debug';

export function createServerLogger(filename: string): debug.Debugger {
  return debug(
    filename
      .split('/')
      .join(':')
      .replace(/^.*server:/, 'voxscape:server:')
      .replace(/^.*pages:api:/, 'voxscape:api:')
      .replace(/\.(ts|js)$/i, ''),
  );
}
