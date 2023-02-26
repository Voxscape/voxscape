import debug from 'debug';

export function createDebugLogger(filename: string): debug.Debugger {
  return debug(
    filename
      .split('/')
      .join(':')
      .replace(/^.*server:/, 'voxscape:server:')
      .replace(/^.*pages:api:/, 'voxscape:api:')
      .replace(/^.*pages:/, 'voxscape:pages:')
      .replace(/^.*web:src:/, 'voxscape:web:'),
  );
}
