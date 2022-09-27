import { decodeStringToArrayBuffer, encodeArrayBufferToString } from './conversion-es';
import { readBlobAsArrayBuffer } from './conversion-web';
import { convertBufferToString } from './conversion-node';

/**
 * TODO: move to ts-commonutils
 */
export const binaryConversion = {
  arrayBuffer: {
    toString: encodeArrayBufferToString,
  },
  string: {
    toArrayBuffer: decodeStringToArrayBuffer,
  },
  blob: {
    toArrayBuffer: readBlobAsArrayBuffer,
    toString: (b: Blob) => readBlobAsArrayBuffer(b).then(encodeArrayBufferToString),
  },
  buffer: {
    toString: convertBufferToString,
  },
} as const;
