import { Bucket, Storage } from '@google-cloud/storage';

let storage: Storage;

function getStorage(): Storage {
  if (!storage) {
    if (process.env.GOOGLE_SERVICE_ACCOUNT_CRED) {
      storage ||= new Storage({
        credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CRED),
      });
    } else {
      // we'd better have $GOOGLE_APPLICATION_CREDENTIALS set, or have obtained permissions from SA
      storage ||= new Storage();
    }
    storage.authClient.getClient().then((c) => {
      if ('email' in c) {
        console.debug('GCP Service Account', c.email);
      }
    });
  }
  return storage;
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const bucketName: string = process.env.GOOGLE_STORAGE_BUCKET!;

export function getBucket(): Bucket {
  return getStorage().bucket(bucketName);
}

export function isGcpObjectUrl(url: string): boolean {
  return url.startsWith(`https://storage.googleapis.com/${bucketName}/`);
}
