import { Bucket, Storage } from '@google-cloud/storage';

let storage: Storage;

function getStorage(): Storage {
  if (!storage) {
    // deployment should have $GOOGLE_APPLICATION_CREDENTIALS set, or have permissions granted via SA
    storage ||= new Storage();
    storage.authClient.getClient().then((c) => {
      if ('email' in c) {
        console.debug('GCP Service Account', c.email);
      }
    });
  }
  return storage;
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const bucketName: string = process.env.GCP_STORAGE_BUCKET!;

export function getBucket(): Bucket {
  return getStorage().bucket(bucketName);
}

export function isGcpObjectUrl(url: string): boolean {
  return url.startsWith(`https://storage.googleapis.com/${bucketName}/`);
}
