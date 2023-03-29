import { Bucket, Storage } from '@google-cloud/storage';

let storage: Storage;

function getStorage(): Storage {
  if (!storage) {
    if (process.env.GOOGLE_SERVICE_ACCOUNT_CRED) {
      storage ||= new Storage({
        credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CRED),
      });
    } else {
      // we'd better be running in GCE
      storage ||= new Storage();
    }
  }
  return storage;
}

console.debug('getStorage', process.env.GOOGLE_SERVICE_ACCOUNT_CRED);

export function getBucket(name = process.env.GOOGLE_STORAGE_BUCKET!): Bucket {
  return getStorage().bucket(name);
}
