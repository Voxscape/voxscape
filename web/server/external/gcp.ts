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

export function composeUserAssetPath(userId: string, path: string): string {
  return `u-${userId}/${path}`;
}

export function decomposeUserAssetUrl(url: string): null | { userId: string; path: string } {
  if (!isGcpObjectUrl(url)) {
    return null;
  }
  const path = new URL(url).pathname;
  const [bucket, userId, ...rest] = path.split('/').filter(Boolean);
  if (/^u-.+$/.test(userId)) {
    return {
      userId: userId.slice(2),
      path: rest.join('/'),
    };
  }
  return null;
}
