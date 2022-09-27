/**
 conversion: es types <=> node.js Buffer
 */
export function convertBufferToString(buffer: Buffer): string {
  return String.fromCharCode(...buffer.toJSON().data);
}
